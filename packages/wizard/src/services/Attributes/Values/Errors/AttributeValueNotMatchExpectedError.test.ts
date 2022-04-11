import AttributeValueNotMatchExpectedError from './AttributeValueNotMatchExpectedError';
import SchemaSelector from '@src/services/Selector/SchemaSelector';

describe('Test Error - Attribute duplicated', () => {

  test('Attribute type element duplicated', () => {

    const attributeSelector = new SchemaSelector('fs-cmsload-mode', 'infinite', true);

    const domValue = 'load-under';
    const expectedValue = 'infinite';

    const error = new AttributeValueNotMatchExpectedError(attributeSelector, domValue, expectedValue);
    expect(error.stripHTML())
    .toEqual(
      'The value of fs-cmsload-mode does not match the provided value. Change value "load-under" to value "infinite".'
    )
  });

});
