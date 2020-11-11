import { Component, OnInit } from '@angular/core';
import { AppConfiguration } from 'src/app/app-configuration';
import { Router } from '@angular/router';
import { AppState } from 'src/app/app.state';
import { AppService } from 'src/app/app.service';
import { HttpParams } from '@angular/common/http';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  loading: boolean;

  constructor(
    private router: Router,
    public state: AppState,
    public config: AppConfiguration,
    private service: AppService
  ) { }

  ngOnInit() {
    this.service.getTotals(new HttpParams()).subscribe((resp: any) => {
      this.state.totals = resp;
    });
  }

  setSource(source: { label: string, url: string, searchable: boolean }) {
    if (source.searchable) {
      this.state.changedSource = false;
      this.router.navigate(['/results'], { queryParams: { source: source.label }, queryParamsHandling: 'merge' });
    }
  }

}
