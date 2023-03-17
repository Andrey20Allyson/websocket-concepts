import EventEmitter from 'events';
import { deserializeEvent, serializeEvent } from './serialization/event';
import { DataTransfer } from './transference';

export interface Socket {
  on(eventName: string, listener: (...args: any[]) => void): void;
  on(eventName: 'connect', listener: () => void): void;
  on(eventName: 'disconnect', listener: () => void): void;
  emit(eventName: string, ...args: any[]): void;
  end(): void;
}

export const SOCKET_CONNECTION_EVENT = 'connect';
export const SOCKET_DISCONNECTION_EVENT = 'disconnect';

export const EVENT_EMITTION = Symbol()
export const SOCKET_DISCONNECTION = Symbol();

export async function createSocket() {
  const reciver = new EventEmitter();
  const emmiter = new EventEmitter();

  const socket: Socket = {
    on(eventName: string, listener: (...args: any[]) => void) {
      reciver.on(eventName, listener);
    },

    emit(eventName: string, ...args: any[]) {
      emmiter.emit(EVENT_EMITTION, eventName, args);
    },

    end() {
      emmiter.emit(SOCKET_DISCONNECTION);
      reciver.emit(SOCKET_DISCONNECTION_EVENT);

      reciver.removeAllListeners();
      emmiter.removeAllListeners();
    }
  };

  const transfer = new DataTransfer();

  await transfer.init('socket');

  transfer.onData(data => {
    const result = deserializeEvent(data);

    if (result.success) {
      const { eventName, args } = result.data;

      reciver.emit(eventName, ...args);
    } else {
      console.warn(result.error);
    }
  });

  emmiter.on(EVENT_EMITTION, (eventName: string, args: any[]) => {
    const result = serializeEvent({ eventName, args });

    if (result.success) {
      transfer.send(result.data);
    } else {
      console.warn(result.error);
    }
  });

  emmiter.on(SOCKET_DISCONNECTION, () => {
    transfer.close();
  });

  return socket;
}

