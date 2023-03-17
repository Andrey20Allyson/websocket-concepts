import { NotInitializedError } from "../util/errors";
import { createTypedEventEmitter, TypedEventEmitter } from "../util/typed-events";

export type DataReciverReader = ReadableStreamDefaultReader<string>;

export type DataReciverEvents = {
  data: [data: string],
  close: [],
}

export class DataReciver {
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

export async function createReader(url: string) {
  const res = await fetch(url);
  const { body } = res;

  if (!body) throw Error(`Can't create a reader with url: ${url}`);

  return body.pipeThrough(new TextDecoderStream()).getReader();
}