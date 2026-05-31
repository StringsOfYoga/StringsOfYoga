import { map, pipe } from 'rxjs';

export function extractData<T>() {
  return pipe(
    map((res: unknown) => {
      const wrapped = res as { success?: boolean; data?: T };
      if (wrapped && wrapped.success === true && 'data' in wrapped) {
        return wrapped.data as T;
      }
      return res as T;
    })
  );
}

const pascalToCamel = (key: string) => key.charAt(0).toLowerCase() + key.slice(1);

export function toCamelCase<T>(obj: unknown): T {
  if (Array.isArray(obj)) {
    return obj.map(item => toCamelCase(item)) as T;
  }
  if (obj !== null && typeof obj === 'object') {
    return Object.fromEntries(
      Object.entries(obj).map(([key, val]) => [pascalToCamel(key), toCamelCase(val)])
    ) as T;
  }
  return obj as T;
}
