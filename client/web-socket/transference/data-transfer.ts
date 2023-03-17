import { DataEmitter } from "./data-emitter";
import { DataReciver } from "./data-reciver";

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