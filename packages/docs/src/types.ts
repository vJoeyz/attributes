export interface AttributeExample {
  title: string;
  description: string;
  data: Record<string, unknown>;
}

export interface AttributeData {
  key: string;
  title: string;
  description: string;
  href: string;
  baseSrc: string;
  scriptSrc: string;
  examplesSrc: string;
  loadMode: string;
}
