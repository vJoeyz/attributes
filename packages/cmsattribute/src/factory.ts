import { ATTRIBUTES } from './utils/constants';

export function createCMSAttribute(target: HTMLElement, scope: HTMLElement | null) {
  const targetKey = target.getAttribute(ATTRIBUTES.field.key);

  const nameSelector = `[${ATTRIBUTES.field.key}="${targetKey}"][${
    ATTRIBUTES.element.key
  }="${ATTRIBUTES.element.values.name()}"]`;

  const name =
    (scope && scope.querySelector<HTMLElement>(nameSelector)) || document.querySelector<HTMLElement>(nameSelector);

  if (!name || !name.textContent) {
    return;
  }

  const valueSelector = `[${ATTRIBUTES.field.key}="${targetKey}"][${
    ATTRIBUTES.element.key
  }="${ATTRIBUTES.element.values.value()}"]`;

  const value =
    (scope && scope.querySelector<HTMLElement>(valueSelector)) || document.querySelector<HTMLElement>(valueSelector);

  if (!value || !value.textContent) {
    return;
  }

  target.setAttribute(name.textContent, value.textContent);
}
