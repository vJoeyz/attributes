import ComponentMissingExternalComponentError from './ComponentMissingExternalComponentError';
import type { ParentSelector } from '@src/global/types/schema';
import SchemaSelector from '@src/services/Selector/SchemaSelector';

describe('Missing component on external page error.', () => {


  test('Field is missing component on external page.', () => {


    const attribute = new SchemaSelector('fs-richtext-component', 'my-component=http://google.com')
    const component = new SchemaSelector('fs-richtext-component', 'my-component');


    const error = new ComponentMissingExternalComponentError(attribute, component);

    expect(error.stripHTML())
      .toEqual('External component for fs-richtext-component="my-component=http://google.com" not found. Add attribute fs-richtext-component="my-component" on external page component to make it work.');

  });


});
