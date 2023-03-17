import zod from 'zod';

export const eventArgSchema = zod.object({
  type: zod.enum(['normal', 'object', 'function', 'undefined', 'bigint', 'symbol']),
  data: zod.any(),
})

export type EventArgType = zod.output<typeof eventArgSchema>;