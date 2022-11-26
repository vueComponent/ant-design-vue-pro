import {hsvToCmyk, hsvToHex, hsvToHsl, hsvToRgb} from './color';

/**
 * Simple class which holds the properties
 * of the color represention model hsla (hue saturation lightness alpha)
 */
export function HSVaColor(h = 0, s = 0, v = 0, a = 1) {
    const mapper = (original, next) => (precision = -1) => {
        return next(~precision ? original.map(v => Number(v.toFixed(precision))) : original);
    };

    const that = {
        h, s, v, a,

        toHSVA() {
            const hsva = [that.h, that.s, that.v, that.a];
            hsva.toString = mapper(hsva, arr => `hsva(${arr[0]}, ${arr[1]}%, ${arr[2]}%, ${that.a})`);
            return hsva;
        },

        toHSLA() {
            const hsla = [...hsvToHsl(that.h, that.s, that.v), that.a];
            hsla.toString = mapper(hsla, arr => `hsla(${arr[0]}, ${arr[1]}%, ${arr[2]}%, ${that.a})`);
            return hsla;
        },

        toRGBA() {
            const rgba = [...hsvToRgb(that.h, that.s, that.v), that.a];
            rgba.toString = mapper(rgba, arr => `rgba(${arr[0]}, ${arr[1]}, ${arr[2]}, ${that.a})`);
            return rgba;
        },

        toCMYK() {
            const cmyk = hsvToCmyk(that.h, that.s, that.v);
            cmyk.toString = mapper(cmyk, arr => `cmyk(${arr[0]}%, ${arr[1]}%, ${arr[2]}%, ${arr[3]}%)`);
            return cmyk;
        },

        toHEXA() {
            const hex = hsvToHex(that.h, that.s, that.v);

            // Check if alpha channel make sense, convert it to 255 number space, convert
            // To hex and pad it with zeros if needet.
            const alpha = that.a >= 1 ? '' : Number((that.a * 255).toFixed(0))
                .toString(16)
                .toUpperCase().padStart(2, '0');

            alpha && hex.push(alpha);
            hex.toString = () => `#${hex.join('').toUpperCase()}`;
            return hex;
        },

        clone: () => HSVaColor(that.h, that.s, that.v, that.a)
    };

    return that;
}
