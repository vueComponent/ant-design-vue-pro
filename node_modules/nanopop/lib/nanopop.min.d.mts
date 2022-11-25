type Direction = 'top' | 'left' | 'bottom' | 'right';
type Alignment = 'start' | 'middle' | 'end';
type VariantFlipOrder = {
    start: string;
    middle: string;
    end: string;
};
type PositionFlipOrder = {
    top: string;
    right: string;
    bottom: string;
    left: string;
};
type NanoPopPosition = `${Direction}-${Alignment}` | Direction;
type NanoPopOptions = {
    container: DOMRect;
    position: NanoPopPosition;
    variantFlipOrder: VariantFlipOrder;
    positionFlipOrder: PositionFlipOrder;
    margin: number;
    reference?: HTMLElement;
    popper?: HTMLElement;
    padding?: number;
};
type PositionMatch = 'ts' | 'tm' | 'te' | 'bs' | 'bm' | 'be' | 'ls' | 'lm' | 'le' | 'rs' | 'rm' | 're';
interface NanoPop {
    update(updatedOptions?: Partial<NanoPopOptions>): PositionMatch | null;
}
interface NanoPopConstructor {
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
declare const version: string;
declare const defaults: {
    variantFlipOrder: {
        start: string;
        middle: string;
        end: string;
    };
    positionFlipOrder: {
        top: string;
        right: string;
        bottom: string;
        left: string;
    };
    position: string;
    margin: number;
    padding: number;
};
/**
 * Repositions an element once using the provided options and elements.
 * @param reference Reference element
 * @param popper Popper element
 * @param opt Optional, additional options
 */
declare const reposition: (reference: HTMLElement, popper: HTMLElement, opt?: Partial<NanoPopOptions>) => PositionMatch | null;
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
declare const createPopper: NanoPopConstructor;
export { VariantFlipOrder, PositionFlipOrder, NanoPopPosition, NanoPopOptions, PositionMatch, NanoPop, NanoPopConstructor, version, defaults, reposition, createPopper };
