type Direction = 'top' | 'left' | 'bottom' | 'right';
type Alignment = 'start' | 'middle' | 'end';

export type VariantFlipOrder = {
    start: string;
    middle: string;
    end: string;
};

export type PositionFlipOrder = {
    top: string;
    right: string;
    bottom: string;
    left: string;
};

export type NanoPopPosition = `${Direction}-${Alignment}` | Direction;

export type NanoPopOptions = {
    container: DOMRect;
    position: NanoPopPosition;
    variantFlipOrder: VariantFlipOrder;
    positionFlipOrder: PositionFlipOrder;
    margin: number;
    reference?: HTMLElement;
    popper?: HTMLElement;
    padding?: number;
};

type AvailablePositions = {
    t: number;
    b: number;
    l: number;
    r: number;
};

type AvailableVariants = {
    vs: number;
    vm: number;
    ve: number;
    hs: number;
    hm: number;
    he: number;
};

type PositionPairs = [Direction, Direction];

export type PositionMatch = 'ts' | 'tm' | 'te' | 'bs' | 'bm' | 'be' | 'ls' | 'lm' | 'le' | 'rs' | 'rm' | 're';

export interface NanoPop {
    update(updatedOptions?: Partial<NanoPopOptions>): PositionMatch | null;
}

export interface NanoPopConstructor {

    /**
     * @param reference Reference element
     * @param popper Actual popper element
     * @param options Optional options
     */
    (reference: HTMLElement, popper: HTMLElement, options?: Partial<NanoPopOptions>): NanoPop;

    /**
     * @param options Partial options which get merged with the current one
     */
    (options?: Partial<NanoPopOptions>): NanoPop;
}

// Export current version
export const version = VERSION;

// Export default
export const defaults = {
    variantFlipOrder: {start: 'sme', middle: 'mse', end: 'ems'},
    positionFlipOrder: {top: 'tbrl', right: 'rltb', bottom: 'btrl', left: 'lrbt'},
    position: 'bottom',
    margin: 8,
    padding: 0
};

/**
 * Repositions an element once using the provided options and elements.
 * @param reference Reference element
 * @param popper Popper element
 * @param opt Optional, additional options
 */
export const reposition = (
    reference: HTMLElement,
    popper: HTMLElement,
    opt?: Partial<NanoPopOptions>
): PositionMatch | null => {
    const {
        container,
        margin,
        padding,
        position,
        variantFlipOrder,
        positionFlipOrder
    } = {
        container: document.documentElement.getBoundingClientRect(),
        ...defaults,
        ...opt
    };

    /**
     * Reset position to resolve viewport
     * See https://developer.mozilla.org/en-US/docs/Web/CSS/position#fixed
     */
    const {left: originalLeft, top: originalTop} = popper.style;
    popper.style.left = '0';
    popper.style.top = '0';

    const refBox = reference.getBoundingClientRect();
    const popBox = popper.getBoundingClientRect();

    /**
     * Holds coordinates of top, left, bottom and right alignment
     */
    const positionStore: AvailablePositions = {
        t: refBox.top - popBox.height - margin,
        b: refBox.bottom + margin,
        r: refBox.right + margin,
        l: refBox.left - popBox.width - margin
    };

    /**
     * Holds corresponding variants (start, middle, end).
     * The values depend on horizontal / vertical orientation
     */
    const variantStore: AvailableVariants = {
        vs: refBox.left,
        vm: refBox.left + refBox.width / 2 + -popBox.width / 2,
        ve: refBox.left + refBox.width - popBox.width,
        hs: refBox.top,
        hm: refBox.bottom - refBox.height / 2 - popBox.height / 2,
        he: refBox.bottom - popBox.height
    };

    // Extract position and variant
    // Top-start -> top is "position" and "start" is the variant
    const [posKey, varKey = 'middle'] = position.split('-');
    const positions = positionFlipOrder[posKey as keyof PositionFlipOrder];
    const variants = variantFlipOrder[varKey as keyof VariantFlipOrder];

    // Try out all possible combinations, starting with the preferred one.
    const {top, left, bottom, right} = container;

    for (const p of positions) {
        const vertical = (p === 't' || p === 'b');

        // The position-value
        const positionVal = positionStore[p as keyof AvailablePositions];

        // Which property has to be changes.
        const [positionKey, variantKey] = (vertical ? ['top', 'left'] : ['left', 'top']) as PositionPairs;

        /**
         * box refers to the size of the popper element. Depending on the orientation this is width or height.
         * The limit is the corresponding, maximum value for this position.
         */
        const [positionSize, variantSize] = vertical ? [popBox.height, popBox.width] : [popBox.width, popBox.height];

        const [positionMaximum, variantMaximum] = vertical ? [bottom, right] : [right, bottom];
        const [positionMinimum, variantMinimum] = vertical ? [top, left] : [left, top];

        // Skip pre-clipped values
        if (positionVal < positionMinimum || (positionVal + positionSize + padding) > positionMaximum) {
            continue;
        }

        for (const v of variants) {

            // The position-value, the related size value of the popper and the limit
            const variantVal = variantStore[((vertical ? 'v' : 'h') + v) as keyof AvailableVariants];

            if (variantVal < variantMinimum || (variantVal + variantSize + padding) > variantMaximum) {
                continue;
            }

            // Apply styles and normalize viewport
            popper.style[variantKey] = `${variantVal - popBox[variantKey]}px`;
            popper.style[positionKey] = `${positionVal - popBox[positionKey]}px`;
            return (p + v) as PositionMatch;
        }
    }

    // Revert style values (won't work with styled-elements or similar systems)
    // "Fix" for https://github.com/Simonwep/nanopop/issues/7
    popper.style.left = originalLeft;
    popper.style.top = originalTop;

    return null;
};

/**
 * Creates a stateful popper.
 * You can either...
 * ... pass an options object: createPopper(<options>)
 * ... pass both the reference and popper: create(<ref>, <el>, <?options>)
 * ... pass nothing, in this case you'll have to set at least both a reference and a popper in update.
 *
 * @param reference | options Reference element or options
 * @param popper Popper element
 * @param options Optional additional options
 */
export const createPopper: NanoPopConstructor = (
    reference?: HTMLElement | Partial<NanoPopOptions>,
    popper?: HTMLElement,
    options?: Partial<NanoPopOptions>
): NanoPop => {

    // Resolve options
    const baseOptions: Partial<NanoPopOptions> = typeof reference === 'object' && !(reference instanceof HTMLElement) ?
        reference : {reference, popper, ...options};

    return {

        /**
         * Repositions the current popper.
         * @param options Optional options which get merged with the current ones.
         */
        update(options: Partial<NanoPopOptions> = baseOptions): PositionMatch | null {
            const {reference, popper} = Object.assign(baseOptions, options);

            if (!popper || !reference) {
                throw new Error('Popper- or reference-element missing.');
            }

            return reposition(reference, popper, baseOptions);
        }
    };
};
