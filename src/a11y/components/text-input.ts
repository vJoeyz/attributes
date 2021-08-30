const MAIN_KEY = 'fs-uswds';
const FUNCTIONALITY_KEYS = {
  successClass: `${MAIN_KEY}-success-class`,
  errorClass: `${MAIN_KEY}-error-class`,
  errorMessageId: `${MAIN_KEY}-error-message`,
};

export const initTextInputs = (): void => {
  const textInputs = document.querySelectorAll<HTMLInputElement>(
    'input[type="text"], input[type="number"], input[type="password"], input[type="tel"], input[type="email"]'
  );

  textInputs.forEach((input) => {
    const successClass = input.getAttribute(FUNCTIONALITY_KEYS.successClass);
    const errorClass = input.getAttribute(FUNCTIONALITY_KEYS.errorClass);

    const errorMessageId = input.getAttribute(FUNCTIONALITY_KEYS.errorMessageId);
    const errorMessage = errorMessageId ? document.getElementById(errorMessageId) : null;

    input.addEventListener('change', () => {
      const isValid = input.checkValidity();

      if (successClass) input.classList[isValid ? 'add' : 'remove'](successClass);
      if (errorClass) input.classList[!isValid ? 'add' : 'remove'](errorClass);
      if (errorMessageId && errorMessage) {
        if (isValid) input.removeAttribute('aria-describedby');
        else input.setAttribute('aria-describedby', errorMessageId);
      }
    });
  });
};
