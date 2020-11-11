import { Component, OnInit } from '@angular/core';
import { AppState } from 'src/app/app.state';
import { Router } from '@angular/router';

@Component({
  selector: 'app-searchbar',
  templateUrl: './searchbar.component.html',
  styleUrls: ['./searchbar.component.scss']
})
export class SearchbarComponent implements OnInit {


  constructor(
    private router: Router,
    public state: AppState
  ) { }

  ngOnInit() {
  }

  search() {
    this.state.changedSource = false;
    const p: any = {};
    p.q = this.state.q ? (this.state.q !== '' ? this.state.q : null) : null;
    p.page = 0;
    this.router.navigate(['/results'], { queryParams: p, queryParamsHandling: 'merge' });
  }

  cleanQuery() {
    this.state.changedSource = false;
    this.state.q = null;
    // this.search();
  }

}
