import { cloneNode, FORM_CSS_CLASSES, isFormField, isNotEmpty } from '@finsweet/ts-utils';
import type { JobWithQuestions } from '@finsweet/ts-utils/dist/types/apis/Greenhouse';
import type { Question, Field } from '@finsweet/ts-utils/dist/types/apis/Greenhouse';
import slugify from 'slugify';

import { Form } from '../components/Form';
import { ATTRIBUTES, GH_API_BASE, GH_API_JOBS, queryElement } from '../utils/constants';

export async function createJobForm(form: HTMLFormElement, jobId: string, boardId: string) {
  const jobsRequest = await fetch(`${GH_API_BASE}/${boardId}/${GH_API_JOBS}/${jobId}?questions=true`);
  const job: JobWithQuestions = await jobsRequest.json();

  const questionsTemplate = queryElement<HTMLDivElement>(ATTRIBUTES.element.values.questions, { scope: form });

  if (!questionsTemplate) {
    return;
  }

  const { questions } = job;

  questions.reverse().forEach((question) => {
    createInput(question, questionsTemplate, form);
  });

  questionsTemplate.remove();

  handleFormSubmissions(form);
}

/**
 * Creates a new question element.
 * @param question
 * @param questionWrapperTemplate
 * @returns The new DOM element.
 */
function createInput(question: Question, questionWrapperTemplate: HTMLDivElement, form: HTMLFormElement) {
  const questionWrapper = cloneNode(questionWrapperTemplate);

  const label = questionWrapper.querySelector('label');
  const inputTemplate = questionWrapper.querySelector<HTMLInputElement>(':scope > input');
  const textAreaTemplate = questionWrapper.querySelector('textarea');
  const selectTemplate = questionWrapper.querySelector('select');
  const checkboxTemplate = questionWrapper.querySelector<HTMLLabelElement>(`.${FORM_CSS_CLASSES.checkboxField}`);

  if (!label || !inputTemplate || !textAreaTemplate || !selectTemplate || !checkboxTemplate) return;

  inputTemplate.remove();
  textAreaTemplate.remove();
  selectTemplate.remove();
  checkboxTemplate.remove();

  // Label Text
  const labelId = slugify(question.label, { strict: true, lower: true });
  label.id = labelId;
  // Make sure camelcase used is separated by spaces
  label.innerText = question.label.replace(/([a-z])([A-Z])/g, '$1 $2');
  label.removeAttribute('for');

  if (!question.required) label.innerText = `${question.label} (optional)`;

  // Question Fields
  question.fields.forEach((field) => {
    let formField: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement | HTMLFieldSetElement | undefined;

    if (field.type === 'input_text') {
      // GH doesn't return a type for email fields, hence checking the name.
      if (field.name === 'email') formField = createInputElement(inputTemplate, 'email');
      else formField = createInputElement(inputTemplate, 'text');
    }

    if (field.type === 'input_file') {
      formField = createInputElement(inputTemplate, 'file');
    }

    if (field.type === 'textarea') {
      formField = createTextAreaElement(textAreaTemplate);
    }

    if (field.type === 'multi_value_single_select') {
      formField = createSingleSelectElement(selectTemplate, field);
    }

    if (field.type === 'multi_value_multi_select') {
      formField = createMultiSelectElement(checkboxTemplate, field, question.required);
    }

    if (!formField) return;

    if (isFormField(formField)) {
      formField.name = field.name;
      formField.id = slugify(field.name, { strict: true, lower: true });
      formField.required = question.required;
    }

    formField.setAttribute('aria-labelledby', labelId);
    formField.removeAttribute('data-name');
    form.prepend(formField);
    form.prepend(label);
  });

  return questionWrapper;
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

    const body = new FormData(form.element);

    console.log(body);
    // The endpoint URL should be set on Webflow designer.
    const endpoint = form.element.getAttribute('action');
    if (!endpoint) return;

    const formData = new FormData(form.element);
    const data: Record<string, string | number | (string | number)[]> = {};

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

      if (network.ok) form.showSuccess();
      else {
        form.showError();
      }
    } catch (error) {
      form.showError();
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
