/**
 * @typedef {import("../../packages/cms/cmscore/src/CMSList").CMSList} CMSList
 */

/**
 * @typedef Product
 * @prop {string} id
 * @prop {string} title
 * @prop {number} price
 * @prop {string} description
 * @prop {string} category
 * @prop {string} image
 * @prop {Rating} ratng
 *
 * @typedef Rating
 * @prop {number} rate
 * @prop {number} count
 */
window.fsAttributes = window.fsAttributes || [];
window.fsAttributes.push([
  'cmsload',
  async (listInstances) => {
    // Get the list instance
    /** @type {CMSList[]} */
    const [listInstance] = listInstances;
    if (!listInstance) return;

    // Save a copy of the template
    const [{ element: templateElement }] = listInstance.items;

    // Remove existing items
    listInstance.clearItems();

    // Fetch external data
    const products = await fetchProducts();

    // Create the new items
    const newItems = products.map((product) => createItem(product, templateElement));

    // Populate the list
    await listInstance.addItems(newItems);
  },
]);

/**
 * Fetches fake products from Fake Store API.
 * @returns {Product[]} An array of products.
 */
const fetchProducts = async () => {
  try {
    const response = await fetch('https://fakestoreapi.com/products');
    const data = await response.json();

    return data;
  } catch (error) {
    return [];
  }
};

/**
 * Creates an item from the template element.
 * @param {Product} data The data to create the item from.
 * @param {HTMLElement} templateElement The template element.
 *
 * @returns {HTMLElement} The new item.
 */
const createItem = (data, templateElement) => {
  const newItem = templateElement.cloneNode(true);

  const image = newItem.querySelector('[data-element="image"]');
  const title = newItem.querySelector('[data-element="title"]');
  const category = newItem.querySelector('[data-element="category"]');
  const description = newItem.querySelector('[data-element="description"]');

  image.src = data.image;
  title.textContent = data.title;
  category.textContent = data.category;
  description.textContent = data.description;

  return newItem;
};
