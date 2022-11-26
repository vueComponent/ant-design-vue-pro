import Attributor from './attributor';
import { Formattable } from '../blot/abstract/blot';
declare class AttributorStore {
    private attributes;
    private domNode;
    constructor(domNode: HTMLElement);
    attribute(attribute: Attributor, value: any): void;
    build(): void;
    copy(target: Formattable): void;
    move(target: Formattable): void;
    values(): {
        [key: string]: any;
    };
}
export default AttributorStore;
