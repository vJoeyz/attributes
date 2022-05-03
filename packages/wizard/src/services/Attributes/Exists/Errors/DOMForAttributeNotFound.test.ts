import DOMForAttributeNotFound from './DOMForAttributeNotFound';
import SchemaSelector from '@src/services/Selector/SchemaSelector';
import CMS_LOAD from '@src/schemas/cms-load';
import type { AttributeElementSchema } from '@global/types/schema';

describe('Test Error - DOM For Attribute not found', () => {

  test('Attribute type element not found', () => {


    const attributeSelector = new SchemaSelector('fs-cmsload-element', 'list', true);

    const attributeSchema = CMS_LOAD.elements.find((value: AttributeElementSchema) => value.key === 'list');
    if (!attributeSchema) {
      throw new Error('Unexpected error: Missing list on cms-load schema');
    }

    const appliedTo = attributeSchema.appliedTo;

    const error = new DOMForAttributeNotFound(attributeSelector, appliedTo);
    expect(error.stripHTML())
    .toEqual(
      'The Collection List is not found on the page. Add a Collection List component and then add fs-cmsload-element="list" to it.'
    );
  });

});
