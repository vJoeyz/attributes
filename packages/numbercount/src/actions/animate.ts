import { valueToString } from 'src/utils/helpers';

/**
 * Animates a number element.
 * @param numberElement
 * @param start
 * @param end
 * @param duration
 * @param locale
 */
export const animateNumberCount = (
  numberElement: Element,
  start: number,
  end: number,
  duration: number,
  locale?: string | true
) => {
  const increment = (end - start) / duration;

  let value = start;

  const animate = () => {
    if (value < end) {
      const newValue = value + increment;
      const flooredValue = Math.floor(newValue);

      numberElement.textContent = valueToString(flooredValue, locale);
      value = newValue;
    } else {
      numberElement.textContent = valueToString(end, locale);
    }
  };

  for (let i = 0; i <= duration; i++) {
    setTimeout(animate, i);
  }
};
