export function getSupportWrapper() {
  const shadowRootEntry = document.querySelector('[data-id="fs-attributes-support"]');

  if (!shadowRootEntry) {
    throw new Error('Unexpected error: Shadow DOM entry not found');
  }

  const shadowRoot = shadowRootEntry.shadowRoot;

  if (!shadowRoot) {
    throw new Error('Unexpected error: Shadow Root not found');
  }

  return shadowRoot;
}

export function scrollInto(selector: string, delay = 0) {
  const shadowRoot = getSupportWrapper();

  setTimeout(() => {
    const scrollElement = shadowRoot.querySelector(selector);

    if (!scrollElement) {
      throw new Error('Unexpected error: Selector not found');
    }

    scrollElement.scrollIntoView({
      behavior: 'smooth',
    });
  }, delay);
}

export function scrollTo(selector: string, delay = 0) {
  const shadowRoot = getSupportWrapper();

  setTimeout(() => {
    const scrollElement = shadowRoot.querySelector(selector);

    if (!scrollElement) {
      throw new Error('Unexpected error: Selector not found');
    }

    scrollElement.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }, delay);
}
