interface BaseAttributeData {
  key: string;
  title: string;
  description: string;
  href: string;
  baseSrc: string;
  scriptSrc: string;
  changesetsSrc: string;
  readmeSrc: string;
}

type NotSupportedAttributeData = BaseAttributeData & {
  allowSupport: false;
};

export type SupportedAttributeData = BaseAttributeData & {
  examplesSrc: string;
  loadMode: string;
  schemaSrc: string;
  allowSupport: true;
};

type AttributeData = SupportedAttributeData | NotSupportedAttributeData;

export type AttributesData = AttributeData[];
