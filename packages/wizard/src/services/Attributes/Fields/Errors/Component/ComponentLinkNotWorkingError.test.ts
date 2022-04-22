import ComponentLinkNotWorkingError from './ComponentLinkNotWorkingError';
import SchemaSelector from '@src/services/Selector/SchemaSelector';

describe('Missing field applied tag error.', () => {

  test('Field is missing correct html tag with parent.', () => {


    const attribute = new SchemaSelector('fs-richtext-component', 'my-component=http://google.com')

    const error = new ComponentLinkNotWorkingError(attribute);

    expect(error.stripHTML())
      .toEqual('Link for fs-richtext-component="my-component=http://google.com" not working. Check if link to other page was correct provided in the UI or if the page really exists.');

  });


});
