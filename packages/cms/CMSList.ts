import { Debug, getCollectionElements } from '@finsweet/ts-utils';

export class CMSList {
  private readonly list: HTMLDivElement;

  constructor(private readonly wrapper: HTMLDivElement) {
    this.list = getCollectionElements(wrapper, 'list') || Debug.alert('No list found', 'error');
  }
}
