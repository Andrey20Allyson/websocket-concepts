import EventEmitter from "events";

type EventNameType = string | symbol;

export type EventDict = {
  [k: EventNameType]: any[];
}

export interface TypedEventEmitter<Events extends EventDict> {
  on<K extends keyof Events>(eventName: K, listener: (...args: Events[K]) => void): this;
  once<K extends keyof Events>(eventName: K, listener: (...args: Events[K]) => void): this;
  emit<K extends keyof Events>(eventName: K, ...args: Events[K]): boolean;
  addListener<K extends keyof Events>(eventName: K, listener: (...args: Events[K]) => void): this;
  removeListener<K extends keyof Events>(eventName: K, listener: (...args: Events[K]) => void): this;
  off<K extends keyof Events>(eventName: K, listener: (...args: Events[K]) => void): this;
  removeAllListeners<K extends keyof Events>(event?: K): this;
  setMaxListeners(n: number): this;
  getMaxListeners(): number;
  listeners<K extends keyof Events>(eventName: K): Function[];
  rawListeners<K extends keyof Events>(eventName: K): Function[];
  listenerCount<K extends keyof Events>(eventName: K): number;
  prependListener<K extends keyof Events>(eventName: K, listener: (...args: Events[K]) => void): this;
  prependOnceListener<K extends keyof Events>(eventName: K, listener: (...args: Events[K]) => void): this;
  eventNames(): Array<keyof EventDict>;
}

export function createTypedEventEmitter<Events extends EventDict = EventDict>() {
  return new EventEmitter() as TypedEventEmitter<Events>;
}