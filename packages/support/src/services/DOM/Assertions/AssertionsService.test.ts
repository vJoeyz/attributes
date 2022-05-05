import {
  assertElementExistsOnPage,
  assertAttributeIsAppliedToElement,
  assertElementIsChildOfElement,
  assertElementIsParentOfElement,
  assertElementIsSiblingOfElement,
  assertElementIsUnique,
} from './AssertionsService';

describe('Assert selector exists on page tests', () => {
  test('Element is on page', () => {
    const selector = '[fs-data-test="load"]';

    global.document.documentElement.innerHTML = `
      <html>
        <body>
          <div fs-data-test="load">
          </div>
        </body>
      </html>
    `;

    const response = assertElementExistsOnPage(selector);

    expect(response).toBe(true);
  });

  test('Threshold is on page', () => {
    const selector = '[fs-cmsload-threshold="-200"]';

    global.document.documentElement.innerHTML = `
      <html>
        <body>
          <div fs-cmsload-threshold="-200">
          </div>
        </body>
      </html>
    `;

    const response = assertElementExistsOnPage(selector);
    expect(response).toBe(true);
  });

  test('Element not found in page', () => {
    const selector = '[fs-data-load="load"]';

    global.document.documentElement.innerHTML = `
      <html>
        <body>
          <div fs-data-test="load">
          </div>
        </body>
      </html>
    `;

    try {
      assertElementExistsOnPage(selector);
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
    }
  });

  test('Element found value but not match attribute', () => {
    const selector = '[fs-settings-mode="infinite"]';

    global.document.documentElement.innerHTML = `
      <html>
        <body>
          <div fs-settings-test="infinite"></div>
        </body>
      </html>
    `;

    try {
      assertElementExistsOnPage(selector);
      expect(true).toBe(false);
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
    }
  });

  test('Element attribute is equal', () => {
    const selector = '[fs-settings-mode="infinite"]';

    global.document.documentElement.innerHTML = `
      <html>
        <body>
          <div fs-settings-mode="infinite"></div>
        </body>
      </html>
    `;

    const response = assertElementExistsOnPage(selector);

    expect(response).toBe(true);
  });

  test('Element attribute is different', () => {
    const selector = '[fs-settings-mode="infinite"]';

    global.document.documentElement.innerHTML = `
      <html>
        <body>
          <div fs-settings-mode="load-more"></div>
        </body>
      </html>
    `;

    try {
      assertElementExistsOnPage(selector);
      expect(true).toBe(false);
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
    }
  });
});

describe('Assert Attribute Is Applied To Element', () => {
  test('Element not match class because attribute name is different', () => {
    const selector = '[fs-data-retest="load"]';

    global.document.documentElement.innerHTML = `
      <html>
        <body>
          <div class="my-class" fs-data-test="load">
          </div>
        </body>
      </html>
    `;

    try {
      assertAttributeIsAppliedToElement(selector, '.my-class');
      expect(true).toBe(false);
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
    }
  });

  test('Element match class', () => {
    const selector = '[fs-data-test="load"]';

    global.document.documentElement.innerHTML = `
      <html>
        <body>
          <div class="my-class" fs-data-test="load">
          </div>
        </body>
      </html>
    `;

    const response = assertAttributeIsAppliedToElement(selector, '.my-class');

    expect(response).toBe(true);
  });

  test('Element not match class because class is different', () => {
    const selector = '[fs-data-test="load"]';

    global.document.documentElement.innerHTML = `
      <html>
        <body>
          <div class="your-class" fs-data-test="load">
          </div>
        </body>
      </html>
    `;

    try {
      assertAttributeIsAppliedToElement(selector, '.my-class');
      expect(true).toBe(false);
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
    }
  });
});

describe('Assert element is child of element', () => {
  test('Element is children of element', () => {
    const selector = '[fs-data-test="load"]';

    global.document.documentElement.innerHTML = `
      <html>
        <body>
          <div class="my-class">
            <div fs-data-test="load"></div>
          </div>
        </body>
      </html>
    `;

    const response = assertElementIsChildOfElement(selector, '.my-class');

    expect(response).toBe(true);
  });

  test('Element is grand children of element', () => {
    const selector = '[fs-data-test="load"]';

    global.document.documentElement.innerHTML = `
      <html>
        <body>
          <div class="my-class">
            <div class="my-class-2">
              <div class="my-class-3">
                <div fs-data-test="load"></div>
              </div>
            </div>
          </div>
        </body>
      </html>
    `;

    const response = assertElementIsChildOfElement(selector, '.my-class');

    expect(response).toBe(true);
  });

  test('Children not found', () => {
    const selector = '[fs-data-retest="load"]';

    global.document.documentElement.innerHTML = `
      <html>
        <body>
          <div class="my-class">
            <div fs-data-test="load"></div>
          </div>
        </body>
      </html>
    `;

    try {
      assertElementIsChildOfElement(selector, '.my-class');
      expect(true).toBe(false);
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
    }
  });

  test('Parent not found', () => {
    const selector = '[fs-data-retest="load"]';

    global.document.documentElement.innerHTML = `
      <html>
        <body>
          <div class="my-classs">
            <div fs-data-test="load"></div>
          </div>
        </body>
      </html>
    `;

    try {
      assertElementIsChildOfElement(selector, '.my-class');
    } catch (e) {
      expect(e).toBeInstanceOf(Error);
    }
  });

  test('Element is not children of other element because are in same level', () => {
    const selector = '[fs-data-test="load"]';

    global.document.documentElement.innerHTML = `
      <html>
        <body>
          <div fs-data-test="load"></div>
          <div class="my-class"></div>
        </body>
      </html>
    `;

    try {
      assertElementIsChildOfElement(selector, '.my-class');
    } catch (e) {
      expect(e).toBeInstanceOf(Error);
    }
  });

  test('Element is not children of other element but parent', () => {
    const selector = '[fs-data-test="load"]';

    global.document.documentElement.innerHTML = `
      <html>
        <body>
          <div fs-data-test="load">
            <div class="my-class">
            </div>
          </div>
        </body>
      </html>
    `;

    try {
      assertElementIsChildOfElement(selector, '.my-class');
      expect(true).toBe(false);
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
    }
  });
});

describe('Assert element is parent of element', () => {
  test('Element is parent of other element', () => {
    const selector = '[fs-data-test="load"]';

    global.document.documentElement.innerHTML = `
      <html>
        <body>
          <div fs-data-test="load">
            <div>
               <div class="my-class">
            </div>
          </div>
        </body>
      </html>
    `;

    const response = assertElementIsParentOfElement(selector, '.my-class');

    expect(response).toBe(true);
  });

  test('Element is not parent of other element', () => {
    const selector = '[fs-data-test="load"]';

    global.document.documentElement.innerHTML = `
      <html>
        <body>
          <div fs-data-test="load"></div>
          <div class="my-class"></div>
        </body>
      </html>
    `;

    try {
      assertElementIsParentOfElement(selector, '.my-class');
      expect(true).toBe(false);
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
    }
  });
});

describe('Assert element is not duplicated', () => {
  test('Element is unique', () => {
    global.document.documentElement.innerHTML = `
      <html>
        <head>
          <script async src="www.google.com.br/ads.js"></script>
        </head>
        <body>
          <div fs-settings-mode="load-more"></div>
        </body>
      </html>
    `;

    const selector = `script[src*='www.google.com.br/ads.js']`;
    const response = assertElementIsUnique(selector);

    expect(response).toBe(true);
  });

  test('Element is not unique', () => {
    global.document.documentElement.innerHTML = `
      <html>
        <head>
          <script async src="www.google.com.br/ads.js"></script>
          <script async src="www.google.com.br/ads.js"></script>
        </head>
        <body>
          <div fs-settings-mode="load-more"></div>
        </body>
      </html>
    `;

    const selector = `script[src*='www.google.com.br/ads.js']`;

    try {
      assertElementIsUnique(selector);
      expect(true).toBe(false);
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
    }
  });
});

describe('Assert element is sibling of element', () => {
  test('Element is sibling of element', () => {
    const selector = '[fs-data-test="element"]';
    const sibling = '[fs-data-test="sibling"]';

    global.document.documentElement.innerHTML = `
      <html>
        <body>
          <div class="my-class">
            <div fs-data-test="element"></div>
            <div fs-data-test="sibling"></div>
          </div>
        </body>
      </html>
    `;

    const response = assertElementIsSiblingOfElement(selector, sibling);

    expect(response).toBe(true);
  });

  test('Element is not sibling of element', () => {
    const selector = '[fs-data-test="element"]';
    const sibling = '[fs-data-test="sibling"]';

    global.document.documentElement.innerHTML = `
      <html>
        <body>
          <div class="my-class">
            <div>
              <div fs-data-test="element"></div>
            </div>
            <div>
              <div fs-data-test="sibling"></div>
            </div>
          </div>
        </body>
      </html>
    `;

    try {
      assertElementIsSiblingOfElement(selector, sibling);

      expect(true).toBe(false);
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
    }
  });
});
