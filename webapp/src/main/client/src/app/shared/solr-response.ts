import { SolrDocument } from 'src/app/shared/solr-document';
import { FacetPivot } from 'src/app/shared/facet-pivot';

export class SolrResponse {
  response: {
    docs: SolrDocument[];
    numFound: number,
    start: number
  };
  responseHeader: {
    QTime: number;
    params: any;
    status: number
  };
  facet_counts: {
    facet_intervals: any;
    facet_pivot: FacetPivot;
    facet_ranges: any;
    // facet_fields: {[field: string]: {[value: string]: number}};
    facet_fields: {[field: string]: any};
    facet_heatmaps: any;
  };

}

