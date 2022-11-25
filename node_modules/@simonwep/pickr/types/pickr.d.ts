declare class Pickr {

    static version: string; // Current version
    static utils: any; // See docs
    static libs: any;  // See docs

    constructor(options: Pickr.Options);

    static create(options: Pickr.Options): Pickr;

    setHSVA(h?: number, s?: number, v?: number, a?: number, silent?: boolean): boolean

    setColor(str: string | null, silent?: boolean): boolean;

    on(event: Pickr.EventType, cb: Function): Pickr;

    off(event: Pickr.EventType, cb: Function): Pickr;

    show(): Pickr;

    hide(): Pickr;

    disable(): Pickr;

    enable(): Pickr;

    isOpen(): boolean;

    getRoot(): object;

    getColor(): Pickr.HSVaColor;

    getSelectedColor(): Pickr.HSVaColor;

    destroy(): void;

    destroyAndRemove(): void;

    setColorRepresentation(type: Pickr.Representation): boolean;

    getColorRepresentation(): Pickr.Representation;

    applyColor(silent?: boolean): Pickr;

    addSwatch(color: string): boolean;

    removeSwatch(index: number): boolean;
}

declare namespace Pickr {

    interface Options {
        el: string | HTMLElement;
        container?: string | HTMLElement;
        theme?: Theme;
        closeOnScroll?: boolean;
        appClass?: string;
        useAsButton?: boolean;
        padding?: number;
        inline?: boolean;
        autoReposition?: boolean;
        sliders?: Slider;
        disabled?: boolean;
        lockOpacity?: boolean;
        outputPrecision?: number;
        comparison?: boolean;
        default?: string;
        swatches?: Array<string> | null;
        defaultRepresentation?: Representation;
        showAlways?: boolean;
        closeWithKey?: string;
        position?: Position;
        adjustableNumbers?: boolean;

        components?: {
            palette?: boolean;
            preview?: boolean;
            opacity?: boolean;
            hue?: boolean;

            interaction?: {
                hex?: boolean;
                rgba?: boolean;
                hsla?: boolean;
                hsva?: boolean;
                cmyk?: boolean;
                input?: boolean;
                cancel?: boolean;
                clear?: boolean;
                save?: boolean;
            };
        };

        strings?: {
            save?: string;
            clear?: string;
            cancel?: string;
        }
    }

    interface RoundableNumberArray extends Omit<Array<number>, 'toString'> {

        /**
         * Uses Number.toFixed to truncate each value to the n-th decimal place.
         * @param precision Optional precision / decimal place at which point it should be truncated.
         */
        toString(precision?: number): string;
    }

    interface HSVaColor {
        toHSVA(): RoundableNumberArray;

        toHSLA(): RoundableNumberArray;

        toRGBA(): RoundableNumberArray;

        toCMYK(): RoundableNumberArray;

        toHEXA(): RoundableNumberArray;

        clone(): HSVaColor;
    }

    type EventType =
        'init' |
        'hide' |
        'show' |
        'save' |
        'clear' |
        'change' |
        'changestop' |
        'cancel' |
        'swatchselect';

    type Theme = 'classic' | 'monolith' | 'nano';

    type Position =
        'top-start' |
        'top-middle' |
        'top-end' |
        'right-start' |
        'right-middle' |
        'right-end' |
        'bottom-start' |
        'bottom-middle' |
        'bottom-end' |
        'left-start' |
        'left-middle' |
        'left-end';

    type Representation =
        'HEXA' |
        'RGBA' |
        'HSVA' |
        'HSLA' |
        'CMYK';

    type Slider = 'v' | 'h';
}

export default Pickr;
