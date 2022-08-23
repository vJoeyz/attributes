import { cloneNode, isFormField, isNotEmpty } from '@finsweet/ts-utils';
import slugify from 'slugify';

import type { FormTemplate } from '../types';

export interface InputOption {
  value: string | number;
  label: string;
  freeForm: boolean;
}

type InputOptions = InputOption[];

export function createInputHidden(name: string, value: string, templates: FormTemplate) {
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

function addElementAttributes(
  formField: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement,
  name: string,
  label: string,
  required: boolean
) {
  formField.name = name;
  formField.id = slugify(name, { strict: true, lower: true });
  formField.required = required;

  formField.setAttribute('aria-labelledby', label);
  formField.removeAttribute('data-name');

  return formField;
}
/**
 * Creates a new input.
 * @param inputTemplate
 */
export function createInputElement(
  inputTemplate: HTMLInputElement,
  type: 'text' | 'email' | 'file',
  name: string,
  labelId: string,
  required: boolean
) {
  const formField = cloneNode(inputTemplate);
  formField.type = type;

  if (!isFormField(formField)) {
    return undefined;
  }

  return addElementAttributes(formField, name, labelId, required);
}

/**
 * Creates a new textarea element.
 * @param textAreaTemplate
 */
export function createTextAreaElement(
  textAreaTemplate: HTMLTextAreaElement,
  name: string,
  labelId: string,
  required: boolean
) {
  const formField = cloneNode(textAreaTemplate);

  if (!isFormField(formField)) {
    return undefined;
  }

  return addElementAttributes(formField, name, labelId, required);
}

/**
 * Creates a single-select element.
 * @param selectTemplate
 * @param field
 */
export function createSingleSelectElement(
  selectTemplate: HTMLSelectElement,
  name: string,
  labelId: string,
  required: boolean,
  options: InputOptions
) {
  const formField = cloneNode(selectTemplate);

  formField.innerHTML = '';
  const defaultOptionElement = new Option('Select:', '');
  formField.appendChild(defaultOptionElement);

  if (!options) return;
  options.forEach(({ label, value }) => {
    const optionElement = new Option(label, value.toString());
    formField.appendChild(optionElement);
  });

  if (!isFormField(formField)) {
    return undefined;
  }

  return addElementAttributes(formField, name, labelId, required);
}

/**
 * Creates a multi-select using checkboxes.
 * Ensures that at least one is required to be checked when the question is required.
 * @param checkboxTemplate
 * @param field
 * @param isRequired
 */
export function createMultiSelectElement(
  checkboxTemplate: HTMLLabelElement,
  name: string,
  required: boolean,
  options: InputOptions
) {
  const formField = document.createElement('fieldset');
  formField.innerHTML = '';
  const defaultOptionElement = new Option('Select:', '');
  formField.appendChild(defaultOptionElement);

  if (!options) return;

  const checkboxes = options
    .map(({ label, value }) => {
      const checkboxWrapper = cloneNode(checkboxTemplate);
      const checkboxLabel = checkboxWrapper.querySelector('span');
      const checkboxInput = checkboxWrapper.querySelector('input');
      if (!checkboxLabel || !checkboxInput) return;

      checkboxLabel.textContent = label;
      checkboxInput.name = name.replace(/[\])}[{(]/g, '');
      checkboxInput.value = value.toString();
      checkboxInput.required = required;

      formField.appendChild(checkboxWrapper);

      return checkboxInput;
    })
    .filter(isNotEmpty);

  if (required) {
    formField.addEventListener('change', () => {
      const atLeastOneChecked = checkboxes.some(({ checked }) => checked);

      for (const checkbox of checkboxes) {
        checkbox.required = !atLeastOneChecked;
      }
    });
  }

  return formField;
}
