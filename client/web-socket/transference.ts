import EventEmitter from "events";
import { EventDict, createTypedEventEmitter, TypedEventEmitter } from "./typed-events";

export type DataEmitterController = ReadableStreamDefaultController<string>;
export type DataReciverReader = ReadableStreamDefaultReader<string>;

export class DataTransfer {
  private _reciver: DataReciver;
  private _emitter: DataEmitter;
  private _initialized: boolean;

  constructor() {
    this._initialized = false;
    this._emitter = new DataEmitter();
    this._reciver = new DataReciver();
  }

  async init(url: string) {
    if (this._initialized) return;
    const reciverInit = this._reciver.init(url);
    const emitterInit = this._emitter.init(url);

    await Promise.all([reciverInit, emitterInit]);

    this._initialized = true;
  }

  send(data: string) {
    this._emitter.send(data);
  }

  onData(listener: (data: string) => void) {
    this._reciver.onData(listener);
  }

  close() {
    this._reciver.close();
    this._emitter.close();
  }
}

export class NotInitializedError extends Error {
  constructor(propertyName: string) {
    super(`property "${propertyName}" hasn't initialized yet!`);
  }
}

class DataEmitter {
  private _controller?: DataEmitterController;
  private _initialized: boolean;

  constructor() {
    this._initialized = false;
  }

  get controller() {
    if (!this._controller) throw new NotInitializedError('controller');
    return this._controller;
  }

  async init(url: string) {
    if (this._initialized) return;

    this._controller = await createController(url);
    this._initialized = true;
  }

  send(data: string) {
    this.controller.enqueue(data);
  }

  close() {
    this.controller.close();
  }
}

type DataReciverEvents = {
  data: [data: string],
  close: [],
}

class DataReciver {
  private _reader?: DataReciverReader;
  private _initialized: boolean;
  private _reading: boolean;
  private _closed: boolean;
  private _eventEmitter: TypedEventEmitter<DataReciverEvents>

  constructor() {
    this._initialized = false;
    this._reading = false;
    this._closed = false;
    this._eventEmitter = createTypedEventEmitter();
  }

  get reader() {
    if (!this._reader) throw new NotInitializedError('reader');
    return this._reader;
  }

  private async initReader(url: string) {
    this._reader = await createReader(url);

    this.startReading();
  }

  private async startReading() {
    const { reader } = this;
    
    while (!this._closed) {
      const result = await reader.read();

      if (result.done) {
        this.close();
        break;
      } else {
        this._eventEmitter.emit('data', result.value);
      }
    }
  }

  async init(url: string) {
    if (this._initialized) return;

    this.initReader(url);

    this._initialized = true;
  }

  onData(listener: (data: string) => void) {
    this._eventEmitter.on('data', listener);
  }

  close() {
    if (this._closed) return;
    this._reader?.cancel('Close Connection');
    this._eventEmitter.emit('close');
    this._closed = true;
  }
}

function createController(url: string) {
  return new Promise<DataEmitterController>((resolve, reject) => {
    const stream = new ReadableStream<string>({
      start: resolve,
      cancel: reject,
    }).pipeThrough(new TextEncoderStream());

    fetch(url, <RequestInit>{
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain'
      },
      body: stream,
      duplex: 'half',
    }).then(reject);
  })
}

async function createReader(url: string) {
  const res = await fetch(url);
  const { body } = res;

  if (!body) throw Error(`Can't create a reader with url: ${url}`);

  return body.pipeThrough(new TextDecoderStream()).getReader();
}