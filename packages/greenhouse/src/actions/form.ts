import { cloneNode, FORM_CSS_CLASSES, isFormField } from '@finsweet/ts-utils';
import type { JobWithQuestions, Question } from '@finsweet/ts-utils/dist/types/apis/Greenhouse';
import slugify from 'slugify';

import { Form } from '../components/Form';
import type { FormElementsTemplate, FormTemplate } from '../types';
import { ATTRIBUTES, GH_API_BASE, GH_API_JOBS, queryElement } from '../utils/constants';
import {
  createInputHidden,
  createInputElement,
  createMultiSelectElement,
  createSingleSelectElement,
  createTextAreaElement,
} from '../utils/elements';

const GDPR_CONSENT_GIVEN_KEY = 'gdpr_consent_given';

interface DemographicAnswer {
  free_form: boolean;
  label: string;
  id: number;
}

interface DemographicQuestion {
  id: number;
  label: string;
  required: boolean;
  type: 'multi_value_single_select' | 'multi_value_multi_select';
  answer_options: DemographicAnswer[];
}

interface DemographicQuestions {
  header: string;
  description: string;
  questions: DemographicQuestion[];
}

export async function createJobForm(form: HTMLFormElement, jobId: string, boardId: string) {
  const jobsRequest = await fetch(`${GH_API_BASE}/${boardId}/${GH_API_JOBS}/${jobId}?questions=true`);
  const job: JobWithQuestions = await jobsRequest.json();

  const templates = getTemplates(form);

  if (templates === null) {
    return;
  }

  createInputHidden('job_id', jobId, templates);
  createInputHidden('board_id', boardId, templates);

  const { questions, compliance, data_compliance /*demographic_questions*/ } = job;

  for (const question of questions) {
    createQuestion(question, templates);
  }

  for (const { questions, description } of compliance) {
    createQuestionDescription(description, templates);

    for (const question of questions) {
      createQuestion(question, templates);
    }
  }

  // if (demographic_questions) {
  /** @TODO import from ts-utils  */
  // const demographicQuestionsTyped = demographic_questions as unknown as DemographicQuestions;

  const demographicQuestionsTyped: DemographicQuestions = {
    header: 'Diversity and Inclusion at Acme Corp.',
    description: '<p>Acme Corp. is dedicated to...</p>',
    questions: [
      {
        id: 1,
        label: 'Favorite Color',
        required: false,
        type: 'multi_value_multi_select',
        answer_options: [
          {
            id: 100,
            label: 'Red',
            free_form: false,
          },
          {
            id: 101,
            label: 'Green',
            free_form: false,
          },
          {
            id: 102,
            label: 'Blue',
            free_form: false,
          },
          {
            id: 102,
            label: 'Prefer to Type My Own',
            free_form: true,
          },
        ],
      },
    ],
  };

  if (demographicQuestionsTyped) {
    const { header, description, questions } = demographicQuestionsTyped;

    createQuestionHeader(header, templates);
    createQuestionDescription(description, templates);
    for (const question of questions) {
      createDemographicQuestion(question, templates);
    }
  }

  // }

  const requiresGDPRCheckbox = data_compliance.some(
    ({ type, requires_consent }) => type === 'gdpr' && requires_consent
  );

  if (requiresGDPRCheckbox) {
    createGDPRCheckbox(templates);
  }

  removeTemplates(templates);

  handleFormSubmissions(form);
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

  const labelId = createQuestionLabel(question.label, question.required, label, wrapper);
  createQuestionField(labelId, question, formElements, wrapper);
}

function createDemographicQuestion(question: DemographicQuestion, templates: FormTemplate) {
  const { form, wrapper } = templates;

  const { label, ...formElements } = form;

  const labelId = createQuestionLabel(question.label, question.required, label, wrapper);
  createDemographicQuestionField(labelId, question, formElements, wrapper);
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

function createQuestionLabel(label: string, required: boolean, labelTemplate: HTMLLabelElement, wrapper: HTMLElement) {
  const newLabel = cloneNode(labelTemplate);
  // Label Text
  const labelId = slugify(label, { strict: true, lower: true });
  newLabel.id = labelId;
  // Make sure camelcase used is separated by spaces
  newLabel.innerText = label.replace(/([a-z])([A-Z])/g, '$1 $2');
  newLabel.removeAttribute('for');

  if (!required) newLabel.innerText = `${label} (optional)`;

  wrapper.append(newLabel);

  return labelId;
}

function createQuestionField(
  labelId: string,
  question: Question,
  formElements: Omit<FormElementsTemplate, 'label'>,
  wrapper: HTMLElement
) {
  const { required } = question;
  const { input, textarea, select, checkbox } = formElements;

  // Question Fields
  question.fields.forEach(({ name, type, values }) => {
    let formField: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement | HTMLFieldSetElement | undefined;

    if (type === 'input_text') {
      // GH doesn't return a type for email fields, hence checking the name.
      if (name === 'email') formField = createInputElement(input, 'email', name, labelId, required);
      else formField = createInputElement(input, 'text', name, labelId, required);
    }

    if (type === 'input_file') {
      formField = createInputElement(input, 'file', name, labelId, required);
    }

    if (type === 'textarea') {
      formField = createTextAreaElement(textarea, name, labelId, required);
    }

    if (type === 'multi_value_single_select' && values) {
      const options = values.map(({ label, value }) => ({
        label,
        value,
        freeForm: false,
      }));
      formField = createSingleSelectElement(select, name, labelId, required, options);
    }

    if (type === 'multi_value_multi_select' && values) {
      const options = values.map(({ label, value }) => ({
        label,
        value,
        freeForm: false,
      }));

      formField = createMultiSelectElement(checkbox, name, required, options);
    }

    if (!formField) return;

    wrapper.append(formField);
  });
}

function createDemographicQuestionField(
  labelId: string,
  question: DemographicQuestion,
  formElements: Omit<FormElementsTemplate, 'label'>,
  wrapper: HTMLElement
) {
  const { select, checkbox } = formElements;
  const { type, answer_options, id, required } = question;

  const name = `question_${id}`;

  let formField: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement | HTMLFieldSetElement | undefined;

  if (type === 'multi_value_single_select') {
    const options = answer_options.map(({ label, id, free_form }) => ({ label, value: id, freeForm: free_form }));
    formField = createSingleSelectElement(select, name, labelId, required, options);
  }

  if (type === 'multi_value_multi_select') {
    const options = answer_options.map(({ label, id, free_form }) => ({ label, value: id, freeForm: free_form }));
    formField = createMultiSelectElement(checkbox, name, required, options);
  }

  if (!formField) {
    return;
  }

  wrapper.append(formField);
}

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

/**
 * This function will decode a html encoded string.
 * @param input The string to be decoded.
 * @returns {string} The decoded string.
 */
export const decodeHTML = (input: string) => {
  const doc = new DOMParser().parseFromString(input, 'text/html');
  return doc.documentElement.textContent || '';
};
