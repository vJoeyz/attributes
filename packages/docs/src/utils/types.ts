interface BaseAttributeData {
  key: string;
  title: string;
  description: string;
  baseSrc: string;
  scriptSrc: string;
  changesetsSrc: string;
  readmeSrc: string;
}

type NotSupportedAttributeData = BaseAttributeData & {
  allowSupport: false;
};

type SupportedAttributeData = BaseAttributeData & {
  href: string;
  examplesSrc: string;
  loadMode: string;
  schemaSrc: string;
  allowSupport: true;
};

type AttributeData = SupportedAttributeData | NotSupportedAttributeData;

export type AttributesData = AttributeData[];
