import FieldLinkNestedCollectionLinkNotWorkingError from './FieldLinkNestedCollectionLinkNotWorkingError';
import SchemaSelector from '@src/services/Selector/SchemaSelector';

describe('Field - Link - Nested Collection Link Not Working', () => {


  test('Field is missing nested link to collection item', () => {


    const attribute = new SchemaSelector('fs-cmsnest-field', 'attractions-categories');

    const error = new FieldLinkNestedCollectionLinkNotWorkingError(attribute);

    expect(error.stripHTML())
      .toEqual('The attribute fs-cmsnest-field="attractions-categories" was found on the Collection’s CMS Template, but link is not working. Verify the link on the Collection’s CMS Template page.');

  });


});
