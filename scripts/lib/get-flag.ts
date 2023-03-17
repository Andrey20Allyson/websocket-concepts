export enum FlagMode {
  string,
  number,
  boolean,
}

export interface FlagTypes {
  [FlagMode.string]: string | undefined;
  [FlagMode.number]: number | undefined;
  [FlagMode.boolean]: boolean;
}

export function getFlagFrom<T extends keyof FlagTypes = FlagMode.string>(flag: string, argv: string[], mode: T = FlagMode.string as T): FlagTypes[T] {
  const flagIndex = argv.indexOf(flag);

  if (mode === FlagMode.boolean) {
    return (flagIndex !== -1) as FlagTypes[T];
  }

  if (flagIndex === -1) {
    return undefined as FlagTypes[T];
  }

  const value = argv.at(flagIndex + 1) ?? '';

  if (mode === FlagMode.string) {
    return value as FlagTypes[T];
  }

  const numValue = Number(value);

  return numValue as FlagTypes[T];
}