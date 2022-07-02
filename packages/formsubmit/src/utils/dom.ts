import type { Form } from '../components/Form';

/**
 * Checks if a form submission was successful based on the focused element by Webflow.
 * @param formInstance
 * @returns A boolean Promise.
 */
export const checkFormSuccess = ({ successMessage, errorMessage }: Form): Promise<boolean> =>
  new Promise<boolean>((resolve) => {
    const observer = new MutationObserver(([{ target }]) => {
      const success = target === successMessage;
      resolve(success);
    });

    const options: MutationObserverInit = {
      attributes: true,
      attributeFilter: ['style'],
    };

    observer.observe(successMessage, options);
    observer.observe(errorMessage, options);
  });

/**
 * Displays the Error Message of a Webflow form.
 * @param formInstance
 */
export const displayFormError = ({ errorMessage }: Form) => {
  errorMessage.style.display = 'block';
};

/**
 * Hides the Error Message of a Webflow form.
 * @param formInstance
 */
export const showFormError = ({ errorMessage }: Form) => {
  errorMessage.style.display = 'none';
};

/**
 * Displays the Success Message of a Webflow form.
 * Acts exactly like the native Webflow submission, the form is hidden and the success message is displayed.
 * @param formInstance
 */
export const showFormSuccess = ({ form, successMessage, errorMessage }: Form) => {
  form.style.display = 'none';
  errorMessage.style.display = 'none';
  successMessage.style.display = 'block';
};
