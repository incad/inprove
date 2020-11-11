export class SolrDocument {
  id: string;
  uniqueid: string;
  pristupnost: string;
  vdk?: any[];
  rdcz?: any[];
  czbrd?: any[];
  dpz?: any[];
  sourcesLength: number;
  pian: {
    'parent_pristupnost': string,
    'parent': string, 
    'ident_cely': string, 
    'centroid_e': string, 
    'presnost': string, 
    'typ': string, 
    'parent_doctype': string, 
    'centroid_n': string
  }[][];
  [prop: string]: any;
}

