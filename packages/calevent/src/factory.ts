import { queryAllElements } from './utils';

export const initCalEventInstance = (eventElement: Element) => {
  // Get all google, outlook and apple elements
  const googleButtons = queryAllElements('google', { scope: eventElement });
  const outlookButtons = queryAllElements('outlook', { scope: eventElement });
  const appleButtons = queryAllElements('apple', { scope: eventElement });

  googleButtons.forEach((googleButton) => {
    // only continue if the google button is a direct child of the event element to avoid multiple events
    if (googleButton.parentElement !== eventElement) return;
    console.log('googleButton', googleButton);
  });

  outlookButtons.forEach((outlookButton) => {
    // only continue if the outlook button is a direct child of the event element to avoid multiple events
    if (outlookButton.parentElement !== eventElement) return;
    console.log('outlookButton', outlookButton);
  });

  appleButtons.forEach((appleButton) => {
    // only continue if the apple button is a direct child of the event element to avoid multiple events
    if (appleButton.parentElement !== eventElement) return;
    console.log('appleButton', appleButton);
  });
  console.log('------------------');
};
