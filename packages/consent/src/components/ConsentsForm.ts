import { simulateEvent } from '@finsweet/attributes-utils';
import Emittery from 'emittery';

import { DYNAMIC_KEYS, OPTIONAL_CONSENTS } from '../constants';
import Store from '../Store';
import type { Consents, OptionalConsentKey, OptionalConsents } from '../types';
import { selectInputElement } from '../utils';
import Debug from './Debug';

// Types
interface ConsentsFormEvents {
  submit: Partial<Consents>;
}

export default class ConsentsForm extends Emittery<ConsentsFormEvents> {
  private readonly checkboxes: Map<OptionalConsentKey, HTMLInputElement> = new Map();

  constructor(private element: HTMLFormElement, protected store: Store) {
    super();

    this.initElements();
    this.listenEvents();
    this.updateCheckboxes();
  }

  /**
   * Stores the checkboxes and the submit button.
   * If no submit button exists, it creates one.
   */
  private initElements() {
    // Check if form contains the all the checkboxes and store them
    const missingCheckboxes = OPTIONAL_CONSENTS.filter((consentKey) => {
      const selector = DYNAMIC_KEYS.checkbox(consentKey);
      console.log('selector', selector);
      const checkbox = this.element.querySelector<HTMLInputElement>(`input${selector}, ${selector} input`);
      if (!checkbox || !(checkbox.type === 'checkbox')) return true;

      // Make sure it starts unchecked
      if (checkbox.checked) selectInputElement(checkbox, false);

      this.checkboxes.set(consentKey, checkbox);
      return false;
    });

    // Warn the user if any checkbox is missing
    if (missingCheckboxes.length) {
      // prettier-ignore
      Debug.alert(
        `The Consents Form is missing the following checkboxes: ${missingCheckboxes.map((consentKey) => DYNAMIC_KEYS.checkbox(consentKey)).join(', ')}.`,
        'warning'
      );
    }
  }

  /**
   * Listens for mouse and keyboard events.
   */
  protected listenEvents(): void {
    this.element.addEventListener('submit', (e) => this.handleSubmit(e));
  }

  /**
   * Handles submit events.
   * @param e The submit event.
   */
  private handleSubmit(e: Event) {
    e.preventDefault();
    e.stopPropagation();

    // Gather the new consents from the form
    const newConsents: Partial<OptionalConsents> = {};
    this.checkboxes.forEach((checkbox, consentKey) => {
      newConsents[consentKey] = checkbox.checked ?? false;
    });

    this.emit('submit', newConsents);
  }

  /**
   * Makes sure the checkboxes are checked/unchecked depending on the user's settings.
   */
  public updateCheckboxes(): void {
    const consents = this.store.getConsents();

    this.checkboxes.forEach((checkbox, consentKey) => {
      if (!!consents[consentKey] !== checkbox.checked) selectInputElement(checkbox, consents[consentKey]);
    });
  }

  /**
   * Submits the form.
   */
  public submit(): void {
    simulateEvent(this.element, 'submit');
  }
}
