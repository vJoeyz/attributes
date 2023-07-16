import Component from './components/Component';
import Debug from './components/Debug';
import ConsentController from './ConsentController';
import { ACTIONS, CONSENT_ALL, CONSENT_REQUIRED, FS_CONSENT_CSS } from './constants';
import Store from './Store';
import type { FsCookieConsentCallback } from './types';
import { getElementSelector, renderComponentsFromSource } from './utils';

/**
 * The main component of the FsCC.
 * Controlls all the sub components.
 */
export default class FsCookieConsent {
  private readonly consentController;
  private readonly store = new Store();
  private banner!: Component;
  private preferences!: Component;
  private manager!: Component;

  constructor(callbacks: FsCookieConsentCallback[] = []) {
    // Consent controller
    this.consentController = new ConsentController(this.store);

    // Init
    this.initComponents().then(() => this.init(callbacks));
  }

  /**
   * Inits the components.
   * If the fs-consent-source attribute is found, it fetches them from the specified source.
   */
  private async initComponents() {
    const { store } = this;
    const { componentsSource } = store;

    const banner = getElementSelector('banner');
    const manager = getElementSelector('fixed-preferences');
    const preferences = getElementSelector('preferences');

    if (componentsSource) await renderComponentsFromSource(componentsSource);

    this.banner = new Component(banner, store);
    this.preferences = new Component(preferences, store);
    this.manager = new Component(manager, store);
  }

  /**
   * Inits the app.
   * @param callbacks The callbacks to run after the app has been inited.
   */
  private init(callbacks: FsCookieConsentCallback[] = []) {
    const { store, manager, banner } = this;

    // Place CSS in the head that make sure the components are hidden
    document.head.insertAdjacentHTML('beforeend', FS_CONSENT_CSS);

    // Check if the user is a bot or has DoNotTrack option active
    const isBot = /bot|crawler|spider|crawling/i.test(navigator.userAgent);
    if (isBot) return;

    // Run JS API callbacks
    this.push(...callbacks);

    // If user has already confirmed, show the manager, otherwise show the banner
    if (store.userHasConfirmed()) manager.open();
    else banner.open();

    this.listenEvents();
  }

  /**
   * Listens for internal events.
   */
  private listenEvents() {
    const { allow, deny, submit } = ACTIONS;
    const componentsKeys = ['banner', 'manager', 'preferences'] as const;
    const { store, consentController, banner, manager } = this;

    // Listen for click and keydown events
    document.addEventListener('click', (e) => this.handleMouseAndKeyboard(e));
    document.addEventListener('keydown', (e) => this.handleMouseAndKeyboard(e));

    // Banner
    if (banner.isReady()) store.storeBannerText(banner.element);
    else banner.on('ready', (element) => store.storeBannerText(element));

    // Consent Controller
    consentController.on('updateconsents', () => {
      componentsKeys.forEach((componentKey) => this[componentKey].form?.updateCheckboxes());
    });

    // All Components
    componentsKeys.forEach((componentKey) => {
      // Allow
      this[componentKey].on('allow', () => {
        // Debug mode
        Debug.alert(`Allow button was clicked in the ${componentKey} component.`, 'info');

        consentController.updateConsents(CONSENT_ALL, allow);
      });

      // Deny
      this[componentKey].on('deny', () => {
        // Debug mode
        Debug.alert(`Deny button was clicked in the ${componentKey} component.`, 'info');

        consentController.updateConsents(CONSENT_REQUIRED, deny);
      });

      // Submit
      this[componentKey].on('formsubmit', (newConsents) => {
        // Debug mode
        // prettier-ignore
        Debug.alert(
          `Consents Form was submitted in the ${componentKey} component with the following consents: ${JSON.stringify(newConsents)}`,
          'info'
        );

        consentController.updateConsents(newConsents, submit);
      });

      // Close
      if (componentKey !== 'manager') {
        this[componentKey].on('close', () => {
          // Debug mode
          Debug.alert(`The ${componentKey} component was closed.`, 'info');

          if (store.mode === 'informational') {
            // Debug mode
            Debug.alert(`All cookies were accepted because the mode is set to ${store.mode}.`, 'warning');

            consentController.updateConsents(CONSENT_ALL, allow);
          }

          manager.open();
        });
      }
    });
  }

  /**
   * Handles mouse and keyboard events.
   * @param e The event object.
   */
  private handleMouseAndKeyboard(e: MouseEvent | KeyboardEvent): void {
    const { target } = e;
    const { banner, manager, preferences } = this;

    if (!(target instanceof Element)) return;
    if ('key' in e && e.key !== 'Enter') return;

    const openPreference = getElementSelector('open-preferences');

    const closest = target.closest(openPreference);

    if (closest) {
      banner.close();
      manager.close();
      preferences.open();

      // Debug mode
      Debug.alert(`Open Preferences button was clicked.`, 'info');
    }
  }

  /**
   * Run a callback (or multiple callbacks) after FsCC has loaded.
   *
   * @param args The callback (or callbacks).
   * Each callback will be called with the current {@link FsCookieConsent} instance as the argument.
   */
  public push(...args: FsCookieConsentCallback[]) {
    args.forEach((callback) => callback(this));
  }
}
