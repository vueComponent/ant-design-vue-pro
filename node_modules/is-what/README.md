# is What? 🙉

Very simple &amp; small JS type check functions. It's fully TypeScript supported!

```
npm i is-what
```

Or for deno available at: `"deno.land/x/is_what"`

## Motivation

I built is-what because the existing solutions were all too complex or too poorly built.

I was looking for:
- A simple way to check any kind of type (including non-primitives)
- Be able to check if an object is a plain object `{}` or a special object (like a class instance) ‼️
- Let TypeScript automatically know what type a value is when checking

And that's exactly what `is-what` is! (what a great wordplay 😃)

## Usage

is-what is really easy to use, and most functions work just like you'd expect.

```js
// import functions you want to use like so:
import { isString, isDate, isPlainObject } from 'is-what'
```

1. First I'll go over the simple functions available. Only `isNumber` and `isDate` have special treatment.
2. After that I'll talk about working with Objects (plain objects vs class instances etc.).
3. Lastly I'll talk about TypeScript implementation

### Simple type check functions

```js
// strings
isString('') // true
isEmptyString('') // true
isFullString('') // false

// numbers
isNumber(0) // true
isNumber(NaN) // false

// dates
isDate(new Date()) // true
isDate(new Date('invalid date')) // false

// others
isBoolean(false) // true
isFunction(function () {}) // true
isArray([]) // true
isUndefined(undefined) // true
isNull(null) // true
isRegExp(/\s/gi) // true
isSymbol(Symbol()) // true
isBlob(new Blob()) // true
isFile(new File([''], '', { type: 'text/html' })) // true

// primitives
isPrimitive('') // true
// true for any of: boolean, null, undefined, number, string, symbol
```

### Getting and checking for specific types

You can check for specific types with `getType` and `isType`:

```js
import { getType, isType } from 'is-what'

getType('') // returns 'String'
// pass a Type as second param:
isType('', String) // returns true
```

### isPlainObject vs isAnyObject

Checking for a JavaScript object can be really difficult. In JavaScript you can create classes that will behave just like JavaScript objects but might have completely different prototypes. With is-what I went for this classification:

- `isPlainObject` will only return `true` on plain JavaScript objects and not on classes or others
- `isAnyObject` will be more loose and return `true` on regular objects, classes, etc.

```js
// define a plain object
const plainObject = {hello: 'I am a good old object.'}

// define a special object
class SpecialObject {
  constructor (somethingSpecial) {
    this.speciality = somethingSpecial
  }
}
const specialObject = new SpecialObject('I am a special object! I am a class instance!!!')

// check the plain object
isPlainObject(plainObject) // returns true
isAnyObject(plainObject) // returns true
getType(plainObject) // returns 'Object'

// check the special object
isPlainObject(specialObject) // returns false !!!!!!!!!
isAnyObject(specialObject) // returns true
getType(specialObject) // returns 'Object'
```

> Please note that `isPlainObject` will only return `true` for normal plain JavaScript objects.

## TypeScript

is-what makes TypeScript know the type during if statements. This means that a check returns the type of the payload for TypeScript users.

```ts
function isNumber (payload: any): payload is number {
  // return boolean
}
// As you can see above, all functions return a boolean for JavaScript, but pass the payload type to TypeScript.

// usage example:
function fn (payload: string | number): number {
  if (isNumber(payload)) {
    // ↑ TypeScript already knows payload is a number here!
    return payload
  }
  return 0
}
```

`isPlainObject` and `isAnyObject` with TypeScript will declare the payload to be an object type with any props:

```ts
function isPlainObject (payload: any): payload is {[key: string]: any}
function isAnyObject (payload: any): payload is {[key: string]: any}
// The reason to return `{[key: string]: any}` is to be able to do
if (isPlainObject(payload) && payload.id) return payload.id
// if isPlainObject() would return `payload is object` then it would give an error at `payload.id`
```

### isObjectLike

If you want more control over which kind of objects are allowed you can use `isObjectLike<T>`:

```ts
import { isObjectLike } from 'is-what'
// usage examples:
isObjectLike<{specificKey: string}>(payload)
isObjectLike<object>(payload)
// you can pass a specific type for TS to check on.
```

`isObjectLike<T>` works like this under the hood:

```ts
function isObjectLike<T extends object> (payload: any): payload is T {
  return isAnyObject(payload)
}
```

## Meet the family

- [is-what 🙉](https://github.com/mesqueeb/is-what)
- [merge-anything 🥡](https://github.com/mesqueeb/merge-anything)
- [filter-anything ⚔️](https://github.com/mesqueeb/filter-anything)
- [find-and-replace-anything 🎣](https://github.com/mesqueeb/find-and-replace-anything)
- [compare-anything 🛰](https://github.com/mesqueeb/compare-anything)
- [copy-anything 🎭](https://github.com/mesqueeb/copy-anything)
- [flatten-anything 🏏](https://github.com/mesqueeb/flatten-anything)

## Source code

It's litterally just these functions:

```js
function getType (payload) {
  return Object.prototype.toString.call(payload).slice(8, -1)
}
function isUndefined (payload) {
  return getType(payload) === 'Undefined'
}
function isString (payload) {
  return getType(payload) === 'String'
}
function isAnyObject (payload) {
  return getType(payload) === 'Object'
}
// etc...
```

See the full source code [here](https://github.com/mesqueeb/is-what/blob/master/src/index.ts).
