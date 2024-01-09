import { CURRENT_CSS_CLASS, Interaction } from '@finsweet/ts-utils';

import { type ScrollContext, scrollLinkIntoView } from '../utils/helpers';
import type { ScrollOffsetStyles, TOCData } from '../utils/types';

export class TOCItem implements TOCData {
  public readonly level: number;
  public readonly linkWrapper: HTMLElement;
  public readonly referenceNode: Element;
  public readonly anchor: Node;
  public readonly component: HTMLElement;
  public readonly linkElement: HTMLAnchorElement;
  public readonly headingElement?: HTMLHeadingElement;
  public readonly headingWrapper?: HTMLDivElement;
  public readonly id?: string;
  public readonly ixTrigger: HTMLElement | null;

  private readonly interaction?: Interaction;

  private currentState?: boolean;

  constructor({
    level,
    component,
    linkElement,
    linkWrapper,
    headingElement,
    headingWrapper,
    id,
    ixTrigger,
    referenceNode,
    anchor,
  }: TOCData) {
    this.level = level;
    this.linkWrapper = linkWrapper;
    this.referenceNode = referenceNode;
    this.anchor = anchor;
    this.component = component;
    this.linkElement = linkElement;
    this.headingElement = headingElement;
    this.headingWrapper = headingWrapper;
    this.id = id;
    this.ixTrigger = ixTrigger;
    this.interaction = ixTrigger ? new Interaction({ element: ixTrigger }) : undefined;

    this.#render();
  }

  /**
   * Populates and the link in the TOC.
   */
  #render() {
    const { headingElement, id, referenceNode, linkElement, linkWrapper, component, anchor } = this;

    if (headingElement && id) {
      referenceNode.textContent = headingElement.textContent;
      linkElement.href = `#${id}`;
    } else {
      linkElement.remove();
    }

    linkWrapper.insertBefore(component, anchor);
  }

  /**
   * Sets scroll offset to the heading using CSS scroll-margin.
   * @param offsets
   */
  public setScrollOffset(offsets: ScrollOffsetStyles) {
    const { headingWrapper } = this;

    if (headingWrapper) Object.assign(headingWrapper.style, offsets);
  }

  /**
   * Updates the `active` state of the link and triggers the correspondent interaction, if existing.
   */
  public updateState() {
    const { linkElement, interaction, currentState } = this;

    const isActive = linkElement.classList.contains(CURRENT_CSS_CLASS);

    const context: ScrollContext = {
      linkElement,
      interaction: 'fromTop',
    };

    if (isActive) scrollLinkIntoView(context);

    if (isActive === currentState) return;

    interaction?.trigger(isActive ? 'first' : 'second');

    this.currentState = isActive;
  }
}
