export const isFormSubmittable = (
  errors: Record<string, unknown>,
  isSubmitting: boolean
): boolean => {
  return !(Object.keys(errors).length > 0 || isSubmitting);
};

export const populateFormValues = <T extends Record<string, any>>(
  defaultValues: T,
  data: Partial<T>,
  setValue: (key: keyof T, value: T[keyof T]) => void
): void => {
  Object.entries(defaultValues).forEach(([key, defaultValue]) => {
    const value = data[key as keyof T] ?? defaultValue;
    setValue(key as keyof T, value as T[keyof T]);
  });
};

export function getAllDisabled<T extends Record<string, any>>(
  obj: T
): Record<keyof T, boolean> {
  return Object.keys(obj).reduce(
    (acc, key) => {
      return { ...acc, [key]: true };
    },
    {} as Record<keyof T, boolean>
  );
}
