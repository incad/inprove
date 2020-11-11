import { Component, OnInit } from '@angular/core';
import { AppState } from 'src/app/app.state';
import { ActivatedRoute, Router } from '@angular/router';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-paginator',
  templateUrl: './paginator.component.html',
  styleUrls: ['./paginator.component.scss']
})
export class PaginatorComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public state: AppState) { }

  ngOnInit(): void {
  //   this.route.queryParams.subscribe(val => {
  //   this.pageIndex = this.state.page;
  // });
  }

  onChanged(e: PageEvent) {
    const params: any = {};
    params.rows = e.pageSize;
    params.page = e.pageIndex;
    // document.getElementById('scroll-wrapper').scrollTop = 0;
    this.router.navigate([], { queryParams: params, queryParamsHandling: 'merge' });
  }

}
