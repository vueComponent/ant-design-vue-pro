export as namespace EventEmitter;

type ListenerFn = (...args: Array<any>) => void;

/**
 * Minimal `EventEmitter` interface that is molded against the Node.js
 * `EventEmitter` interface.
 */
export class EventEmitter {
  static prefixed: string | boolean;

  /**
   * Return an array listing the events for which the emitter has registered
   * listeners.
   */
  eventNames(): Array<string | symbol>;

  /**
   * Return the listeners registered for a given event.
   */
  listeners(event: string | symbol, exists: boolean): Array<ListenerFn> | boolean;
  listeners(event: string | symbol): Array<ListenerFn>;

  /**
   * Calls each of the listeners registered for a given event.
   */
  emit(event: string | symbol, ...args: Array<any>): boolean;

  /**
   * Add a listener for a given event.
   */
  on(event: string | symbol, fn: ListenerFn, context?: any): this;
  addListener(event: string | symbol, fn: ListenerFn, context?: any): this;

  /**
   * Add a one-time listener for a given event.
   */
  once(event: string | symbol, fn: ListenerFn, context?: any): this;

  /**
   * Remove the listeners of a given event.
   */
  removeListener(event: string | symbol, fn?: ListenerFn, context?: any, once?: boolean): this;
  off(event: string | symbol, fn?: ListenerFn, context?: any, once?: boolean): this;

  /**
   * Remove all listeners, or those of the specified event.
   */
  removeAllListeners(event?: string | symbol): this;
}
