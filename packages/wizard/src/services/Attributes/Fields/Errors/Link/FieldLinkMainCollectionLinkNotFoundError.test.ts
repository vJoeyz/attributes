import FieldLinkMainCollectionLinkNotFoundError from './FieldLinkMainCollectionLinkNotFoundError';
import SchemaSelector from '@src/services/Selector/SchemaSelector';

describe('Field - Link - Main Collection Link Not Found Error', () => {


  test('Field is missing main link to collection', () => {


    const attribute = new SchemaSelector('fs-cmsfilter-field', 'attraction-categories');

    const error = new FieldLinkMainCollectionLinkNotFoundError(attribute);

    expect(error.stripHTML())
      .toEqual('The attribute fs-cmsfilter-field="attraction-categories" was found, but there is no reference link to the CMS Collection Item. Add a link to the Collection\'s CMS Template page.');

  });


});
