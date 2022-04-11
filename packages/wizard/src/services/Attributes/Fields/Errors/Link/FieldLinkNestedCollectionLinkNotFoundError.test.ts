import FieldLinkNestedCollectionLinkNotFoundError from './FieldLinkNestedCollectionLinkNotFoundError';
import SchemaSelector from '@src/services/Selector/SchemaSelector';

describe('Field - Link - Nested Collection Link Not Found Error', () => {


  test('Field is missing nested link to collection item', () => {


    const attribute = new SchemaSelector('fs-cmsnest-field', 'attractions-categories');

    const error = new FieldLinkNestedCollectionLinkNotFoundError(attribute);

    expect(error.stripHTML())
      .toEqual('The attribute fs-cmsnest-field="attractions-categories" was found on the Collection’s CMS Template, but missing the link to each item. Add a link to the Collection’s CMS Template page.');

  });


});
