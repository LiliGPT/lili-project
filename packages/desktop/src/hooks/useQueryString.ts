export function useQueryString<T extends Record<string, string>>(): Partial<T> {
  const search = window.location.search;
  const searchParams = new URLSearchParams(search);
  const qs: Partial<T> = {};
  for (const [key, value] of searchParams.entries()) {
    qs[key as keyof T] = value as T[keyof T];
  }
  return qs;
}

