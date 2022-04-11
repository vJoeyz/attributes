

export function persistStore<Type>(key: string, values: Type): void {
  localStorage.setItem(key, JSON.stringify(values));
}


export function loadStore<Type>(key: string, defaultValue: Type): Type {
  const storedWizardIntances: string | null = localStorage.getItem(key);

  if (storedWizardIntances === null)  {
    return defaultValue;
  }

  const initialState: Type = storedWizardIntances ? JSON.parse(storedWizardIntances) : defaultValue;

  return initialState;
}
