import Attributor from './attributor';
declare class ClassAttributor extends Attributor {
    static keys(node: HTMLElement): string[];
    add(node: HTMLElement, value: string): boolean;
    remove(node: HTMLElement): void;
    value(node: HTMLElement): string;
}
export default ClassAttributor;
