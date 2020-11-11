
import { AppService } from 'src/app/app.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { AppConfiguration } from 'src/app/app-configuration';
import { AppState } from 'src/app/app.state';
import { Sort } from 'src/app/shared/config';

@Component({
  selector: 'app-facets-used',
  templateUrl: './facets-used.component.html',
  styleUrls: ['./facets-used.component.scss']
})
export class FacetsUsedComponent implements OnInit {

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    public config: AppConfiguration,
    public state: AppState,
    private service: AppService) { }

  ngOnInit(): void {
    this.service.currentLang.subscribe(() => {
      // this.service.setCrumbs(this.route.snapshot.queryParamMap);
    });
  }

  removeFacet(filter) {
    console.log(filter);

    const params = {};
    const field = filter.field;
    params[field] = [];
    this.state.usedFilters.forEach(f => {
      if (f.field === filter.field && f.value !== filter.value) {
        params[field].push(f.value);
      }
    });
    if (params[field].length === 0) {
      params[field] = null;
    }
    this.router.navigate([], { queryParams: params, queryParamsHandling: 'merge' });

  }


  clean() {
    const q = {};
    this.state.usedFilters.forEach((c: any) => {
      q[c.field] = null;
    });
    this.router.navigate([], { queryParams: q, queryParamsHandling: 'merge' });
  }
}
