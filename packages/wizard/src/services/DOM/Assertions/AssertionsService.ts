/**
 * Assertions - True if the element exists on the page or Throw an error
 */
export function assertElementExistsOnPage(selector: string) {
  const element = document.querySelector(selector);

  if (!element) {
    throw new Error(`None element found with selector ${selector} on page`);
  }

  return true;
}

/**
 * Assertions - True if the element has exact attribute
 * @param selector
 * @param toMatchSelector
 * @returns
 */
export function assertAttributeIsAppliedToElement(selector: string, toMatchSelector: string) {

  const isClass = toMatchSelector.startsWith('.');

  const elementQuery = isClass ? `${selector}${toMatchSelector}` : `${toMatchSelector}${selector}`;

  const element = document.querySelector(elementQuery);

  if (!element) {
    throw new Error('Element not match');
  }

  return true;
}

/**
 * Assertions - True if selector is child of parent selector
 */
export function assertElementIsChildOfElement(childSelector: string, parentSelector: string) {
  const parentElement = document.querySelector(parentSelector);

  if (!parentElement) {
    throw new Error('Parent element not found');
  }

  const childElement = document.querySelector(childSelector);

  if (!childElement) {
    throw new Error('Child element not found');
  }

  if (!parentElement.contains(childElement)) {
    throw new Error('Parent element not contains child element');
  }

  return true;
}


export function assertElementIsSiblingOfElement(elementSelector: string, siblingSelector: string) {

  const element = document.querySelector(elementSelector);

  if (!element) {
    throw new Error('Element not found');
  }

  const siblingElement = document.querySelector(siblingSelector);

  if (!siblingElement) {
    throw new Error('Sibling element not found');
  }

  if (element.parentNode !== siblingElement.parentNode) {
    throw new Error('Elements are not siblings')
  }

  return true;
}

/**
 * Assertions - True if selector is parent of child selector
 */
export function assertElementIsParentOfElement(parentSelector: string, childSelector: string) {

  const element = document.querySelector(childSelector);

  if (!element) {
    throw new Error('Child element not found');
  }

  if (!element.closest(parentSelector)) {
    throw new Error('Parent element not contains child element');
  }

  return true;
}

/**
 *
 * @param selector
 * @param parentSelectors
 * @returns
 */
export function assertElementIsChildOfParentsElements(elements: HTMLElement[], parentSelectors: string[]) {


  const matchElements = elements.find((element) => {


    const matchParents = parentSelectors.filter((parentSelector) => {

      return element.closest(parentSelector) !== null;
    });

    return matchParents.length == parentSelectors.length;
  });

  if (!matchElements) {
    throw new Error('Element not match selectors');
  }

  return true;
}

export function assertElementIsSiblingOfElements(elements: HTMLElement[], siblingSelectors: string[]) {
  const matchElements = elements.find((element) => {
    const matchParents = siblingSelectors.filter((siblingSelector) => {
      const siblingElement = document.querySelector(siblingSelector);
      return siblingElement && element.parentNode === siblingElement.parentNode;
    });

    return matchParents.length == siblingSelectors.length;
  });

  if (!matchElements) {
    throw new Error('Element not match selectors');
  }

  return true;
}


export function assertElementIsParentOfElements(elements: HTMLElement[], childSelectors: string[]) {
  const matchElements = elements.find((element) => {
    const matchParents = childSelectors.some((childSelector) => {
      const childElement = element.querySelector(childSelector);

      return (childElement !== null)

    });
    return matchParents || false;
  });

  if (!matchElements) {
    throw new Error('Element not match selectors');
  }

  return true;
}


export function assertElementIsUnique(selector: string) {
  const elements = document.querySelectorAll(selector);

  if (elements.length !== 1) {
    throw new Error('Element duplicated or not found');
  }

  return true;
}
