import { ReadablePropertyType, readablePropertyTypes } from "@/notion/types/common";

export function isNotNullOrUndefined<T>(input: null | undefined | T): input is T {
  return input != null;
}

export function isReadableProperty<T extends { type: string }>(
  property: T
): property is T & { type: ReadablePropertyType } {
  return (readablePropertyTypes as readonly string[]).includes(property.type);
}
