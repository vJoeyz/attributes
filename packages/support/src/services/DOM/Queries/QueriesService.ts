export function queryElement(selector: string) {
  const element = document.querySelector<HTMLElement>(selector);

  if (!element) {
    throw new Error('Element not found');
  }

  return element;
}

export function queryElementWithAttribute(selector: string, toMatchSelector: string) {
  const isClass = toMatchSelector.startsWith('.');

  const elementQuery = isClass ? `${selector}${toMatchSelector}` : `${toMatchSelector}${selector}`;

  try {
    const element = document.querySelector<HTMLElement>(elementQuery);
    return element;
  } catch {
    return null;
  }
}

export function queryAllElements(selector: string): HTMLElement[] {
  const elements = document.querySelectorAll<HTMLElement>(selector);

  if (!elements) {
    throw new Error('Element not found');
  }

  return Array.from(elements);
}

export function queryAttributeValue(selector: string, attribute: string): string {
  const element = document.querySelector(selector);

  if (!element) {
    throw new Error('Element not found');
  }

  if (!element.hasAttribute(attribute)) {
    throw new Error('Attribute not found in element');
  }

  const attributeValueInDOM = element.getAttribute(attribute);

  if (attributeValueInDOM === null) {
    throw new Error('Attribute value not found in element');
  }
  return attributeValueInDOM;
}

export function queryChildrenOfElements(selectors: string[]): HTMLElement[] | null {
  if (!selectors || selectors.length == 0) {
    return null;
  }

  const childrenSelector = selectors.map((selector) => `${selector} *`).join(',');

  const elements: NodeListOf<HTMLElement> = document.querySelectorAll<HTMLElement>(childrenSelector);

  return Array.from(elements).filter((element) => {
    const matchParents = selectors.filter((parentSelector) => {
      return element && element.parentElement && element.parentElement.closest(parentSelector) !== null;
    });

    return matchParents.length == selectors.length;
  });
}
