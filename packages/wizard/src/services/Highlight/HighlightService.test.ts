import { createHighlight } from './HighlightService';
import CMS_LOAD from '@src/schemas/cms-load';

describe('Highlight elements on page', () => {

  test('Create highlight setup for attribute', () => {
    const schemaSettings = {
      instance: 3,
      standalone: false,
      key: 'cmsload',
    };

    const response = createHighlight('list', 'element', null, null, CMS_LOAD, schemaSettings);

    expect(response.backupStyles.length).toBe(0);

    expect(response.elements.length).toBe(0);

  });
});
