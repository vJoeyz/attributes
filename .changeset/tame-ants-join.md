---
'@finsweet/attributes-cmsslider': patch
---

Fixed sliders being populated inconsistently.
This was being caused by Webflow not redrawing the sliders by just using `Webflow.require('slider').redraw();`.
The sliders were correctly populated by `fs-cmsslider`, but Webflow failed at restarting the slider functionalities and account for the new slides.
