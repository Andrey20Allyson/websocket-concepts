import zod from 'zod';
import { eventArgSchema } from './event-arg';

export const eventSchema = zod.object({
  eventName: zod.string(),
  args: eventArgSchema.array(),
});

export type EventType = zod.output<typeof eventSchema>;
