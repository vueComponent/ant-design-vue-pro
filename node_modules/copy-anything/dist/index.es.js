import { isArray, isPlainObject } from 'is-what';

function assignProp(carry, key, newVal, originalObject, includeNonenumerable) {
    const propType = {}.propertyIsEnumerable.call(originalObject, key)
        ? 'enumerable'
        : 'nonenumerable';
    if (propType === 'enumerable')
        carry[key] = newVal;
    if (includeNonenumerable && propType === 'nonenumerable') {
        Object.defineProperty(carry, key, {
            value: newVal,
            enumerable: false,
            writable: true,
            configurable: true,
        });
    }
}
/**
 * Copy (clone) an object and all its props recursively to get rid of any prop referenced of the original object. Arrays are also cloned, however objects inside arrays are still linked.
 *
 * @export
 * @template T
 * @param {T} target Target can be anything
 * @param {Options} [options = {}] Options can be `props` or `nonenumerable`
 * @returns {T} the target with replaced values
 * @export
 */
function copy(target, options = {}) {
    if (isArray(target)) {
        return target.map((item) => copy(item, options));
    }
    if (!isPlainObject(target)) {
        return target;
    }
    const props = Object.getOwnPropertyNames(target);
    const symbols = Object.getOwnPropertySymbols(target);
    return [...props, ...symbols].reduce((carry, key) => {
        if (isArray(options.props) && !options.props.includes(key)) {
            return carry;
        }
        const val = target[key];
        const newVal = copy(val, options);
        assignProp(carry, key, newVal, target, options.nonenumerable);
        return carry;
    }, {});
}

export { copy };
