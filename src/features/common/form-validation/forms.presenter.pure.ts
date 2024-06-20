// eslint-disable-next-line max-statements
export const nullToUndefined = (obj: unknown): unknown => {
  if (obj === null) return undefined;

  if (Array.isArray(obj)) {
    return obj.map((item: unknown[]): unknown => nullToUndefined(item));
  }

  if (typeof obj === 'object') {
    const result: Record<string, unknown> = {};

    for (const [key, value] of Object.entries(obj)) {
      result[key] = nullToUndefined(value);
    }

    return result;
  }

  return obj;
};
