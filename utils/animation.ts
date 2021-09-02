type Easing =
  | 'ease'
  | 'ease-in'
  | 'ease-out'
  | 'ease-in-out'
  | 'linear'
  | `cubic-bezier(${number}, ${number}, ${number}, ${number})`;

export const fadeOut = (
  element: HTMLElement,
  { easing = 'ease', duration = 200 }: { easing?: Easing; duration?: number } = {}
): void => {
  const callback = ({ propertyName }: TransitionEvent) => {
    if (propertyName !== 'opacity') return;

    element.removeEventListener('transitionend', callback);
    element.style.display = 'none';
  };

  element.addEventListener('transitionend', callback);

  element.style.transition = `opacity ${duration}ms ${easing}`;
  element.style.opacity = '0';
};

export const fadeIn = (
  element: HTMLElement,
  {
    displayStyle = 'block',
    easing = 'ease',
    duration = 200,
  }: { displayStyle?: string; easing?: Easing; duration?: number } = {}
): void => {
  element.style.opacity = '0';
  element.style.display = displayStyle;

  window.requestAnimationFrame(() => {
    element.style.transition = `opacity ${duration}ms ${easing}`;
    element.style.opacity = '1';
  });
};

const element = document.createElement('div');

fadeIn(element, { easing: 'cubic-bezier(0.1, 0.7, 1.0, 0.1)', duration: 200 });
