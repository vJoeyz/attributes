export interface FormElementsTemplate {
  label: HTMLLabelElement;
  input: HTMLInputElement;
  textarea: HTMLTextAreaElement;
  select: HTMLSelectElement;
  checkbox: HTMLLabelElement;
}

export interface FormTemplate {
  form: HTMLFormElement;
  wrapper: HTMLElement;
  elements: FormElementsTemplate;
  header: HTMLElement;
  description: HTMLElement;
}
