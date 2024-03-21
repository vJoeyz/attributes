import type { FormField } from '@finsweet/attributes-utils';

export interface FieldData {
  element: FormField;
  value: string;
  checked?: boolean;
}
