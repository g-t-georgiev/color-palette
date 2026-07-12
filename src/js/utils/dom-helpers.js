/**
 * @template {HTMLElement} tType 
 * @param {NodeList | Array<HTMLElement> | string} elementsOrSelector
 * @returns {tType}
 */
export function createBatchRef(elementsOrSelector) {
  // 1. Get the elements (accepts a css selector string, NodeList, or Array)
  const isCSSselector = typeof elementsOrSelector === "string";
  const isSingleElement = elementsOrSelector instanceof HTMLElement;
  const isIterableOfElements = typeof elementsOrSelector[Symbol.iterator] === "function";

  let elementsList;
  if (isCSSselector || isIterableOfElements) {
    elementsList = Array.from(
      isCSSselector
        ? document.querySelectorAll(elementsOrSelector)
        : elementsOrSelector
    );
  } else if (isSingleElement) {
    elementsList = [elementsOrSelector];
  } else {
    throw new Error("Invalid input type. Accepts CSS selector, NodeList or Array of HTMLElement instances.");
  }

  // 2. Return a Proxy to intercept calls
  return new Proxy(elementsList, {
    get(target, prop) {
      // If asking for standard array properties (like length, forEach), return them normally
      if (prop in target) {
        return target[prop];
      }

      // Check the first element to see what kind of property/method we are dealing with
      const firstEl = target[0];
      if (!firstEl) return undefined;

      // Case A: It's a method (like addEventListener, setAttribute, remove)
      if (typeof firstEl[prop] === 'function') {
        return function (...args) {
          target.forEach(el => el[prop](...args));
          return this; // Allow chaining!
        };
      }

      // Case B: It's a getter property (like value, textContent, checked)
      // Note: Getters usually return the value of the *first* element
      return firstEl[prop];
    },

    set(target, prop, value) {
      // Case C: It's a setter property (like value = 'foo', textContent = 'bar')
      target.forEach(el => {
        el[prop] = value;
      });
      return true; // Success indicator for the Proxy setter
    }
  });
}