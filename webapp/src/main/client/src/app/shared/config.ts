
export interface Sort { label: string; field: string; dir: string; };

export class Configuration {
  context: string;
  defaultLang: string;

  sources: {label: string, url: string, searchable: boolean}[];

  sorts: {[source: string]: Sort[]};
  currentSort: Sort;

  selRows: number[];
  defaultRows: number;
  urlFields: string[];

  entityIcons: { [entity: string]: string };
  vdkAPI: string;
}
