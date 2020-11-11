import { Component, OnInit } from '@angular/core';
import { AppService } from '../../app.service';
import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  loadedLangs: string[] = [];
  currLang: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private translate: TranslateService,
    private service: AppService
  ) { }

  ngOnInit() {
    this.service.currentLang.subscribe((lang) => {
      this.currLang = lang;
      if (!this.loadedLangs.includes(lang)) {
        const l = this.router.config.length - 1;
        this.loadedLangs.push(lang);
      }

    });
  }

  changeLang() {
    const lang: string = (this.currLang === 'cs' ? 'en' : 'cs');
    this.service.changeLang(lang);
  }

}
