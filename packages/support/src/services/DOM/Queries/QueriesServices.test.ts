import { queryAttributeValue, queryChildrenOfElements, queryElement } from './QueriesService';

describe('Query Element', () => {
  test('Get script element from head of page successful', () => {
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

    const response = queryElement('script[src="www.google.com.br/ads.js"]');

    expect(typeof response === 'object').toBe(true);
  });

  test('Get script element from body of page successful', () => {
    global.document.documentElement.innerHTML = `
      <html>
        <body>
          <script async src="www.google.com.br/ads.js"></script>
          <div fs-settings-mode="load-more"></div>
        </body>
      </html>
    `;

    const response = queryElement('script[src="www.google.com.br/ads.js"]');

    expect(typeof response === 'object').toBe(true);
  });

  test('Get script element from page not found return false', () => {
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
    try {
      queryElement('script[src="www.google.com.br/axs.js"]');
      expect(true).toBe(false);
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
    }
  });
});

describe('Query Attribute Value', () => {
  test('Get attribute value from existing element successful', () => {
    global.document.documentElement.innerHTML = `
      <html>
        <head>
          <script async src="www.google.com.br/ads.js"></script>
        </head>
        <body>
          <div fs-settings-threshold="-20" fs-settings-mode="load-more"></div>
        </body>
      </html>
    `;

    const response = queryAttributeValue('[fs-settings-mode]', 'fs-settings-threshold');
    expect(response).toBe('-20');
  });

  test('Get inexistent attribute value from element return false', () => {
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

    try {
      queryAttributeValue('[fs-settings-mode]', 'fs-settings-threshold');
      expect(true).toBe(false);
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
    }
  });

  test('Get attribute value from inexisting element return false', () => {
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

    try {
      queryAttributeValue('[fs-settings-test]', 'fs-settings-threshold');
      expect(true).toBe(false);
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
    }
  });
});

describe('Query childrens of elements', () => {
  beforeEach(() => {
    global.document.documentElement.innerHTML = `
    <html>
      <body>
        <div class="w-pagination-wrapper">
          <button>Click 2</button>
          <button>Click 3</button>
        </div>
        <div fs-cmsload-list="list" class="w-dyn-list" style="background-color: red">
          <div class="w-pagination-wrapper">
            <button>Click 1</button>
            <div class="inner">
              <button>Click 4</button>
            </div>
          </div>
        </div>
      </body>
    </html>
  `;
  });

  test('Test find childrens of single selector', () => {
    const selectors = ['.w-pagination-wrapper'];

    const elements = queryChildrenOfElements(selectors);

    expect(elements && elements.length).toBe(5);

    expect(elements && elements[0].innerHTML).toBe('Click 2');
    expect(elements && elements[1].innerHTML).toBe('Click 3');
    expect(elements && elements[2].innerHTML).toBe('Click 1');
  });

  test('Test find childrens of multiples selectors', () => {
    const selectors = ['.w-pagination-wrapper', '[fs-cmsload-list="list"]'];

    const elements = queryChildrenOfElements(selectors);

    expect(elements && elements[0].innerHTML).toBe('Click 1');
    expect(elements && elements[2].innerHTML).toBe('Click 4');
    expect(elements && elements.length).toBe(3);
  });

  test('Test find childrens of multiples selectors', () => {
    const selectors = ['.w-pagination-wrapper', '[fs-cmsload-list="list"]', '.inner'];

    const elements = queryChildrenOfElements(selectors);
    expect(elements && elements[0].innerHTML).toBe('Click 4');
    expect(elements && elements.length).toBe(1);
  });
});
