import AttributeDuplicatedError from './AttributeDuplicatedError';
import SchemaSelector from '@src/services/Selector/SchemaSelector';

describe('Test Error - Attribute duplicated', () => {

  test('Attribute type element duplicated', () => {

    const attributeSelector = new SchemaSelector('fs-cmsload-element', 'list', true);

    const error = new AttributeDuplicatedError(attributeSelector);
    expect(error.stripHTML())
    .toEqual(
      'The attribute fs-cmsload-element="list" was found but it is duplicated on page. Remove the duplicated attributes from the page.'
    )
  });

});
