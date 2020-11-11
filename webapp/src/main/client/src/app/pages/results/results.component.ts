import { Component, OnInit } from '@angular/core';
import { AppState } from 'src/app/app.state';
import { AppConfiguration } from 'src/app/app-configuration';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { AppService } from 'src/app/app.service';
import { HttpParams } from '@angular/common/http';
import { SolrResponse } from 'src/app/shared/solr-response';
import { SolrDocument } from 'src/app/shared/solr-document';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.scss']
})
export class ResultsComponent implements OnInit {

  loading: boolean;
  results: SolrDocument[] = [];
  isChartVisible: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public config: AppConfiguration,
    public state: AppState,
    private service: AppService
  ) { }

  ngOnInit() {
    this.route.queryParams.subscribe(val => {
      this.search(val);
    });
  }

  search(params: Params) {
    this.loading = true;
    if (!this.state.changedSource) {
      this.service.getTotals(params as HttpParams).subscribe((resp: any) => {
        this.state.totals = resp;
      });
    }
    this.service.search(params as HttpParams).subscribe((resp: SolrResponse) => {
      this.state.setSearchResponse(resp);
      this.results = resp.response.docs;
      if (this.state.isCountSort) {
        this.results = this.results.sort((d1, d2) => {
          const l1 = (d1.vdk ? d1.vdk.length : 0) +
            (d1.rdcz ? d1.rdcz.length : 0) +
            (d1.czbrd ? d1.czbrd.length : 0) +
            (d2.dpz ? d1.dpz.length : 0);
          const l2 = (d2.vdk ? d1.vdk.length : 0) +
            (d2.rdcz ? d2.rdcz.length : 0) +
            (d2.czbrd ? d2.czbrd.length : 0) +
            (d2.dpz ? d2.dpz.length : 0);
          return l2 - l1;
        });
      }
      this.loading = false;
    });
  }

  setSort(e) {
    this.state.sort = e.value;
    const params: any = {};
    params.sort = this.state.sort.field;
    this.router.navigate([], { queryParams: params, queryParamsHandling: 'merge' });

  }

  showChart() {
    this.isChartVisible = !this.isChartVisible;
  }

}
