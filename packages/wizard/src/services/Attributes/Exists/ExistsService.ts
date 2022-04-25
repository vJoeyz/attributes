import { assertElementExistsOnPage } from '@src/services/DOM/Assertions/AssertionsService';
import AttributeDuplicateError from './Errors/AttributeDuplicatedError';
import AttributeNotFoundError from './Errors/AttributeNotFoundError';

import type { SchemaSelector, ElementItemSelector } from '@src/types/Schema.types';
import type { DOMSelector } from '@global/types/schema';
import DOMForAttributeNotFound from './Errors/DOMForAttributeNotFound';


export function elementSettingExists(elementSelector: SchemaSelector, appliedTo: ElementItemSelector[]) {

  try {

    assertElementExistsOnPage(elementSelector.getAttributeSelector());
    return true;
  } catch {

    const elementSelectors = appliedTo.map((value: ElementItemSelector) => value.elementAttribute.appliedTo).flat();

    throw new AttributeNotFoundError(elementSelector, elementSelectors, true);

  }
}


export function elementExists(elementSelector: SchemaSelector, elements: HTMLElement[], appliedTo: DOMSelector[]) {
  if (elements.length <= 0) {
    throw new AttributeNotFoundError(elementSelector, appliedTo, false);
  }
  return true;
}

export function domElementExists(elementSelector: SchemaSelector, appliedTo: DOMSelector[]) {

  let domElementExists = false;

  if (appliedTo.length <= 0) {
    return true;
  }

  appliedTo.forEach((appliedToSelector: DOMSelector) => {
    if (domElementExists === true) {
      return;
    }

    const selectors = appliedToSelector.selectors;

    selectors.forEach((selector: string) => {
      if (domElementExists === true) {
        return;
      }

      const element = document.querySelector(selector);

      if (element) {
        domElementExists = true;
      }
    })
  })

  if (domElementExists === false) {
    throw new DOMForAttributeNotFound(elementSelector, appliedTo);
  }
}


export function elementDuplicated(elements: HTMLElement[], elementSelector: SchemaSelector) {
  if (elements.length > 1) {
    throw new AttributeDuplicateError(elementSelector);
  }

  return true;
}
