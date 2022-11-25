import test from 'ava'
import {
  isError,
  isEmptyArray,
  isObject,
  isPlainObject,
  isAnyObject,
  isUndefined,
  isNull,
  isNullOrUndefined,
  isFunction,
  isArray,
  isString,
  isEmptyString,
  isFullString,
  isBoolean,
  isRegExp,
  isNumber,
  isDate,
  isSymbol,
  isPrimitive,
  isType,
  isMap,
  isWeakMap,
  isSet,
  isWeakSet,
  isFullArray,
  // isBlob,
  // isFile,
  isPromise,
  isNaNValue,
  isEmptyObject,
  isOneOf,
  isFullObject,
} from '../src/index'

// const blob = Buffer.from([])

test('Basic true tests', t => {
  t.is(isError(new Error('')), true)
  t.is(isUndefined(undefined), true)
  t.is(isNull(null), true)
  t.is(isNullOrUndefined(null), true)
  t.is(isNullOrUndefined(undefined), true)
  t.is(isObject({}), true)
  t.is(isEmptyObject({}), true)
  t.is(isFullObject({0: ''}), true)
  t.is(isFullObject({'': ''}), true)
  t.is(isObject(new Object()), true)
  t.is(isArray([]), true)
  t.is(isEmptyArray([]), true)
  t.is(isFullArray(['']), true)
  t.is(isArray(new Array()), true)
  t.is(isString(''), true)
  t.is(isString('_'), true)
  t.is(isEmptyString(''), true)
  t.is(isFullString(' '), true)
  t.is(isBoolean(true), true)
  t.is(isBoolean(false), true)
  t.is(isRegExp(/./), true)
  t.is(isRegExp(/./gi), true)
  t.is(isNumber(0), true)
  t.is(isNumber(1), true)
  t.is(isDate(new Date()), true)
  t.is(isSymbol(Symbol()), true)
  t.is(isMap(new Map()), true)
  t.is(isWeakMap(new WeakMap()), true)
  t.is(isSet(new Set()), true)
  t.is(isWeakSet(new WeakSet()), true)
  // t.is(isBlob(blob), true)
  // t.is(isFile(new File([''], '', { type: 'text/html' })), true)
  t.is(isPromise(new Promise((resolve, reject) => {})), true)
})

test('Basic false tests', t => {
  t.is(isError({}), false)
  t.is(isNumber(NaN), false)
  t.is(isDate(new Date('_')), false)
  t.is(isDate(NaN), false)
  t.is(isUndefined(NaN), false)
  t.is(isNull(NaN), false)
  t.is(isObject(NaN), false)
  t.is(isArray(NaN), false)
  t.is(isString(NaN), false)
  t.is(isEmptyString(' '), false)
  t.is(isFullString(''), false)
  t.is(isBoolean(NaN), false)
  t.is(isRegExp(NaN), false)
  t.is(isSymbol(NaN), false)
  t.is(isMap(new WeakMap()), false)
  t.is(isWeakMap(new Map()), false)
  t.is(isSet(new WeakSet()), false)
  t.is(isWeakSet(new Set()), false)
  t.is(isNullOrUndefined(NaN), false)
})

test('isFunction', t => {
  t.is(isFunction(NaN), false)
  t.is(isFunction(() => {}), true)
  t.is(isFunction(function () {}), true)
  t.is(isFunction(async () => {}), true)
  t.is(isFunction(async function () {}), true)
  t.is(isFunction(function * () {}), true)
  t.is(isFunction(async function * () {}), true)
  const _ = { fn: () => {}, method () {} }
  t.is(isFunction(_.fn), true)
  t.is(isFunction(_.method), true)
})

test('isEmptyObject', t => {
  t.is(isEmptyObject({}), true)
  t.is(isEmptyObject(new Object()), true)

  t.is(isEmptyObject('{}'), false)
  t.is(isEmptyObject('{}'), false)
  t.is(isEmptyObject(null), false)
  t.is(isEmptyObject(new Date()), false)
  t.is(isEmptyObject(new Error('')), false)
  t.is(isEmptyObject(new Date()), false)
  t.is(isEmptyObject(Symbol()), false)
  t.is(isEmptyObject(new Map()), false)
  t.is(isEmptyObject(new WeakMap()), false)
  t.is(isEmptyObject(new Set()), false)
  t.is(isEmptyObject(new WeakSet()), false)
})

test('isEmptyArray', t => {
  t.is(isEmptyArray([]), true)
  t.is(isEmptyArray(new Array()), true)
  t.is(isEmptyArray(new Array(0)), true)

  t.is(isEmptyArray(new Array(1)), false)
  t.is(isEmptyArray([undefined]), false)
  t.is(isEmptyArray(null), false)
  t.is(isEmptyArray(new Date()), false)
  t.is(isEmptyArray(new Error('')), false)
  t.is(isEmptyArray(new Date()), false)
  t.is(isEmptyArray(Symbol()), false)
  t.is(isEmptyArray(new Map()), false)
  t.is(isEmptyArray(new WeakMap()), false)
  t.is(isEmptyArray(new Set()), false)
  t.is(isEmptyArray(new WeakSet()), false)
})

test('isFullArray', t => {
  t.is(isFullArray(new Array(1)), true)
  t.is(isFullArray([undefined]), true)
  t.is(isFullArray([null]), true)
  t.is(isFullArray(['']), true)

  t.is(isFullArray([]), false)
  t.is(isFullArray(new Array()), false)
  t.is(isFullArray(new Array(0)), false)

  t.is(isFullArray(null), false)
  t.is(isFullArray(new Date()), false)
  t.is(isFullArray(new Error('')), false)
  t.is(isFullArray(new Date()), false)
  t.is(isFullArray(Symbol()), false)
  t.is(isFullArray(new Map()), false)
  t.is(isFullArray(new WeakMap()), false)
  t.is(isFullArray(new Set()), false)
  t.is(isFullArray(new WeakSet()), false)
})

test('NaN tests', t => {
  t.is(isNaNValue(NaN), true)
  t.is(isNaNValue(new Error('')), false)
  t.is(isNaNValue(undefined), false)
  t.is(isNaNValue(null), false)
  t.is(isNaNValue(undefined), false)
  t.is(isNaNValue({}), false)
  t.is(isNaNValue(new Object()), false)
  t.is(
    isNaNValue(() => {}),
    false
  )
  t.is(isNaNValue([]), false)
  t.is(isNaNValue(new Array()), false)
  t.is(isNaNValue(''), false)
  t.is(isNaNValue('_'), false)
  t.is(isNaNValue(''), false)
  t.is(isNaNValue(' '), false)
  t.is(isNaNValue(true), false)
  t.is(isNaNValue(false), false)
  t.is(isNaNValue(/./), false)
  t.is(isNaNValue(/./gi), false)
  t.is(isNaNValue(0), false)
  t.is(isNaNValue(1), false)
  t.is(isNaNValue(new Date()), false)
  t.is(isNaNValue(Symbol()), false)
  t.is(isNaNValue(new Map()), false)
  t.is(isNaNValue(new WeakMap()), false)
  t.is(isNaNValue(new Set()), false)
  t.is(isNaNValue(new WeakSet()), false)
  t.is(isNaNValue(new Promise((resolve, reject) => {})), false)
})

test('Primitive tests', t => {
  // true
  t.is(isPrimitive(0), true)
  t.is(isPrimitive(''), true)
  t.is(isPrimitive('str'), true)
  t.is(isPrimitive(Symbol()), true)
  t.is(isPrimitive(true), true)
  t.is(isPrimitive(false), true)
  t.is(isPrimitive(null), true)
  t.is(isPrimitive(undefined), true)
  // false
  t.is(isPrimitive(NaN), false)
  t.is(isPrimitive([]), false)
  t.is(isPrimitive(new Array()), false)
  t.is(isPrimitive({}), false)
  t.is(isPrimitive(new Object()), false)
  t.is(isPrimitive(new Date()), false)
  t.is(
    isPrimitive(() => {}),
    false
  )
})

test('Date exception', t => {
  t.is(isDate(new Date('_')), false)
})

test('Generic isType', t => {
  // -----------------------------
  // This is correct old fashion syntax for classes, if this is missing
  function MyClass () {}
  MyClass.prototype.constructor = MyClass
  // @ts-ignore
  const myClass = new MyClass()
  // -----------------------------
  class MyOtherClass { constructor() {} }
  // this is expected behaviour
  t.is(isType('', String), true)
  t.is(isType('_', String), true)
  t.is(isType('Hello World', String), true)
  t.is(isType(NaN, Number), true)
  t.is(isType(0, Number), true)
  t.is(isType(1, Number), true)
  t.is(isType({}, Object), true)
  t.is(isType(new Object(), Object), true)
  t.is(isType([], Array), true)
  t.is(isType(new Array(), Array), true)
  t.is(
    isType(() => {}, Function),
    true
  )
  t.is(isType(true, Boolean), true)
  t.is(isType(false, Boolean), true)
  t.is(isType(new Date('_'), Date), true)
  t.is(isType(new Date(), Date), true)
  t.is(isType(/./, RegExp), true)
  t.is(isType(/./gi, RegExp), true)
  t.is(isType(myClass, MyClass), true)
  t.is(isType(new MyOtherClass(), MyOtherClass), true)
  t.is(isType(myClass, MyOtherClass), false)
  t.is(isType(Symbol(), Symbol), true)
  // t.is(isType(null, Null), true)
  // t.is(isType(undefined, Undefined), true)
  // It SHOULD fail
  t.is(isType(5, String), false)
  t.is(isType(null, Object), false)
  // Not sure if this would be the expected behaviour but everything is an object
  // so I would say so
  t.is(isType(myClass, Object), true)
})

test('isObject vs isAnyObject', t => {
  // -----------------------------
  // This is correct old fashion syntax for classes, if this is missing
  function MyClass () {}
  MyClass.prototype.constructor = MyClass
  // @ts-ignore
  const myClass = new MyClass()
  // -----------------------------
  class MyClass2 { constructor() {} }
  const myClass2 = new MyClass2()
  const mySpecialObject = {}
  Object.setPrototypeOf(mySpecialObject, {
    toDate: function () {
      return new Date()
    },
  })
  // IS OBJECT
  // plain object
  t.is(isObject({}), true)
  t.is(isObject(new Object()), true)
  t.is(isPlainObject({}), true)
  t.is(isPlainObject(new Object()), true)
  // classes & prototypes
  t.is(isObject(myClass), false)
  t.is(isObject(myClass2), false)
  t.is(isObject(mySpecialObject), false)
  t.is(isPlainObject(myClass), false)
  t.is(isPlainObject(myClass2), false)
  t.is(isPlainObject(mySpecialObject), false)
  // arrays and dates
  t.is(isObject([]), false)
  t.is(isObject(new Array()), false)
  t.is(isObject(new Date('_')), false)
  t.is(isObject(new Date()), false)
  t.is(isPlainObject([]), false)
  t.is(isPlainObject(new Array()), false)
  t.is(isPlainObject(new Date('_')), false)
  t.is(isPlainObject(new Date()), false)
  // IS ANY OBJECT
  // plain object
  t.is(isAnyObject({}), true)
  t.is(isAnyObject(new Object()), true)
  // classes & prototypes
  t.is(isAnyObject(myClass), true)
  t.is(isAnyObject(myClass2), true)
  t.is(isAnyObject(mySpecialObject), true)
  // arrays and dates
  t.is(isAnyObject([]), false)
  t.is(isAnyObject(new Array()), false)
  t.is(isAnyObject(new Date('_')), false)
  t.is(isAnyObject(new Date()), false)
})

test('isOneOf', t => {
  t.is(isOneOf(isString, isNumber)('_'), true)
  t.is(isOneOf(isString, isNumber)(1), true)
  t.is(isOneOf(isString, isNumber)(undefined), false)

  t.is(isOneOf(isString, isNumber, isBoolean)('_'), true)
  t.is(isOneOf(isString, isNumber, isBoolean)(1), true)
  t.is(isOneOf(isString, isNumber, isBoolean)(true), true)
  t.is(isOneOf(isString, isNumber, isBoolean)(undefined), false)

  t.is(isOneOf(isString, isNumber, isBoolean, isArray)('_'), true)
  t.is(isOneOf(isString, isNumber, isBoolean, isArray)(1), true)
  t.is(isOneOf(isString, isNumber, isBoolean, isArray)(true), true)
  t.is(isOneOf(isString, isNumber, isBoolean, isArray)([]), true)
  t.is(isOneOf(isString, isNumber, isBoolean, isArray)(undefined), false)

  t.is(isOneOf(isString, isNumber, isBoolean, isArray, isPlainObject)('_'), true)
  t.is(isOneOf(isString, isNumber, isBoolean, isArray, isPlainObject)(1), true)
  t.is(isOneOf(isString, isNumber, isBoolean, isArray, isPlainObject)(true), true)
  t.is(isOneOf(isString, isNumber, isBoolean, isArray, isPlainObject)([]), true)
  t.is(isOneOf(isString, isNumber, isBoolean, isArray, isPlainObject)({}), true)
  t.is(isOneOf(isString, isNumber, isBoolean, isArray, isPlainObject)(undefined), false)
})

test('type related tests', t => {
  t.pass()
  // const fn: string | ((k: number) => string) = (p) => 'a'
  // if (!isFunction(fn)) {
  //   fn
  // }

  // const a: Record<string, number> = {}

  // a[fn(1)] = fn(2)

  // const myArray: string | string[] = ['a', 'b']
  // if (!isArray(myArray)) {
  //   myArray
  // }

  // const a: Record<string, number> = {}

  // a[myArray[1]] = myArray[0]

  // const myArray: string | any[] = [1, 2, 'a', 'b']
  // if (!isArray(myArray)) {
  //   myArray
  // }

  // const a: Record<string, number> = {}

  // a[myArray[1]] = myArray[0]

})
