
import { AppConfiguration } from 'src/app/app-configuration';
import { SolrResponse } from 'src/app/shared/solr-response';

import { Observable, Subject, ReplaySubject, BehaviorSubject } from 'rxjs';
import { Params, ParamMap } from '@angular/router';
import { Configuration, Sort } from './shared/config';
import { MatDialogRef } from '@angular/material/dialog';

export class AppState {

  // Observe state
  private stateSubject: ReplaySubject<string> = new ReplaySubject(1);
  public stateChanged: Observable<string> = this.stateSubject.asObservable();

  private stateParamsSubject: ReplaySubject<string> = new ReplaySubject(1);
  public stateParamsChanged: Observable<string> = this.stateParamsSubject.asObservable();

  source: string = 'vdk';
  sources: { [source: string]: boolean } = {};

  config: AppConfiguration;

  currentLang = 'cs';

  solrResponse: SolrResponse;
  numFound: number;
  facets: { field: string, values: { value: string, count: number, used: boolean }[] }[];
  facet_ranges;
  currentOd;
  currentDo;

  totals: { [entity: string]: number } = {};

  q: string;
  rows: number;
  page: number;
  sort: Sort;
  countsSort: Sort = {
    label: 'sort_by_count',
    dir: 'asc',
    field: 'count'
  };
  isCountSort = true;
  usedFilters: { field: string, value: any }[];

  changedSource: boolean = false;

  setConfig(cfg: AppConfiguration) {
    this.config = cfg;
    this.currentLang = cfg.defaultLang;
    this.rows = cfg.defaultRows;
    this.sort = cfg.sorts[this.source][0];
    cfg.sources.forEach(s => {
      this.sources[s.label] = true;
    });
  }

  setSearchResponse(resp: SolrResponse) {
    this.solrResponse = resp;
    this.numFound = resp.response.numFound;
    this.facets = [];
    this.facet_ranges = null;
    if (resp.facet_counts) {
      this.setFacets(resp);
      this.facet_ranges = resp.facet_counts.facet_ranges;
    }

    this.stateSubject.next();
  }

  setFacets(resp: SolrResponse) {
    switch (this.source) {
      case 'czbrd':
        this.setFacetsCZBRD(resp);
        break;
      case 'vdk':
        this.setFacetsVDK(resp);
        break;
      case 'rdcz':
        this.setFacetsRDCZ(resp);
        break;
      case 'dpz':
        this.setFacetsDPZ(resp);
        break;
      default:
    }
  }

  setFacetsRDCZ(resp: SolrResponse) {
    const fields = Object.keys(resp.facet_counts.facet_fields);
    fields.forEach(f => {
      const ff: any[] = resp.facet_counts.facet_fields[f];
      const values = [];

      ff.forEach(fff => {
        values.push({ value: fff[0], count: fff[1] });
      });
      if (values.length > 1) {
        this.facets.push({ field: f, values });
      }
    });
  }

  setFacetsVDK(resp: SolrResponse) {
    const fields = Object.keys(resp.facet_counts.facet_fields);
    fields.forEach(f => {
      const ff: { name: string, value: number }[] = resp.facet_counts.facet_fields[f];

      // const vals = Object.keys(ff);
      const values = [];
      ff.forEach(fff => {
        values.push({ value: fff.name, count: fff.value });
      });
      if (values.length > 1) {
        this.facets.push({ field: f, values });
      }
    });
  }

  setFacetsCZBRD(resp: SolrResponse) {
    const fields = Object.keys(resp.facet_counts.facet_fields);
    fields.forEach(f => {
      const ff: any[] = resp.facet_counts.facet_fields[f];
      const values = [];
      for (let i = 0; i < ff.length; i++) {
        values.push({ value: ff[i], count: ff[++i] });
      }
      if (values.length > 1) {
        this.facets.push({ field: f, values });
      }
    });
  }

  setFacetsDPZ(resp: SolrResponse) {
    const fields = Object.keys(resp.facet_counts.facet_fields);
    fields.forEach(f => {
      const ff: any[] = resp.facet_counts.facet_fields[f];
      const values = [];
      for (let i = 0; i < ff.length; i++) {
        values.push({ value: ff[i], count: ff[++i] });
      }
      if (values.length > 1) {
        this.facets.push({ field: f, values });
      }
    });
  }

  addFilter(field: string, value: any) {
    this.usedFilters.push({ field, value });
  }

  processParams(params: ParamMap) {
    this.source = params.has('source') ? params.get('source') : 'vdk';
    this.q = params.has('q') ? params.get('q') : null;
    this.page = params.has('page') ? +params.get('page') : 0;
    this.rows = params.has('rows') ? +params.get('rows') : this.config.defaultRows;

    this.sort = null;
    if ( params.has('sort')) {
      this.sort = this.config.sorts[this.source].find(s => s.field === params.get('sort'));
    }
    if (this.sort) {
      this.isCountSort = false;
    } else {
      this.sort = this.countsSort;
      this.isCountSort = true;
    }

    this.usedFilters = [];

    params.keys.forEach(p => {
      const val = params.get(p);
      switch (p) {
        case 'q':
        case 'source':
        case 'page':
        case 'rows':
        case 'sort':
          break;
        default:
          this.addFilter(p, val);
      }
    });

    this.stateParamsSubject.next();
  }

}
