import { NotInitializedError } from "../util/errors";

export type DataEmitterController = ReadableStreamDefaultController<string>;

export class DataEmitter {
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

export function createController(url: string) {
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