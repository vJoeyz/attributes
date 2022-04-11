import AttributeNotHasStyleError from './AttributeNotHasStyleError';
import SchemaSelector from '@src/services/Selector/SchemaSelector';

describe('Test Error - Attribute condition setting not match', () => {

  test('Attribute type element not match required setting', () => {

    const attribute = new SchemaSelector('fs-customselect-element', 'fill', true);
    const style = {
      property: 'position',
      value: 'absolute',
    }

    const error = new AttributeNotHasStyleError(attribute, style);

    expect(error.stripHTML())
    .toEqual(
      'The attribute fs-customselect-element="fill" was found but not match required style. In the element with this attribute, set property "position" as "absolute".'
    )
  });
});
