/**
 * Defines the backup style for highlight
 */
export interface HighlightBackupStyle {
  [keyCamelCase: string]: {
    keyHyphenCase: string;
    value: string;
  };
}

/**
 * Defines the Highlight of and item
 */
export interface Highlight {
  backupStyles: HighlightBackupStyle[];
  elements: HTMLElement[];
}
