export declare type AnyFunction = (...args: any[]) => any;
export declare type AnyAsyncFunction = (...args: any[]) => Promise<any>;
export declare type AnyClass = new (...args: any[]) => any;
export declare type PlainObject = Record<string | number | symbol, any>;
declare type TypeGuard<A, B extends A> = (payload: A) => payload is B;
/**
 * Returns the object type of the given payload
 *
 * @param {*} payload
 * @returns {string}
 */
export declare function getType(payload: any): string;
/**
 * Returns whether the payload is undefined
 *
 * @param {*} payload
 * @returns {payload is undefined}
 */
export declare function isUndefined(payload: any): payload is undefined;
/**
 * Returns whether the payload is null
 *
 * @param {*} payload
 * @returns {payload is null}
 */
export declare function isNull(payload: any): payload is null;
/**
 * Returns whether the payload is a plain JavaScript object (excluding special classes or objects with other prototypes)
 *
 * @param {*} payload
 * @returns {payload is PlainObject}
 */
export declare function isPlainObject(payload: any): payload is PlainObject;
/**
 * Returns whether the payload is a plain JavaScript object (excluding special classes or objects with other prototypes)
 *
 * @param {*} payload
 * @returns {payload is PlainObject}
 */
export declare function isObject(payload: any): payload is PlainObject;
/**
 * Returns whether the payload is a an empty object (excluding special classes or objects with other prototypes)
 *
 * @param {*} payload
 * @returns {payload is { [K in any]: never }}
 */
export declare function isEmptyObject(payload: any): payload is {
    [K in any]: never;
};
/**
 * Returns whether the payload is a an empty object (excluding special classes or objects with other prototypes)
 *
 * @param {*} payload
 * @returns {payload is PlainObject}
 */
export declare function isFullObject(payload: any): payload is PlainObject;
/**
 * Returns whether the payload is an any kind of object (including special classes or objects with different prototypes)
 *
 * @param {*} payload
 * @returns {payload is PlainObject}
 */
export declare function isAnyObject(payload: any): payload is PlainObject;
/**
 * Returns whether the payload is an object like a type passed in < >
 *
 * Usage: isObjectLike<{id: any}>(payload) // will make sure it's an object and has an `id` prop.
 *
 * @template T this must be passed in < >
 * @param {*} payload
 * @returns {payload is T}
 */
export declare function isObjectLike<T extends PlainObject>(payload: any): payload is T;
/**
 * Returns whether the payload is a function (regular or async)
 *
 * @param {*} payload
 * @returns {payload is AnyFunction}
 */
export declare function isFunction(payload: any): payload is AnyFunction;
/**
 * Returns whether the payload is an array
 *
 * @param {any} payload
 * @returns {payload is any[]}
 */
export declare function isArray(payload: any): payload is any[];
/**
 * Returns whether the payload is a an array with at least 1 item
 *
 * @param {*} payload
 * @returns {payload is any[]}
 */
export declare function isFullArray(payload: any): payload is any[];
/**
 * Returns whether the payload is a an empty array
 *
 * @param {*} payload
 * @returns {payload is []}
 */
export declare function isEmptyArray(payload: any): payload is [];
/**
 * Returns whether the payload is a string
 *
 * @param {*} payload
 * @returns {payload is string}
 */
export declare function isString(payload: any): payload is string;
/**
 * Returns whether the payload is a string, BUT returns false for ''
 *
 * @param {*} payload
 * @returns {payload is string}
 */
export declare function isFullString(payload: any): payload is string;
/**
 * Returns whether the payload is ''
 *
 * @param {*} payload
 * @returns {payload is string}
 */
export declare function isEmptyString(payload: any): payload is string;
/**
 * Returns whether the payload is a number (but not NaN)
 *
 * This will return `false` for `NaN`!!
 *
 * @param {*} payload
 * @returns {payload is number}
 */
export declare function isNumber(payload: any): payload is number;
/**
 * Returns whether the payload is a boolean
 *
 * @param {*} payload
 * @returns {payload is boolean}
 */
export declare function isBoolean(payload: any): payload is boolean;
/**
 * Returns whether the payload is a regular expression (RegExp)
 *
 * @param {*} payload
 * @returns {payload is RegExp}
 */
export declare function isRegExp(payload: any): payload is RegExp;
/**
 * Returns whether the payload is a Map
 *
 * @param {*} payload
 * @returns {payload is Map<any, any>}
 */
export declare function isMap(payload: any): payload is Map<any, any>;
/**
 * Returns whether the payload is a WeakMap
 *
 * @param {*} payload
 * @returns {payload is WeakMap<any, any>}
 */
export declare function isWeakMap(payload: any): payload is WeakMap<any, any>;
/**
 * Returns whether the payload is a Set
 *
 * @param {*} payload
 * @returns {payload is Set<any>}
 */
export declare function isSet(payload: any): payload is Set<any>;
/**
 * Returns whether the payload is a WeakSet
 *
 * @param {*} payload
 * @returns {payload is WeakSet<any>}
 */
export declare function isWeakSet(payload: any): payload is WeakSet<any>;
/**
 * Returns whether the payload is a Symbol
 *
 * @param {*} payload
 * @returns {payload is symbol}
 */
export declare function isSymbol(payload: any): payload is symbol;
/**
 * Returns whether the payload is a Date, and that the date is valid
 *
 * @param {*} payload
 * @returns {payload is Date}
 */
export declare function isDate(payload: any): payload is Date;
/**
 * Returns whether the payload is a Blob
 *
 * @param {*} payload
 * @returns {payload is Blob}
 */
export declare function isBlob(payload: any): payload is Blob;
/**
 * Returns whether the payload is a File
 *
 * @param {*} payload
 * @returns {payload is File}
 */
export declare function isFile(payload: any): payload is File;
/**
 * Returns whether the payload is a Promise
 *
 * @param {*} payload
 * @returns {payload is Promise<any>}
 */
export declare function isPromise(payload: any): payload is Promise<any>;
/**
 * Returns whether the payload is an Error
 *
 * @param {*} payload
 * @returns {payload is Error}
 */
export declare function isError(payload: any): payload is Error;
/**
 * Returns whether the payload is literally the value `NaN` (it's `NaN` and also a `number`)
 *
 * @param {*} payload
 * @returns {payload is typeof NaN}
 */
export declare function isNaNValue(payload: any): payload is typeof NaN;
/**
 * Returns whether the payload is a primitive type (eg. Boolean | Null | Undefined | Number | String | Symbol)
 *
 * @param {*} payload
 * @returns {(payload is boolean | null | undefined | number | string | symbol)}
 */
export declare function isPrimitive(payload: any): payload is boolean | null | undefined | number | string | symbol;
/**
 * Returns true whether the payload is null or undefined
 *
 * @param {*} payload
 * @returns {(payload is null | undefined)}
 */
export declare const isNullOrUndefined: TypeGuard<any, null | undefined>;
export declare function isOneOf<A, B extends A, C extends A>(a: TypeGuard<A, B>, b: TypeGuard<A, C>): TypeGuard<A, B | C>;
export declare function isOneOf<A, B extends A, C extends A, D extends A>(a: TypeGuard<A, B>, b: TypeGuard<A, C>, c: TypeGuard<A, D>): TypeGuard<A, B | C | D>;
export declare function isOneOf<A, B extends A, C extends A, D extends A, E extends A>(a: TypeGuard<A, B>, b: TypeGuard<A, C>, c: TypeGuard<A, D>, d: TypeGuard<A, E>): TypeGuard<A, B | C | D | E>;
export declare function isOneOf<A, B extends A, C extends A, D extends A, E extends A, F extends A>(a: TypeGuard<A, B>, b: TypeGuard<A, C>, c: TypeGuard<A, D>, d: TypeGuard<A, E>, e: TypeGuard<A, F>): TypeGuard<A, B | C | D | E | F>;
/**
 * Does a generic check to check that the given payload is of a given type.
 * In cases like Number, it will return true for NaN as NaN is a Number (thanks javascript!);
 * It will, however, differentiate between object and null
 *
 * @template T
 * @param {*} payload
 * @param {T} type
 * @throws {TypeError} Will throw type error if type is an invalid type
 * @returns {payload is T}
 */
export declare function isType<T extends AnyFunction | AnyClass>(payload: any, type: T): payload is T;
export {};
