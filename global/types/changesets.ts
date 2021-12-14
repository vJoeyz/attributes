interface AttributeChangeset {
  version: `v${number}.${number}.${number}` | `v${number}.${number}.${number}-beta.${number}`;
  date: string;
  markdown: string;
}

export type AttributeChangesets = AttributeChangeset[];

type PartialAttributeChangeset = Omit<AttributeChangeset, 'markdown'>;

export type PartialAttributeChangesets = PartialAttributeChangeset[];
