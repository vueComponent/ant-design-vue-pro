# intersperse

Add an object to an array between each element.


## Installation

	npm install intersperse

## Example

```javascript
var intersperse = require('intersperse');
var arr = intersperse([1, 2, 3], 'a');

console.log(arr) // [1, 'a', 2, 'a', 3]
```