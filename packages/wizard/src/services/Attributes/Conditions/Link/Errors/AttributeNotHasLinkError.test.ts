import AttributeNotHasLinkError from './AttributeNotHasLinkError';
import SchemaSelector from '@src/services/Selector/SchemaSelector';
import CMS_PREV_NEXT from '@src/schemas/cms-previous-next';
import type {
  AttributeElementSchema,
} from '@global/types/schema';


describe('Test Error - Attribute not found', () => {

  test('Attribute type element not sibling of required element', () => {

    const attributeSelector = new SchemaSelector('fs-cmsprevnext-element', 'list', true);


    const attributeList = CMS_PREV_NEXT.elements.find((value: AttributeElementSchema) => value.key === 'list');
    if (!attributeList) {
      throw new Error('Unexpected error: Missing list on cms-prev-next schema');
    }

    const error = new AttributeNotHasLinkError(attributeSelector);
    expect(error.stripHTML())
    .toEqual(
      'The attribute fs-cmsprevnext-element="list" was found but missing required link to collection item. Add a link to collection item for every element on list.'
    )
  });


});
