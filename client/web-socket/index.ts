import { deserializeEvent, serializeEvent } from './serialization/event';
import { DataTransfer } from './transference';
import { createTypedEventEmitter } from './util/typed-events';

export interface Socket {
  on(eventName: string, listener: (...args: any[]) => void): void;
  on(eventName: typeof SOCKET_CONNECTION_EVENT, listener: () => void): void;
  on(eventName: typeof SOCKET_DISCONNECTION_EVENT, listener: () => void): void;
  emit(eventName: string, ...args: any[]): void;
  end(): void;
}

export const SOCKET_CONNECTION_EVENT = 'connect';
export const SOCKET_DISCONNECTION_EVENT = 'disconnect';

export type InternalSocketEvents = {
  'event-emittion': [eventName: string, args: any[]];
  'socket-disconnection': [];
}

export async function createSocket() {
  const listeners = createTypedEventEmitter();
  const emitter = createTypedEventEmitter<InternalSocketEvents>();

  const socket: Socket = {
    on(eventName: string, listener: (...args: any[]) => void) {
      listeners.on(eventName, listener);
    },

    emit(eventName: string, ...args: any[]) {
      emitter.emit('event-emittion', eventName, args);
    },

    end() {
      listeners.emit(SOCKET_DISCONNECTION_EVENT);
      emitter.emit('socket-disconnection');

      listeners.removeAllListeners();
      emitter.removeAllListeners();
    }
  };

  const transfer = new DataTransfer();

  await transfer.init('socket');

  transfer.onData(data => {
    const result = deserializeEvent(data);

    if (result.success) {
      const { eventName, args } = result.data;

      listeners.emit(eventName, ...args);
    } else {
      console.warn(result.error);
    }
  });

  emitter.on('event-emittion', (eventName, args) => {
    const result = serializeEvent({ eventName, args });

    if (result.success) {
      transfer.send(result.data);
    } else {
      console.warn(result.error);
    }
  });

  emitter.on('socket-disconnection', () => {
    transfer.close();
  });

  return socket;
}