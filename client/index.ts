

/*
type DataReciverListeners = {
  onready?: () => void;
  ondata?: (data: string) => void;
  onerror?: (err: any) => void;
}

function dataReciver(listeners: DataReciverListeners) {
  fetch('socket').then(async res => {
    const { body } = res;

    if (body) {
      const reader = body.pipeThrough(new TextDecoderStream()).getReader();

      listeners.onready?.();

      while (true) {
        const { done, value } = await reader.read();

        if (done) break;

        listeners.ondata?.(value);
      }
    }
  })
    .catch(listeners.onerror);
}

type SafeStringParseResult<T> = {
  success: true;
  data: T;
}

type SafeStringParseError<T> = {
  success: false;
  error: zod.ZodError<T> | SyntaxError;
}

type SafeParseResult<I, O> = SafeStringParseResult<O> | SafeStringParseError<I>;

function safeEventDTOParse<T extends zod.ZodSchema>(data: string, schema: T): SafeParseResult<T['_input'], T['_output']> {
  try {
    const jsonObject = JSON.parse(data);

    const schemaResult = schema.parse(jsonObject);

    return {
      success: true,
      data: schemaResult,
    }
  } catch (e) {
    return {
      success: false,
      error: e as any,
    }
  }
}

function safeEventDTOStringfy<T extends EventDTO>(data: T): SafeParseResult<T, string> {
  try {
    const schemaResult = schema.parse(data);

    const jsonString = JSON.stringify(schemaResult);

    return {
      success: true,
      data: jsonString,
    };
  } catch (e) {
    return {
      success: false,
      error: e as any,
    };
  }
}

const schema = zod.object({
  eventName: zod.string(),
  args: zod.object({
    type: zod.enum(['normal', 'object', 'function', 'undefined', 'bigint', 'symbol']),
    data: zod.any(),
  }).array(),
});

type EventDTO = zod.output<typeof schema>;
type EventArg = EventDTO['args'][number];

interface Socket {
  on(eventName: string, listener: (...args: any[]) => void): void;
  on(eventName: 'connect', listener: () => void): void;
  on(eventName: 'disconnect', listener: () => void): void;
  emit(eventName: string, ...args: any[]): void;
  end(): void;
}

let t = typeof 0;
type TypeMap<R> = { [K in typeof t]: (arg: any) => R };

const normalParser = (arg: any): EventDTO['args'][0] => {
  return {
    type: 'normal',
    data: arg,
  }
}

const typeParserMap: TypeMap<EventArg> = {
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

type Entry<K extends keyof any, T> = [K, T]
type Entries<K extends keyof any, T> = Entry<K, T>[];

function mapEntries(value: any): Entries<string, EventArg> {
  const entries: Entries<string, EventArg> = [];

  for (const key in value) {
    entries.push([key, toEventArg(value[key])]);
  }

  return entries;
}

function toEventArg(arg: any): EventArg {
  return typeParserMap[typeof arg](arg);
}

function createSocket() {
  const reciver = new EventEmitter();
  const emmiter = new EventEmitter();

  const socket: Socket = {
    on(eventName: string, listener: (...args: any[]) => void) {
      reciver.on(eventName, listener);
    },
    emit(eventName: string, ...args: any[]) {
      emmiter.emit('new-event', eventName, args);
    },
    end() {
      emmiter.emit('disconnect');

      reciver.removeAllListeners();
      emmiter.removeAllListeners();
    }
  };

  let readySteps = 0;
  const allSteps = 2;

  function stepCompleted() {
    ++readySteps;
    if (readySteps >= allSteps) {
      reciver.emit('connect');
    }
  }

  dataEmmiter(controller => {
    stepCompleted();

    emmiter.on('new-event', (eventName: string, args: any[]) => {
      const eventDTO: EventDTO = {
        eventName,
        args: args.map(toEventArg),
      }

      controller.enqueue();
    });
  });

  dataReciver({
    onready() {
      stepCompleted();
    },
    ondata(chunk) {
      const result = safeEventDTOParse(chunk, schema);

      if (result.success) {
        const { args, eventName } = result.data;

        reciver.emit(eventName);
      } else {
        console.log(result.error);
      }
    },
  });

  return socket;
}

function dataEmmiter(onready: (controller: ReadableStreamDefaultController<string>) => void, onerror?: (err: any) => void) {
  const stream = new ReadableStream<string>({
    start: onready,
    cancel: onerror,
  }).pipeThrough(new TextEncoderStream());

  fetch('socket', <RequestInit>{
    method: 'POST',
    headers: {
      'Content-Type': 'text/plain'
    },
    body: stream,
    duplex: 'half',
  }).catch(onerror);
}
*/

async function main() {
  
}

main().catch(console.error);