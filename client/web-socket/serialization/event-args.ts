import { EventArgType } from "../schemas";

type Types = "string" | "number" | "bigint" | "boolean" | "symbol" | "undefined" | "object" | "function";
type TypeMap<R> = { [K in Types]: (arg: any) => R };
type Entry<K extends keyof any, T> = [K, T]
type Entries<K extends keyof any, T> = Entry<K, T>[];

const normalParser = (arg: any): EventArgType => {
  return {
    type: 'normal',
    data: arg,
  }
}

function mapEntries(value: any): Entries<string, EventArgType> {
  const entries: Entries<string, EventArgType> = [];

  for (const key in value) {
    entries.push([key, toEventArg(value[key])]);
  }

  return entries;
}

function toEventArg(arg: any): EventArgType {
  return typeParserMap[typeof arg](arg);
}

const typeParserMap: TypeMap<EventArgType> = {
  boolean: normalParser,
  number: normalParser,
  string: normalParser,
  bigint: (arg: bigint) => {
    const buffer = new ArrayBuffer(8);

    const view = new DataView(buffer, 0, 1);

    view.setBigInt64(0, arg);

    const stringData = new Array(view.byteLength).map((v, i) => view.getUint8(i)).join();

    return {
      type: 'bigint',
      data: `"${stringData}"`,
    }
  },
  function: (arg: Function) => {
    return {
      type: 'function',
      data: {
        length: arg.length,
      }
    }
  },
  object: (arg: any) => {
    if (arg === null) {
      return {
        type: 'object',
        data: null,
      }
    }
    return {
      type: 'object',
      data: {
        constructor: arg?.constructor,
        entries: mapEntries(arg),
      }
    }
  },
  symbol: (arg: symbol) => {
    return {
      type: 'symbol',
      data: arg.description,
    }
  },
  undefined: () => {
    return {
      type: 'undefined',
    }
  }
}

export function serializeArgs() {

}