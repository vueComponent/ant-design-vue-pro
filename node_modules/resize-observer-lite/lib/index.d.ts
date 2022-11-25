export default class ResizeObserverLite {
    private handler;
    private hasResizeObserver;
    private erd?;
    private listenedElement;
    private rz?;
    constructor(handler: ResizeObserverLiteEntriesHandler);
    observe(element: Element): void;
    disconnect(): void;
}
export interface ResizeObserverLiteEntriesHandler {
    (size: ResizeObserverSize): void;
}
export interface ResizeObserverSize {
    width: number;
    height: number;
}
