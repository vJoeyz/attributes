import type { AttributeSchemaCondition, DOMSelector, AttributeElementSchema } from '@global/types/schema';

export type SCHEMA_ITEM_TYPES =  'settings' | 'elements' | 'fields';


export interface SchemaSettings {
  key: string;
  instance: number;
  standalone: boolean;
}

export interface Attribute {
  key: string;
  title: string;
  description: string;
  href: string;
  baseSrc: string;
  scriptSrc: string;
  examplesSrc: string;
  loadMode: string;
  schemaSrc: string;
  changesetsSrc: string;
}

export interface AttributeLoaded extends Attribute {
  loaded: boolean;
  schemaFile: string;
  scriptFile: string;
}

/**
 * Defines the Schema selector used in assertions services
 */
export interface SchemaSelector {
  attribute: string;
  value: string;
  initial: boolean;
  elements: HTMLElement[];
  setAttribute(attribute: string): void;
  setValue(value: string): void;
  getItemLabel: () => 'Element' | 'Setting';
  getAttribute: () => string;
  getValue: () => string;
  getElementSelector: () => string;
  getAttributeSelector: () => string;
  getPrettierSelector: () => string;
  getSelectors: (selectors: string[]) => string;
  getElementKey(): string;
  getInitial(): boolean;
}


export interface AttributeSchemaConditionNormalize {
  normalizeSelector: string;
  condition: AttributeSchemaCondition;
}

export type AppliedToSelector = (SchemaSelector | DOMSelector)[];


export interface ElementItemSelector {
  elementAttribute: AttributeElementSchema;
  elementSelector: SchemaSelector;
}
