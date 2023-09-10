export interface Yahoo extends Record<string, string | boolean | number | undefined> {
  v: number;
  title: string;
  st: string;
  et: string;
  desc?: string;
  in_loc?: string;
}
