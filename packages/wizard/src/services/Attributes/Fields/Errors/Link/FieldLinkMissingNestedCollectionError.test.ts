import FieldLinkMissingNestedCollectionError from './FieldLinkMissingNestedCollectionError';
import SchemaSelector from '@src/services/Selector/SchemaSelector';

describe('Field - Link - Main Collection Link Not Found Error', () => {


  test('Field is missing main link to collection', () => {


    const attribute = new SchemaSelector('fs-cmsnest-field', 'attraction-categories');

    const error = new FieldLinkMissingNestedCollectionError(attribute);

    expect(error.stripHTML())
      .toEqual('The Nested Collection List for fs-cmsnest-field="attraction-categories" on the Collection Template page was not found. Add a Nested Collection List on the Collection template Page with the fs-cmsnest-field="attraction-categories" attribute.');

  });


});
