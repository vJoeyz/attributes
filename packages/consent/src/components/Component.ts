import { isKeyOf } from '@finsweet/attributes-utils';
import { clearAllBodyScrollLocks, disableBodyScroll } from 'body-scroll-lock';
import Emittery from 'emittery';

import { DisplayController } from '../components';
import Store from '../Store';
import type { Consents } from '../types';
import {
  ELEMENTS,
  findFirstScrollableElement,
  getAttribute,
  getElementSelector,
  queryAllElements,
  queryElement,
} from '../utils';
import ConsentsForm from './ConsentsForm';
import Debug from './Debug';

// Types
interface ComponentEvents {
  ready: HTMLElement;
  open: undefined;
  close: undefined;
  allow: undefined;
  deny: undefined;
  openpreferences: undefined;
  formsubmit: Partial<Consents>;
}

export default class Component extends Emittery<ComponentEvents> {
  public element?: HTMLElement | null;
  public form?: ConsentsForm;
  private displayController?: DisplayController;
  private scrollableElement?: Element;
  private disableScrollOnOpen = false;
  private ready = false;

  constructor(private selector: (typeof ELEMENTS)[number], protected store: Store) {
    super();

    this.init();
  }

  /**
   * Inits the component.
   */
  protected init(): void {
    const banner = getElementSelector('banner');
    const manager = getElementSelector('fixed-preferences');
    const preferences = getElementSelector('preferences');

    // Get DOM Elements
    const elementsAreValid = this.initElements();
    if (!elementsAreValid) {
      switch (this.selector) {
        case banner:
          Debug.alert(`No element with the ${banner} attribute was found, it is required to have it!`, 'error');
          break;
        case manager:
          Debug.alert(
            `No element with the ${manager} attribute was found, did you want to use the Manager component?`,
            'info'
          );
          break;
        case preferences:
          Debug.alert(
            `No element with the ${preferences} attribute was found, did you want to use the Preferences component?`,
            'info'
          );
          break;
      }
      return;
    }

    // Handle Accessibility
    this.handleAccessibility();

    // Listen events
    this.listenEvents();

    // Update ready state
    this.ready = true;
    this.emit('ready', this.element!);
  }

  /**
   * Gets DOM elements and their properties.
   * @returns `true` if elements are correctly setup.
   */
  private initElements(): boolean {
    // Main element
    this.element = queryElement<HTMLElement>(this.selector);

    const { element, store } = this;

    if (!element) return false;

    // Preferences form
    const form = queryElement<HTMLFormElement>('form', { scope: element });

    if (form) this.form = new ConsentsForm(form, store);

    // Check properties
    const displayProperty = getAttribute(element, 'display');

    this.disableScrollOnOpen = getAttribute(element, 'scroll') === 'disable';
    if (this.disableScrollOnOpen) this.scrollableElement = findFirstScrollableElement(element);

    // Create the display controller
    const interactionTrigger = queryElement<HTMLElement>('interaction');

    this.displayController = new DisplayController({
      element,
      interaction: interactionTrigger ? { element: interactionTrigger } : undefined,
      displayProperty: isKeyOf(displayProperty, DisplayController.displayProperties) ? displayProperty : 'flex',
      startsHidden: true,
    });

    return true;
  }

  /**
   * Makes sure all buttons are accessible.
   */
  private handleAccessibility() {
    const { element } = this;

    if (!element) return;

    const buttons = [
      queryAllElements('allow'),
      queryAllElements('deny'),
      queryAllElements('submit'),
      queryAllElements('close'),
    ].flatMap((btn) => btn);

    buttons.forEach((button) => {
      if (!button) return;

      button.setAttribute('role', 'button');
      button.setAttribute('tabindex', '0');
    });
  }

  /**
   * Listen for mouse and keyboard events
   */
  private listenEvents(): void {
    const { element, form } = this;

    console.log('form', {
      form,
      element,
    });

    if (!element) return;

    element.addEventListener('click', (e) => this.handleMouseAndKeyboard(e));
    element.addEventListener('keydown', (e) => this.handleMouseAndKeyboard(e));
    form?.on('submit', (newConsents) => this.handleFormSubmit(newConsents));
  }

  /**
   * Handles mouse and keyboard events.
   * @param e The event object.
   */
  private handleMouseAndKeyboard(e: MouseEvent | KeyboardEvent): void {
    const { target } = e;

    const [allow, deny, close, submit] = [
      getElementSelector('allow'),
      getElementSelector('deny'),
      getElementSelector('close'),
      getElementSelector('submit'),
    ];

    if (!(target instanceof Element)) return;
    if ('key' in e && e.key !== 'Enter') return;

    if (target.closest(allow)) {
      this.emit('allow');
      this.close();
    } else if (target.closest(deny)) {
      this.emit('deny');
      this.close();
    } else if (target.closest(close)) this.close();
    else if (target.closest(submit)) this.form?.submit();
  }

  /**
   * Handle form submit
   * @param newConsents
   */
  private handleFormSubmit(newConsents: Partial<Consents>) {
    this.emit('formsubmit', newConsents);
    console.log('newConsents', newConsents);
    this.close();
  }

  /**
   * Shows/hides the component.
   * @param display Action to be performed. `true` to show, `false` to hide.
   */
  private show(display = true) {
    const { element, displayController, disableScrollOnOpen, scrollableElement } = this;

    if (!element || !displayController || displayController.isVisible() === display) return;

    displayController[display ? 'show' : 'hide']();

    if (disableScrollOnOpen) {
      if (display) disableBodyScroll(scrollableElement || element, { reserveScrollBarGap: true });
      else clearAllBodyScrollLocks();
    }

    this.emit(display ? 'open' : 'close');
  }

  /**
   * Opens the component.
   */
  public open(): void {
    if (this.ready) this.show();
    else this.once('ready').then(() => this.show());
  }

  /**
   * Closes the component.
   */
  public close(): void {
    if (this.ready) this.show(false);
    else this.once('ready').then(() => this.show(false));
  }

  /**
   * @returns If the component is already mounted
   */
  public isReady = (): boolean => this.ready;
}
