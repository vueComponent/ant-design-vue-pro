import Attributor from './attributor';
declare class StyleAttributor extends Attributor {
    static keys(node: Element): string[];
    add(node: HTMLElement, value: string): boolean;
    remove(node: HTMLElement): void;
    value(node: HTMLElement): string;
}
export default StyleAttributor;
