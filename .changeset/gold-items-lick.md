---
'@finsweet/attributes-cmssort': patch
---

Fixed `fs-cmssort-type="number"` sorting.
Now the numbers will be normalized before sorting, meaning that values that contain alphanumeric symbols like `$20,000.00` will be converted to a valid float like `20000.00` to sort them correctly.
