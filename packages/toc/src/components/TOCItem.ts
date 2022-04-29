import { CURRENT_CSS_CLASS, Interaction } from '@finsweet/ts-utils';

import { ANCHOR_SELECTOR } from '../utils/constants';
import type { ScrollOffsetStyles, TOCData } from '../utils/types';

export class TOCItem implements TOCData {
  public readonly wrapperElement: HTMLElement;
  public readonly referenceNode: Element;
  public readonly component: HTMLElement;
  public readonly linkElement: HTMLAnchorElement;
  public readonly level: number;
  public readonly headingElement?: HTMLHeadingElement | undefined;
  public readonly id?: string | undefined;
  public readonly ixTrigger: HTMLElement | null;

  private readonly interaction?: Interaction;
  private currentState?: boolean;

  constructor({
    component,
    level,
    linkElement,
    wrapperElement,
    headingElement,
    id,
    ixTrigger,
    referenceNode,
  }: TOCData) {
    this.wrapperElement = wrapperElement;
    this.referenceNode = referenceNode;
    this.component = component;
    this.linkElement = linkElement;
    this.level = level;
    this.headingElement = headingElement;
    this.id = id;
    this.ixTrigger = ixTrigger;
    this.interaction = ixTrigger ? new Interaction({ element: ixTrigger }) : undefined;

    this.#populateLink();
  }

  /**
   * Populates the link element.
   */
  #populateLink() {
    const { headingElement, id, referenceNode, linkElement } = this;

    if (headingElement && id) {
      referenceNode.textContent = headingElement.textContent;
      linkElement.href = `#${id}`;
    } else {
      linkElement.remove();
    }
  }

  /**
   * Renders the link in the TOC.
   * @param levelExists Defines if the current heading level already exists in the TOC.
   */
  public renderLink(levelExists: boolean) {
    const { wrapperElement, component, linkElement } = this;

    const elementToRender = levelExists ? linkElement : component;

    const anchor = [...wrapperElement.childNodes].find(
      ({ nodeType, nodeValue }) => nodeType === 8 && nodeValue === ANCHOR_SELECTOR
    );

    if (anchor) wrapperElement.insertBefore(elementToRender, anchor);
    else wrapperElement.append(elementToRender);
  }

  /**
   * Sets scroll offset to the heading using CSS scroll-margin.
   * @param offsets
   */
  public setScrollOffset(offsets: ScrollOffsetStyles) {
    const { headingElement } = this;

    if (headingElement) Object.assign(headingElement.style, offsets);
  }

  /**
   * Sets the `active` state to the link and triggers the correspondent interaction, if existing.
   * @param active Defines if the state is active.
   */
  public setState(active: boolean) {
    const { linkElement, interaction, currentState } = this;

    console.log('setting state', active, this.headingElement);

    if (active === currentState) return;

    linkElement.classList[active ? 'add' : 'remove'](CURRENT_CSS_CLASS);

    if (interaction) interaction.trigger(active ? 'first' : 'second');

    this.currentState = active;
  }
}
