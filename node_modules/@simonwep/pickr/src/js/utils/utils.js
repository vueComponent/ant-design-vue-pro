/* eslint-disable prefer-rest-params */
function eventListener(method, elements, events, fn, options = {}) {

    // Normalize array
    if (elements instanceof HTMLCollection || elements instanceof NodeList) {
        elements = Array.from(elements);
    } else if (!Array.isArray(elements)) {
        elements = [elements];
    }

    if (!Array.isArray(events)) {
        events = [events];
    }

    for (const el of elements) {
        for (const ev of events) {
            el[method](ev, fn, {capture: false, ...options});
        }
    }

    return Array.prototype.slice.call(arguments, 1);
}

/**
 * Add event(s) to element(s).
 * @param elements DOM-Elements
 * @param events Event names
 * @param fn Callback
 * @param options Optional options
 * @return Array passed arguments
 */
export const on = eventListener.bind(null, 'addEventListener');

/**
 * Remove event(s) from element(s).
 * @param elements DOM-Elements
 * @param events Event names
 * @param fn Callback
 * @param options Optional options
 * @return Array passed arguments
 */
export const off = eventListener.bind(null, 'removeEventListener');

/**
 * Creates an DOM-Element out of a string (Single element).
 * @param html HTML representing a single element
 * @returns {Element | null} The element.
 */
export function createElementFromString(html) {
    const div = document.createElement('div');
    div.innerHTML = html.trim();
    return div.firstElementChild;
}

/**
 * Creates a new html element, every element which has
 * a ':ref' attribute will be saved in a object (which will be returned)
 * where the value of ':ref' is the object-key and the value the HTMLElement.
 *
 * It's possible to create a hierarchy if you add a ':obj' attribute. Every
 * sibling will be added to the object which will get the name from the 'data-con' attribute.
 *
 * If you want to create an Array out of multiple elements, you can use the ':arr' attribute,
 * the value defines the key and all elements, which has the same parent and the same 'data-arr' attribute,
 * would be added to it.
 *
 * @param str - The HTML String.
 */

export function createFromTemplate(str) {

    // Removes an attribute from a HTMLElement and returns the value.
    const removeAttribute = (el, name) => {
        const value = el.getAttribute(name);
        el.removeAttribute(name);
        return value;
    };

    // Recursive function to resolve template
    const resolve = (element, base = {}) => {

        // Check key and container attribute
        const con = removeAttribute(element, ':obj');
        const key = removeAttribute(element, ':ref');
        const subtree = con ? (base[con] = {}) : base;

        // Check and save element
        key && (base[key] = element);
        for (const child of Array.from(element.children)) {
            const arr = removeAttribute(child, ':arr');
            const sub = resolve(child, arr ? {} : subtree);

            if (arr) {

                // Check if there is already an array and add element
                (subtree[arr] || (subtree[arr] = []))
                    .push(Object.keys(sub).length ? sub : child);
            }
        }

        return base;
    };

    return resolve(createElementFromString(str));
}

/**
 * Polyfill for safari & firefox for the eventPath event property.
 * @param evt The event object.
 * @return [String] event path.
 */
export function eventPath(evt) {
    let path = evt.path || (evt.composedPath && evt.composedPath());
    if (path) {
        return path;
    }

    let el = evt.target.parentElement;
    path = [evt.target, el];
    while (el = el.parentElement) {
        path.push(el);
    }

    path.push(document, window);
    return path;
}

/**
 * Resolves a HTMLElement by query.
 * @param val
 * @returns {null|Document|Element}
 */
export function resolveElement(val) {
    if (val instanceof Element) {
        return val;
    } else if (typeof val === 'string') {
        return val.split(/>>/g).reduce((pv, cv, ci, a) => {
            pv = pv.querySelector(cv);
            return ci < a.length - 1 ? pv.shadowRoot : pv;
        }, document);
    }

    return null;
}

/**
 * Creates the ability to change numbers in an input field with the scroll-wheel.
 * @param el
 * @param mapper
 */
export function adjustableInputNumbers(el, mapper = v => v) {

    function handleScroll(e) {
        const inc = ([0.001, 0.01, 0.1])[Number(e.shiftKey || e.ctrlKey * 2)] * (e.deltaY < 0 ? 1 : -1);

        let index = 0;
        let off = el.selectionStart;
        el.value = el.value.replace(/[\d.]+/g, (v, i) => {

            // Check if number is in cursor range and increase it
            if (i <= off && i + v.length >= off) {
                off = i;
                return mapper(Number(v), inc, index);
            }

            index++;
            return v;
        });

        el.focus();
        el.setSelectionRange(off, off);

        // Prevent default and trigger input event
        e.preventDefault();
        el.dispatchEvent(new Event('input'));
    }

    // Bind events
    on(el, 'focus', () => on(window, 'wheel', handleScroll, {passive: false}));
    on(el, 'blur', () => off(window, 'wheel', handleScroll));
}
