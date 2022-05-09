export function persistStore<Type>(key: string, values: Type): void {
  localStorage.setItem(key, JSON.stringify(values));
}

export function loadStore<Type>(key: string, defaultValue: Type): Type {
  const storedSupportIntances: string | null = localStorage.getItem(key);

  if (storedSupportIntances === null) {
    return defaultValue;
  }

  const initialState: Type = storedSupportIntances ? JSON.parse(storedSupportIntances) : defaultValue;

  return initialState;
}
