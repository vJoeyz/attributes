---
'@finsweet/attributes-a11y': minor
'@finsweet/attributes-animation': minor
'@finsweet/attributes-autovideo': minor
'@finsweet/attributes-cmsattribute': minor
'@finsweet/attributes-cmscombine': minor
'@finsweet/attributes-cmscore': minor
'@finsweet/attributes-cmscss': minor
'@finsweet/attributes-cmsfilter': minor
'@finsweet/attributes-cmsload': minor
'@finsweet/attributes-cmsnest': minor
'@finsweet/attributes-cmsprevnext': minor
'@finsweet/attributes-cmsselect': minor
'@finsweet/attributes-cmsslider': minor
'@finsweet/attributes-cmssort': minor
'@finsweet/attributes-cmsstatic': minor
'@finsweet/attributes-cmstabs': minor
'@finsweet/attributes-codehighlight': minor
'@finsweet/attributes-copyclip': minor
'@finsweet/attributes-countitems': minor
'@finsweet/attributes-displayvalues': minor
'@finsweet/attributes-docs': minor
'@finsweet/attributes-favcustom': minor
'@finsweet/attributes-formsubmit': minor
'@finsweet/attributes-greenhouse': minor
'@finsweet/attributes-launchdarkly': minor
'@finsweet/attributes-linkblockedit': minor
'@finsweet/attributes-mirrorclick': minor
'@finsweet/attributes-mirrorinput': minor
'@finsweet/attributes-queryparam': minor
'@finsweet/attributes-rangeslider': minor
'@finsweet/attributes-readtime': minor
'@finsweet/attributes-richtext': minor
'@finsweet/attributes-scrolldisable': minor
'@finsweet/attributes-selectcustom': minor
'@finsweet/attributes-sliderdots': minor
'@finsweet/attributes-smartlightbox': minor
'@finsweet/attributes-socialshare': minor
'@finsweet/attributes-toc': minor
---

Created new `window.fsAttributes.destroy()` method to support SPA environments.
This new method allows users to destroy all Attributes instances, cleaning up event listeners, observers, states, global variables, etc.

Websites that use a client-side router that simulates an SPA environment like [barba.js](https://barba.js.org/) or [Swup](https://swup.js.org/) can now properly init and destroy Attributes.
After destroying, Attributes can be manually re-initted by calling `window.fsAttribute[ATTRIBUTE_KEY].init()`.
