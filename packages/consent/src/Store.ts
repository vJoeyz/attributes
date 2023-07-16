import type { Entry } from '@finsweet/ts-utils';
import { getObjectEntries, getObjectKeys, isKeyOf } from '@finsweet/ts-utils';

import Debug from './components/Debug';
import { ATTRIBUTES, MODES } from './constants';
import { CONSENT_ALL, CONSENT_REQUIRED, DEFAULT_COOKIE_MAX_AGE } from './constants/defaults';
import type { ConsentKey, Consents, IFrameData, ModeKey, ScriptData } from './types';
import { getAttribute, getElementSelector } from './utils';

/**
 * Stores all the consents, global settings and scripts.
 */
export default class Store {
  public readonly mode: ModeKey; // Cookie consent mode, opt-in by default
  public readonly cookieMaxAge: number; // In days; Defaults to 120
  public readonly debugMode: boolean; // Cookie consent mode, opt-in by default
  public readonly endpoint?: string | null; // Endpoint where the consents will be POSTed
  public readonly componentsSource?: string | null; // Page where the components are located
  public readonly domain?: string | null; // The domain used to store the consent cookie
  private confirmed = false; // True if the user actively confirmed his/her consent
  private consents: Consents;
  private bannerText = 'empty';
  private scripts: ScriptData[] = [];
  private iFrames: IFrameData[] = [];

  constructor() {
    const currentScript = document.querySelector('[solution="consent"');

    if (!currentScript) {
      console.error('Oops! Finsweet attribute element not found');
      return;
    }

    // Get the mode
    const modeAttribute = getAttribute(currentScript as HTMLElement, 'source');

    this.mode = isKeyOf(modeAttribute, MODES) ? modeAttribute : 'opt-in';
    switch (this.mode) {
      case 'informational':
      case 'opt-out':
        this.consents = { ...CONSENT_ALL };
        break;
      default:
        this.consents = { ...CONSENT_REQUIRED };
    }

    // Get the cookie max age
    this.cookieMaxAge = parseInt(currentScript?.getAttribute('expires') || DEFAULT_COOKIE_MAX_AGE);

    // Get the debug mode
    const debugModeAttribute = currentScript?.getAttribute('debug');
    this.debugMode = debugModeAttribute === '' || debugModeAttribute === 'true';
    if (this.debugMode) Debug.activate();

    // Get the endpoint
    this.endpoint = currentScript?.getAttribute('endpoint');

    // Get the components source
    this.componentsSource = currentScript?.getAttribute('source');

    // Get the cookies domain
    this.domain = currentScript?.getAttribute('domain');

    // Alert the setup
    // prettier-ignore
    Debug.alert(
      `The cookie banner is set to ${this.mode} mode with a consent expiry time of ${this.cookieMaxAge} days.${this.endpoint ? `The consents will be POSTed to ${this.endpoint}` : ''}`,
      'info'
    );
  }

  /**
   * @returns If the user has already allowed/denied the use of cookies
   */
  public userHasConfirmed = (): boolean => this.confirmed;

  /**
   * Stores a script in memory
   * @param consentKey
   * @param scriptData
   */
  public storeScript(scriptData: Omit<ScriptData, 'type'>): void {
    this.scripts.push({ ...scriptData, type: 'script' });
  }

  /**
   * Stores a script in memory
   * @param consentKey
   * @param iFrameData
   */
  public storeIFrame(iFrameData: Omit<IFrameData, 'type'>): void {
    this.iFrames.push({ ...iFrameData, type: 'iframe' });
  }

  /**
   * @returns The stored scripts and iFrames
   */
  public getStoredElements = (): (ScriptData | IFrameData)[] => [...this.scripts, ...this.iFrames];

  /**
   * @returns The stored elements that can be activated
   */
  // prettier-ignore
  public getActivableElements = (): (ScriptData | IFrameData)[] => this.getStoredElements().filter(({ active, categories }) => !active && categories.every((category) => this.consents[category]));

  /**
   * Stores new consents
   * @param newConsents
   * @returns True if any consent was updated
   */
  public storeConsents(newConsents: Partial<Consents>): ConsentKey[] {
    const updatedConsents: ConsentKey[] = [];

    // Build an array of the consents that were updated
    getObjectKeys(newConsents).forEach((consentKey) => {
      // No need to update the essential cookies consent
      if (consentKey === 'essential') return;

      const newConsent = newConsents[consentKey];

      // Avoid storing undefined or not-updated consents
      if (newConsent === undefined || newConsent === this.consents[consentKey]) return;

      // Store the new consent
      this.consents[consentKey] = newConsent;
      updatedConsents.push(consentKey);
    });

    // Set the user state to confirmed
    this.confirmed = true;

    return updatedConsents;
  }

  /**
   * @returns All the consents
   */
  public getConsents = (): Consents => this.consents;

  /**
   * @returns All the consents as Object.entries()
   */
  public getConsentsEntries = (): Entry<Consents>[] => getObjectEntries(this.consents);

  /**
   * @returns A single consent value
   * @param consentKey
   */
  public getConsent = (consentKey: ConsentKey): boolean => this.consents[consentKey];

  /**
   * Store the banner text
   * @param banner
   */
  public storeBannerText(banner?: HTMLElement): void {
    if (banner && banner.textContent) this.bannerText = banner.textContent;
  }

  /**
   * @returns The banner text
   */
  public getBannerText = (): string | null | undefined => this.bannerText;
}
