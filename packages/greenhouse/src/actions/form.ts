import { cloneNode, FORM_CSS_CLASSES, isFormField, isNotEmpty } from '@finsweet/ts-utils';
import type { JobWithQuestions, Question, Field } from '@finsweet/ts-utils/dist/types/apis/Greenhouse';
import slugify from 'slugify';

import { Form } from '../components/Form';
import type { FormElementsTemplate, FormTemplate } from '../types';
import { ATTRIBUTES, GH_API_BASE, GH_API_JOBS, queryElement } from '../utils/constants';

const GDPR_CONSENT_GIVEN_KEY = 'gdpr_consent_given';

export async function createJobForm(form: HTMLFormElement, jobId: string, boardId: string) {
  const jobsRequest = await fetch(`${GH_API_BASE}/${boardId}/${GH_API_JOBS}/${jobId}?questions=true`);
  const job: JobWithQuestions = await jobsRequest.json();

  const templates = getTemplates(form);

  if (templates === null) {
    return;
  }

  createaInputHidden('job_id', jobId, templates);
  createaInputHidden('board_id', boardId, templates);

  const { questions, compliance, data_compliance, demographic_questions } = job;

  for (const question of questions) {
    createQuestion(question, templates);
  }

  for (const { questions, description } of compliance) {
    createQuestionDescription(description, templates);

    for (const question of questions) {
      createQuestion(question, templates);
    }
  }

  if (demographic_questions) {
    const { header, description, questions } = demographic_questions;

    createQuestionHeader(header, templates);
    createQuestionDescription(description, templates);
    for (const question of questions) {
      createQuestion(question, templates);
    }
  }

  const requiresGDPRCheckbox = data_compliance.some(
    ({ type, requires_consent }) => type === 'gdpr' && requires_consent
  );

  if (requiresGDPRCheckbox) {
    createGDPRCheckbox(templates);
  }

  removeTemplates(templates);

  handleFormSubmissions(form);
}

function createaInputHidden(name: string, value: string, templates: FormTemplate) {
  const { form, wrapper } = templates;
  const { input } = form;
  const inputHidden = cloneNode(input);
  inputHidden.type = 'hidden';
  inputHidden.id = name;
  inputHidden.name = name;
  inputHidden.value = value;
  inputHidden.removeAttribute('data-name');
  inputHidden.removeAttribute('placeholder');
  wrapper.append(inputHidden);
}

function removeTemplates(templates: FormTemplate) {
  templates.description.remove();
  templates.header.remove();
  templates.form.input.remove();
  templates.form.textarea.remove();
  templates.form.checkbox.remove();
  templates.form.select.remove();
  templates.form.label.remove();
}

function getTemplates(form: HTMLFormElement) {
  const questionsWrapper = queryElement<HTMLDivElement>(ATTRIBUTES.element.values.questions, { scope: form });
  const questionsHeader = queryElement<HTMLElement>(ATTRIBUTES.element.values['questions-header'], { scope: form });
  const questionsDescription = queryElement<HTMLElement>(ATTRIBUTES.element.values['questions-description'], {
    scope: form,
  });

  if (!questionsWrapper || !questionsHeader || !questionsDescription) {
    return null;
  }

  const label = questionsWrapper.querySelector<HTMLLabelElement>('label');
  const inputTemplate = questionsWrapper.querySelector<HTMLInputElement>(':scope > input');
  const textAreaTemplate = questionsWrapper.querySelector<HTMLTextAreaElement>('textarea');
  const selectTemplate = questionsWrapper.querySelector<HTMLSelectElement>('select');
  const checkboxTemplate = questionsWrapper.querySelector<HTMLLabelElement>(`.${FORM_CSS_CLASSES.checkboxField}`);

  if (!label || !inputTemplate || !textAreaTemplate || !selectTemplate || !checkboxTemplate) {
    return null;
  }

  return {
    form: {
      label,
      input: inputTemplate,
      textarea: textAreaTemplate,
      select: selectTemplate,
      checkbox: checkboxTemplate,
    },
    wrapper: questionsWrapper,
    header: questionsHeader,
    description: questionsDescription,
  };
}

function createQuestion(question: Question, templates: FormTemplate) {
  const { form, wrapper } = templates;

  const { label, ...formElements } = form;

  const labelId = createQuestionLabel(question, label, wrapper);
  createQuestionField(labelId, question, formElements, wrapper);
}

function createQuestionDescription(text: string, templates: FormTemplate) {
  const { description, wrapper } = templates;

  const descriptionElement = cloneNode(description);
  descriptionElement.innerHTML = decodeHTML(text);
  wrapper.appendChild(descriptionElement);
}

function createQuestionHeader(text: string, templates: FormTemplate) {
  const { header, wrapper } = templates;

  const headerElement = cloneNode(header);
  headerElement.textContent = text;
  wrapper.appendChild(headerElement);
}

function createGDPRCheckbox(templates: FormTemplate) {
  const { form, wrapper } = templates;

  const { checkbox } = form;

  const checkboxWrapper = cloneNode(checkbox);
  const checkboxLabel = checkboxWrapper.querySelector('span');
  const checkboxInput = checkboxWrapper.querySelector('input');
  if (!checkboxLabel || !checkboxInput) return;

  checkboxLabel.textContent = `I give my consent to collect, store, and process my data for the purpose
    of considering me for employment.`;
  checkboxInput.name = GDPR_CONSENT_GIVEN_KEY;

  checkboxInput.required = true;

  wrapper.append(checkboxWrapper);
}

/**
 * This function will decode a html encoded string.
 * @param input The string to be decoded.
 * @returns {string} The decoded string.
 */
export const decodeHTML = (input: string) => {
  const doc = new DOMParser().parseFromString(input, 'text/html');
  return doc.documentElement.textContent || '';
};

function createQuestionLabel(question: Question, label: HTMLLabelElement, wrapper: HTMLElement) {
  const newLabel = cloneNode(label);
  // Label Text
  const labelId = slugify(question.label, { strict: true, lower: true });
  newLabel.id = labelId;
  // Make sure camelcase used is separated by spaces
  newLabel.innerText = question.label.replace(/([a-z])([A-Z])/g, '$1 $2');
  newLabel.removeAttribute('for');

  if (!question.required) label.innerText = `${question.label} (optional)`;

  wrapper.append(newLabel);

  return labelId;
}

function createQuestionField(
  labelId: string,
  question: Question,
  formElements: Omit<FormElementsTemplate, 'label'>,
  wrapper: HTMLElement
) {
  const { input, textarea, select, checkbox } = formElements;

  // Question Fields
  question.fields.forEach((field) => {
    let formField: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement | HTMLFieldSetElement | undefined;

    if (field.type === 'input_text') {
      // GH doesn't return a type for email fields, hence checking the name.
      if (field.name === 'email') formField = createInputElement(input, 'email');
      else formField = createInputElement(input, 'text');
    }

    if (field.type === 'input_file') {
      formField = createInputElement(input, 'file');
    }

    if (field.type === 'textarea') {
      formField = createTextAreaElement(textarea);
    }

    if (field.type === 'multi_value_single_select') {
      formField = createSingleSelectElement(select, field);
    }

    if (field.type === 'multi_value_multi_select') {
      formField = createMultiSelectElement(checkbox, field, question.required);
    }

    if (!formField) return;

    if (isFormField(formField)) {
      formField.name = field.name;
      formField.id = slugify(field.name, { strict: true, lower: true });
      formField.required = question.required;
    }

    formField.setAttribute('aria-labelledby', labelId);
    formField.removeAttribute('data-name');

    wrapper.append(formField);
  });
}

/**
 * Creates a new input.
 * @param inputTemplate
 */
const createInputElement = (inputTemplate: HTMLInputElement, type: 'text' | 'email' | 'file') => {
  const formField = cloneNode(inputTemplate);
  formField.type = type;

  return formField;
};

/**
 * Creates a new textarea element.
 * @param textAreaTemplate
 */
const createTextAreaElement = (textAreaTemplate: HTMLTextAreaElement) => cloneNode(textAreaTemplate);

/**
 * Creates a single-select element.
 * @param selectTemplate
 * @param field
 */
const createSingleSelectElement = (selectTemplate: HTMLSelectElement, field: Field) => {
  const formField = cloneNode(selectTemplate);

  formField.innerHTML = '';
  const defaultOptionElement = new Option('Select:', '');
  formField.appendChild(defaultOptionElement);

  if (!field.values) return;
  field.values.forEach(({ label, value }) => {
    const optionElement = new Option(label, value.toString());
    formField.appendChild(optionElement);
  });

  return formField;
};

/**
 * Creates a multi-select using checkboxes.
 * Ensures that at least one is required to be checked when the question is required.
 * @param checkboxTemplate
 * @param field
 * @param isRequired
 */
const createMultiSelectElement = (checkboxTemplate: HTMLLabelElement, field: Field, isRequired: boolean) => {
  const formField = document.createElement('fieldset');
  formField.innerHTML = '';
  const defaultOptionElement = new Option('Select:', '');
  formField.appendChild(defaultOptionElement);

  if (!field.values) return;

  const checkboxes = field.values
    .map(({ label, value }) => {
      const checkboxWrapper = cloneNode(checkboxTemplate);
      const checkboxLabel = checkboxWrapper.querySelector('span');
      const checkboxInput = checkboxWrapper.querySelector('input');
      if (!checkboxLabel || !checkboxInput) return;

      checkboxLabel.textContent = label;
      checkboxInput.name = field.name.replace(/[\])}[{(]/g, '');
      checkboxInput.value = value.toString();
      checkboxInput.required = isRequired;

      formField.appendChild(checkboxWrapper);

      return checkboxInput;
    })
    .filter(isNotEmpty);

  if (isRequired) {
    formField.addEventListener('change', () => {
      const atLeastOneChecked = checkboxes.some(({ checked }) => checked);

      for (const checkbox of checkboxes) {
        checkbox.required = !atLeastOneChecked;
      }
    });
  }

  return formField;
};

/**
 * Sends the form data to Zapier on submit.
 * @param form
 */
const handleFormSubmissions = (form: HTMLFormElement) => {
  const actionForm = new Form(form);

  actionForm.element.addEventListener('submit', async (e) => {
    e.preventDefault();
    e.stopPropagation();

    // The endpoint URL should be set on Webflow designer.
    const endpoint = actionForm.element.getAttribute('action');
    if (!endpoint) return;

    const formData = new FormData(actionForm.element);
    const data: Record<string, string | number | boolean | (string | number | boolean)[]> = {};

    for (const [key, value] of formData.entries()) {
      if (value instanceof File) {
        if (!value.size) {
          data[key] = '';
          continue;
        }

        const base64 = await toBase64(value);
        const fileNameKey = `${key}_content_filename`;
        const fileContentKey = `${key}_content`;

        data[fileNameKey] = value.name;

        if (!base64) continue;
        // strip away data:image/png;base64 from the base64 string
        data[fileContentKey] = base64.toString().split(',').pop() || '';
        continue;
      }

      const existingValue = data[key];

      if (existingValue !== undefined) {
        const newValue = Array.isArray(existingValue) ? existingValue : [existingValue];

        newValue.push(value);
        data[key] = newValue;
        continue;
      }

      if (key === GDPR_CONSENT_GIVEN_KEY) {
        data[key] = value === 'on';
        continue;
      }

      data[key] = value;
    }

    try {
      const network = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // body: body,
        body: JSON.stringify(data),
      });

      if (network.ok) actionForm.showSuccess();
      else {
        actionForm.showError();
      }
    } catch (error) {
      actionForm.showError();
    }
  });
};

/**
 * Converts a File to base64.
 * @param file
 */
export const toBase64 = (file: File) =>
  new Promise<FileReader['result']>((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
