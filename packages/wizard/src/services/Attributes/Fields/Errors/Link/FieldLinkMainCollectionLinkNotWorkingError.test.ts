import FieldLinkMainCollectionLinkNotWorkingError from './FieldLinkMainCollectionLinkNotWorkingError';
import SchemaSelector from '@src/services/Selector/SchemaSelector';

describe('Field - Link - Main Collection Link Not Found Error', () => {


  test('Field is missing main link to collection', () => {


    const attribute = new SchemaSelector('fs-cmsfilter-field', 'attraction-categories');

    const error = new FieldLinkMainCollectionLinkNotWorkingError(attribute);

    expect(error.stripHTML())
      .toEqual('The attribute fs-cmsfilter-field="attraction-categories" link was found, but not working Check if link is correctly direction to CMS Collection\'s Item');

  });


});
