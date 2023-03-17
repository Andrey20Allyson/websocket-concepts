import zod from 'zod';
import { EventType, EventArgType, eventSchema } from '../schemas';

export type SafeStringParseResult<T> = {
  success: true;
  data: T;
}

export type SafeStringParseError = {
  success: false;
  error: zod.ZodError | SyntaxError;
}

export type SafeParseResult<O> = SafeStringParseResult<O> | SafeStringParseError;

export type EventDTO = {
  eventName: string;
  args: any[];
}

export function serializeEvent(data: EventDTO): SafeParseResult<string> {
  try {
    // const schemaResult = eventSchema.parse(data);

    // const jsonString = JSON.stringify(schemaResult);

    // return {
    //   success: true,
    //   data: jsonString,
    // };

    // TODO implement serializeEvent
    throw Error('not implemented');
  } catch (e) {
    return {
      success: false,
      error: e as any,
    };
  }
}

export function deserializeEvent(data: string): SafeParseResult<EventDTO> {
  try {
    // const jsonObject = JSON.parse(data);

    // const schemaResult = eventSchema.parse(jsonObject);

    // return {
    //   success: true,
    //   data: schemaResult,
    // }

    // TODO implement deserializeEvent
    throw Error('not implemented');
  } catch (e) {
    return {
      success: false,
      error: e as any,
    }
  }
}