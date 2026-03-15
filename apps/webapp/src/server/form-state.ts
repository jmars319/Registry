export interface FormActionState {
  status: "idle" | "success" | "error";
  message?: string | undefined;
  fieldErrors?: Record<string, string> | undefined;
}

export const initialFormActionState: FormActionState = {
  status: "idle"
};

export function getRequiredFormValue(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

export function getOptionalFormValue(formData: FormData, key: string): string | undefined {
  const value = getRequiredFormValue(formData, key);
  return value === "" ? undefined : value;
}

export function getIntegerFormValue(formData: FormData, key: string): number {
  const value = getRequiredFormValue(formData, key);
  return Number.parseInt(value, 10);
}

export function getCurrencyCentsFromDollars(formData: FormData, key: string): number {
  const value = getRequiredFormValue(formData, key);

  if (value === "") {
    return Number.NaN;
  }

  const dollars = Number.parseFloat(value);

  if (Number.isNaN(dollars)) {
    return Number.NaN;
  }

  return Math.round(dollars * 100);
}

export function flattenFieldErrors(
  fieldErrors: Record<string, string[] | undefined>
): Record<string, string> | undefined {
  const entries = Object.entries(fieldErrors)
    .map(([field, messages]) => [field, messages?.[0]])
    .filter((entry): entry is [string, string] => typeof entry[1] === "string");

  if (entries.length === 0) {
    return undefined;
  }

  return Object.fromEntries(entries);
}
