import { Component, OnInit } from '@angular/core';
import { AppConfiguration } from 'src/app/app-configuration';
import { Router } from '@angular/router';
import { AppState } from 'src/app/app.state';

@Component({
  selector: 'app-facets',
  templateUrl: './facets.component.html',
  styleUrls: ['./facets.component.scss']
})
export class FacetsComponent implements OnInit {

  constructor(
    private router: Router,
    public config: AppConfiguration,
    public state: AppState
  ) { }

  ngOnInit() {
  }

  setSource(source: string) {
    this.state.changedSource = true;
    this.router.navigate([], { queryParams: { source, sort: null }, queryParamsHandling: 'merge' });
  }

  clickFacet(field, facet) {

    const q = {};
    switch (this.state.source) {
      case 'czbrd':
        q[field] = facet.value;
        break;
      case 'vdk':
        q[field] = facet.value;
        break;
      case 'rdcz':
        q['fq'] = field + ':"' + facet.value + '"';
        break;
      case 'dpz':
        q[field] = facet.value;
        break;
      default:

    }



    this.router.navigate([], { queryParams: q, queryParamsHandling: 'merge' });
  }


}
