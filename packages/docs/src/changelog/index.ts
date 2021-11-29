import { init as cmsloadInit } from '$cms/cmsload/src/init';
import { attributesData } from '../../api/attributes';
import { getAttributeChangesets } from './fetch';
import { createChangesetElement } from './dom';
import { initAttributeSelect } from './select';
import { hideLoader } from './loader';

/**
 * Init
 */
window.Webflow ||= [];
window.Webflow.push(async () => {
  const listInstances = await cmsloadInit();

  const [listInstance] = listInstances;
  if (!listInstance) return;

  const [{ element: templateElement }] = listInstance.items;

  listInstance.clearItems?.(true);
  listInstance.itemsPerPage = 20;

  const addSelectOption = initAttributeSelect();

  await Promise.all(
    attributesData.map(async (attributeData) => {
      const { title } = attributeData;

      addSelectOption(title);

      const changesets = await getAttributeChangesets(attributeData);
      if (!changesets) return;

      const newElements: HTMLDivElement[] = [];

      for (const changeset of changesets) {
        const newElement = createChangesetElement(attributeData, changeset, templateElement);

        newElements.push(newElement);
      }

      await listInstance.addItems(newElements);
    })
  );

  hideLoader();
});
