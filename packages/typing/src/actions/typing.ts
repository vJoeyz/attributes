import Typed, { type TypedOptions } from 'typed.js';

import { getAttribute, getElementSelector, getInstanceIndex, typingInstancesStore } from '../utils';

export const initTyping = (textElement: HTMLElement) => {
  if (typingInstancesStore.has(textElement)) return;

  const instanceIndex = getInstanceIndex(textElement);
  const contentElements = Array.from(
    document.querySelectorAll(getElementSelector('content', { instanceIndex }).replace(/="content"/g, '^="content"'))
  );
  const strings = contentElements.map((element) => element.textContent || '');

  const speed = getAttribute(textElement, 'speed');
  const loop = getAttribute(textElement, 'loop');
  const effect = getAttribute(textElement, 'effect');
  const backspacespeed = getAttribute(textElement, 'backspacespeed');
  const fadeoutspeed = getAttribute(textElement, 'fadeoutspeed');
  const pausebefore = getAttribute(textElement, 'pausebefore');
  const pauseafter = getAttribute(textElement, 'pauseafter');
  const visiblethreshold = getAttribute(textElement, 'visiblethreshold');
  const showcursor = getAttribute(textElement, 'showcursor');
  const whenvisible = getAttribute(textElement, 'whenvisible');
  const cursorcharacter = getAttribute(textElement, 'cursorcharacter');

  const options: TypedOptions = {
    strings,
    typeSpeed: Number(speed) || 50,
    loop: !(!loop || loop === 'false'),
    fadeOut: effect === 'fade-out',
    smartBackspace: effect === 'backspace',
    backSpeed: Number(backspacespeed) || undefined,
    fadeOutDelay: Number(fadeoutspeed) || undefined,
    startDelay: Number(pausebefore) || undefined,
    backDelay: Number(pauseafter) || undefined,
    showCursor: !(!showcursor || showcursor === 'false'),
    cursorChar: cursorcharacter || '|',
  };

  const typingInstance = new Typed(textElement, options);
  typingInstancesStore.set(textElement, typingInstance);

  return typingInstance;
};
