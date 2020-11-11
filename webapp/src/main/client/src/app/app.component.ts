import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AppService } from './app.service';
import { AppState } from './app.state';
import { AppConfiguration } from './app-configuration';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  constructor(
    translate: TranslateService,
    private router: Router,
    private route: ActivatedRoute,
    private state: AppState,
    private config: AppConfiguration,
    private service: AppService
  ) {}

  ngOnInit() {

    this.state.setConfig(this.config);
    this.service.changeLang(this.state.currentLang);

    this.router.events.subscribe(val => {
      if (val instanceof NavigationEnd) {
        const params = this.route.snapshot.queryParamMap;
        if (params.has('lang')) {
          this.service.changeLang(params.get('lang'));
        }
        this.state.processParams(params);
      }
    });


  }
}
