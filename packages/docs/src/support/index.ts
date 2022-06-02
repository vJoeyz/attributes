let copyUrl: string | null = null;

function setInputError(field: HTMLElement) {
  copyUrl = null;
  field.style.border = '1px solid red';
}

function setInputOk(field: HTMLElement, copyText: string) {
  field.style.border = '1px solid green';
  copyUrl = copyText;
}

function generateSupportUrlevent(event: Event) {
  if (!event || !event.target) {
    return;
  }

  const target = event.target as HTMLInputElement;
  const { value } = target;

  const inputValue = value;

  if (!inputValue) {
    setInputError(target);
  }

  const https = inputValue.substring(0, 8) === 'https://';
  const http = inputValue.substring(0, 7) === 'http://';

  const urlEntry = !https && !http ? `https://${inputValue}` : inputValue;

  try {
    const url = new URL(urlEntry);

    if (!url.origin.includes('webflow.io')) {
      setInputError(target);
      return;
    }

    const params = new URLSearchParams(url.search);
    params.append('fs-attributes-support', 'true');

    setInputOk(target, `${url.origin}${url.pathname}?${params.toString()}`);
  } catch {
    setInputError(target);
  }
}

function copyToClipboard() {
  if (!copyUrl) {
    alert('Enter url in the input field');
    return;
  }

  if (!navigator || !navigator.clipboard) {
    alert('Navigator clipboard not supported on this browser');
    return;
  }

  navigator.clipboard.writeText(copyUrl);
}

function initGenerateUrlForm() {
  const urlField = document.querySelector('#email-form > input[name="name"]');
  const copyButton = document.querySelector('.copy_button');

  if (urlField) {
    urlField.addEventListener('keyup', generateSupportUrlevent);
    urlField.addEventListener('blur', generateSupportUrlevent);
  }

  if (copyButton) {
    copyButton.addEventListener('click', copyToClipboard, true);
  }
}

initGenerateUrlForm();
