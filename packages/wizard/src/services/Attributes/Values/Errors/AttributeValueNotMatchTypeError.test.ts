import AttributeValueNotMatchTypeError from './AttributeValueNotMatchTypeError';
import SchemaSelector from '@src/services/Selector/SchemaSelector';

describe('Test Error - Attribute duplicated', () => {

  test('Attribute type element duplicated', () => {

    const attributeSelector = new SchemaSelector('fs-cmsload-duration', 'abc', true);

    const expectedType = 'float';


    const error = new AttributeValueNotMatchTypeError(attributeSelector, expectedType);
    expect(error.stripHTML())
    .toEqual(
      'The value of fs-cmsload-duration is not in the expected format. Please provide a valid float.'
    )
  });

});
