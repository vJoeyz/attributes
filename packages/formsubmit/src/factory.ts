import type { FormBlockElement } from '@finsweet/ts-utils';
import { FORM_CSS_CLASSES } from '@finsweet/ts-utils';

import { Form } from './components/Form';
import { parseActionAttribute } from './utils/attributes';
import { getAttribute, getInstanceIndex, hasAttributeValue, queryAllElements } from './utils/selectors';

/**
 * Creates a new formsubmit instance.
 * @param formElement
 */
export const initFormInstance = (formElement: Element) => {
  const formBlock = formElement.closest<FormBlockElement>(`.${FORM_CSS_CLASSES.formBlock}`);
  if (!formBlock) return;

  const form = formBlock.querySelector('form');
  if (!form) return;

  const instanceIndex = getInstanceIndex(formElement);

  const ixTriggers = queryAllElements('ix-trigger', { instanceIndex });
  const resetButtons = queryAllElements('reset', { instanceIndex });

  // Reset
  const rawReset = getAttribute(formElement, 'reset');
  const [reset, resetTimeout] = parseActionAttribute(rawReset);

  // Reload
  const rawReload = getAttribute(formElement, 'reload');
  const [reload, reloadTimeout] = parseActionAttribute(rawReload);

  // Redirect
  const rawRedirect = getAttribute(formElement, 'redirect');
  const [redirect, redirectTimeout] = parseActionAttribute(rawRedirect);

  const redirectUrl = getAttribute(formElement, 'redirecturl');
  const redirectToNewTab = hasAttributeValue(formElement, 'redirectnewtab', 'true');

  // Disable
  const disable = hasAttributeValue(formElement, 'disable', 'true');

  // Enhance
  const enhance = hasAttributeValue(formElement, 'enhance', 'true');

  const formInstance = new Form({
    form,
    formBlock,
    reset,
    resetTimeout,
    reload,
    reloadTimeout,
    redirect,
    redirectUrl,
    redirectTimeout,
    redirectToNewTab,
    enhance,
    disable,
    ixTriggers,
    resetButtons,
  });

  return formInstance;
};
