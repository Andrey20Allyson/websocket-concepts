export class NotInitializedError extends Error {
  constructor(propertyName: string) {
    super(`property "${propertyName}" hasn't initialized yet!`);
  }
}