// Shorthands
const {min, max, floor, round} = Math;

/**
 * Tries to convert a color name to rgb/a hex representation
 * @param name
 * @returns {string | CanvasGradient | CanvasPattern}
 */
function standardizeColor(name) {

    // Since invalid color's will be parsed as black, filter them out
    if (name.toLowerCase() === 'black') {
        return '#000';
    }

    const ctx = document.createElement('canvas').getContext('2d');
    ctx.fillStyle = name;
    return ctx.fillStyle === '#000' ? null : ctx.fillStyle;
}

/**
 * Convert HSV spectrum to RGB.
 * @param h Hue
 * @param s Saturation
 * @param v Value
 * @returns {number[]} Array with rgb values.
 */
export function hsvToRgb(h, s, v) {
    h = (h / 360) * 6;
    s /= 100;
    v /= 100;

    const i = floor(h);

    const f = h - i;
    const p = v * (1 - s);
    const q = v * (1 - f * s);
    const t = v * (1 - (1 - f) * s);

    const mod = i % 6;
    const r = [v, q, p, p, t, v][mod];
    const g = [t, v, v, q, p, p][mod];
    const b = [p, p, t, v, v, q][mod];

    return [
        r * 255,
        g * 255,
        b * 255
    ];
}

/**
 * Convert HSV spectrum to Hex.
 * @param h Hue
 * @param s Saturation
 * @param v Value
 * @returns {string[]} Hex values
 */
export function hsvToHex(h, s, v) {
    return hsvToRgb(h, s, v).map(v =>
        round(v).toString(16).padStart(2, '0')
    );
}

/**
 * Convert HSV spectrum to CMYK.
 * @param h Hue
 * @param s Saturation
 * @param v Value
 * @returns {number[]} CMYK values
 */
export function hsvToCmyk(h, s, v) {
    const rgb = hsvToRgb(h, s, v);
    const r = rgb[0] / 255;
    const g = rgb[1] / 255;
    const b = rgb[2] / 255;

    const k = min(1 - r, 1 - g, 1 - b);
    const c = k === 1 ? 0 : (1 - r - k) / (1 - k);
    const m = k === 1 ? 0 : (1 - g - k) / (1 - k);
    const y = k === 1 ? 0 : (1 - b - k) / (1 - k);

    return [
        c * 100,
        m * 100,
        y * 100,
        k * 100
    ];
}

/**
 * Convert HSV spectrum to HSL.
 * @param h Hue
 * @param s Saturation
 * @param v Value
 * @returns {number[]} HSL values
 */
export function hsvToHsl(h, s, v) {
    s /= 100;
    v /= 100;

    const l = (2 - s) * v / 2;

    if (l !== 0) {
        if (l === 1) {
            s = 0;
        } else if (l < 0.5) {
            s = s * v / (l * 2);
        } else {
            s = s * v / (2 - l * 2);
        }
    }

    return [
        h,
        s * 100,
        l * 100
    ];
}

/**
 * Convert RGB to HSV.
 * @param r Red
 * @param g Green
 * @param b Blue
 * @return {number[]} HSV values.
 */
function rgbToHsv(r, g, b) {
    r /= 255;
    g /= 255;
    b /= 255;

    const minVal = min(r, g, b);
    const maxVal = max(r, g, b);
    const delta = maxVal - minVal;

    let h, s;
    const v = maxVal;
    if (delta === 0) {
        h = s = 0;
    } else {
        s = delta / maxVal;
        const dr = (((maxVal - r) / 6) + (delta / 2)) / delta;
        const dg = (((maxVal - g) / 6) + (delta / 2)) / delta;
        const db = (((maxVal - b) / 6) + (delta / 2)) / delta;

        if (r === maxVal) {
            h = db - dg;
        } else if (g === maxVal) {
            h = (1 / 3) + dr - db;
        } else if (b === maxVal) {
            h = (2 / 3) + dg - dr;
        }

        if (h < 0) {
            h += 1;
        } else if (h > 1) {
            h -= 1;
        }
    }

    return [
        h * 360,
        s * 100,
        v * 100
    ];
}

/**
 * Convert CMYK to HSV.
 * @param c Cyan
 * @param m Magenta
 * @param y Yellow
 * @param k Key (Black)
 * @return {number[]} HSV values.
 */
function cmykToHsv(c, m, y, k) {
    c /= 100;
    m /= 100;
    y /= 100;
    k /= 100;

    const r = (1 - min(1, c * (1 - k) + k)) * 255;
    const g = (1 - min(1, m * (1 - k) + k)) * 255;
    const b = (1 - min(1, y * (1 - k) + k)) * 255;

    return [...rgbToHsv(r, g, b)];
}

/**
 * Convert HSL to HSV.
 * @param h Hue
 * @param s Saturation
 * @param l Lightness
 * @return {number[]} HSV values.
 */
function hslToHsv(h, s, l) {
    s /= 100;
    l /= 100;
    s *= l < 0.5 ? l : 1 - l;

    const ns = (2 * s / (l + s)) * 100;
    const v = (l + s) * 100;
    return [h, isNaN(ns) ? 0 : ns, v];
}

/**
 * Convert HEX to HSV.
 * @param hex Hexadecimal string of rgb colors, can have length 3 or 6.
 * @return {number[]} HSV values.
 */
function hexToHsv(hex) {
    return rgbToHsv(...hex.match(/.{2}/g).map(v => parseInt(v, 16)));
}

/**
 * Try's to parse a string which represents a color to a HSV array.
 * Current supported types are cmyk, rgba, hsla and hexadecimal.
 * @param str
 * @return {*}
 */
export function parseToHSVA(str) {

    // Check if string is a color-name
    str = str.match(/^[a-zA-Z]+$/) ? standardizeColor(str) : str;

    // Regular expressions to match different types of color represention
    const regex = {
        cmyk: /^cmyk[\D]+([\d.]+)[\D]+([\d.]+)[\D]+([\d.]+)[\D]+([\d.]+)/i,
        rgba: /^((rgba)|rgb)[\D]+([\d.]+)[\D]+([\d.]+)[\D]+([\d.]+)[\D]*?([\d.]+|$)/i,
        hsla: /^((hsla)|hsl)[\D]+([\d.]+)[\D]+([\d.]+)[\D]+([\d.]+)[\D]*?([\d.]+|$)/i,
        hsva: /^((hsva)|hsv)[\D]+([\d.]+)[\D]+([\d.]+)[\D]+([\d.]+)[\D]*?([\d.]+|$)/i,
        hexa: /^#?(([\dA-Fa-f]{3,4})|([\dA-Fa-f]{6})|([\dA-Fa-f]{8}))$/i
    };

    /**
     * Takes an Array of any type, convert strings which represents
     * a number to a number an anything else to undefined.
     * @param array
     * @return {*}
     */
    const numarize = array => array.map(v => /^(|\d+)\.\d+|\d+$/.test(v) ? Number(v) : undefined);

    let match;
    invalid: for (const type in regex) {

        // Check if current scheme passed
        if (!(match = regex[type].exec(str))) {
            continue;
        }

        // Match[2] does only contain a truly value if rgba, hsla, or hsla got matched
        const alphaValid = a => (!!match[2] === (typeof a === 'number'));

        // Try to convert
        switch (type) {
            case 'cmyk': {
                const [, c, m, y, k] = numarize(match);

                if (c > 100 || m > 100 || y > 100 || k > 100) {
                    break invalid;
                }

                return {values: cmykToHsv(c, m, y, k), type};
            }
            case 'rgba': {
                const [, , , r, g, b, a] = numarize(match);

                if (r > 255 || g > 255 || b > 255 || a < 0 || a > 1 || !alphaValid(a)) {
                    break invalid;
                }

                return {values: [...rgbToHsv(r, g, b), a], a, type};
            }
            case 'hexa': {
                let [, hex] = match;

                if (hex.length === 4 || hex.length === 3) {
                    hex = hex.split('').map(v => v + v).join('');
                }

                const raw = hex.substring(0, 6);
                let a = hex.substring(6);

                // Convert 0 - 255 to 0 - 1 for opacity
                a = a ? (parseInt(a, 16) / 255) : undefined;

                return {values: [...hexToHsv(raw), a], a, type};
            }
            case 'hsla': {
                const [, , , h, s, l, a] = numarize(match);

                if (h > 360 || s > 100 || l > 100 || a < 0 || a > 1 || !alphaValid(a)) {
                    break invalid;
                }

                return {values: [...hslToHsv(h, s, l), a], a, type};
            }
            case 'hsva': {
                const [, , , h, s, v, a] = numarize(match);

                if (h > 360 || s > 100 || v > 100 || a < 0 || a > 1 || !alphaValid(a)) {
                    break invalid;
                }

                return {values: [h, s, v, a], a, type};
            }
        }
    }

    return {values: null, type: null};
}
