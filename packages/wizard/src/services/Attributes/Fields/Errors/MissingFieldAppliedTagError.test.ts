import MissingFieldAppliedTagError from './MissingFieldAppliedTagError';
import type { ParentSelector } from '@global/types/schema';
import SchemaSelector from '@src/services/Selector/SchemaSelector';

describe('Missing field applied tag error.', () => {


  test('Field is missing correct html tag with parent.', () => {


    const attribute = new SchemaSelector('fs-cmsfilter-field', 'products', true);

    const parent: ParentSelector = [{
      "type": "element",
      "element": "list"
    }, {
      type: 'selector',
      selector: {
        selectors: ['div'],
        label: 'Div Block',
      }
    }];

    const selectors = [
      {
        label: 'Checkbox Label',
        selectors: [],
      }
    ]


    const error = new MissingFieldAppliedTagError(attribute, parent, selectors);

    expect(error.stripHTML())
      .toEqual('The attribute fs-cmsfilter-field="products" in list>Div Block was found on the page but not in the correct element. Add or move fs-cmsfilter-field="products" to the Checkbox Label.');

  });

  test('Field is missing correct html tag without parent.', () => {

    const attribute = new SchemaSelector('fs-cmsfilter-field', 'products', true);


    const selectors = [
      {
        label: 'Checkbox Label',
        selectors: [],
      }
    ]


    const error = new MissingFieldAppliedTagError(attribute, null, selectors);

    expect(error.stripHTML())
      .toEqual('The attribute fs-cmsfilter-field="products" was found on the page but not in the correct element. Add or move fs-cmsfilter-field="products" to the Checkbox Label.');

  });
});
