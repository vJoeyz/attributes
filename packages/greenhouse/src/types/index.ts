export interface FormElementsTemplate {
  label: HTMLLabelElement;
  input: HTMLInputElement;
  textarea: HTMLTextAreaElement;
  select: HTMLSelectElement;
  checkbox: HTMLLabelElement;
}

export interface FormTemplate {
  wrapper: HTMLElement;
  form: FormElementsTemplate;
  header: HTMLElement;
  description: HTMLElement;
}
