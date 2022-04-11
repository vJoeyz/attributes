import AttributeNotFoundError from './AttributeNotFoundError';
import SchemaSelector from '@src/services/Selector/SchemaSelector';
import CMS_LOAD from '@src/schemas/cms-load';
import type { AttributeElementSchema } from '@src/global/types/schema';

describe('Test Error - Attribute not found', () => {

  test('Attribute type element not found', () => {


    const attributeSelector = new SchemaSelector('fs-cmsload-element', 'list', true);

    const attributeSchema = CMS_LOAD.elements.find((value: AttributeElementSchema) => value.key === 'list');
    if (!attributeSchema) {
      throw new Error('Unexpected error: Missing list on cms-load schema');
    }

    const appliedTo = attributeSchema.appliedTo;

    const error = new AttributeNotFoundError(attributeSelector, appliedTo);
    expect(error.stripHTML())
    .toEqual(
      'The attribute fs-cmsload-element="list" was not found. Add fs-cmsload-element="list" to the Collection List or Collection List Wrapper on the page.'
    )
  });

});
