import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { Observable, ReplaySubject } from 'rxjs';

import { map } from 'rxjs/operators';

import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { AppState } from './app.state';
import { AppConfiguration } from './app-configuration';


@Injectable({
  providedIn: 'root'
})
export class AppService {

  // Observe language
  private langSubject: ReplaySubject<string> = new ReplaySubject(3);
  public currentLang: Observable<string> = this.langSubject.asObservable();

  constructor(
    private translate: TranslateService,
    private http: HttpClient,
    private config: AppConfiguration,
    private state: AppState) {

  }


  changeLang(lang: string) {
    // console.log('lang changed to ' + lang);

    this.translate.use(lang).subscribe(val => {
      this.langSubject.next(lang);
    });
  }

  getTranslation(s: string): string {
    return this.translate.instant(s);
  }



  private get<T>(url: string, params: HttpParams = new HttpParams(), responseType?): Observable<T> {
    // const r = re ? re : 'json';
    const options = { params, responseType, withCredentials: true };
    if (environment.mocked) {
      return this.http.get<T>(`api${url}`, options);
    } else {
      return this.http.get<T>(`/api${url}`, options);
    }

  }

  private post(url: string, obj: any) {
    return this.http.post<any>(`api${url}`, obj);
  }

  /**
   * Fired for main search in results page
   * @param params the params
   */
  search(params: HttpParams) {
    // const params: HttpParams = new HttpParams().set('wt', 'json');
    return this.get(`/search/query`, params);
  }

  getTotals(p: HttpParams) {
    const params: any = Object.assign({}, p);
    delete params.sort;
    return this.get(`/search/totals`, params);
  }

  getDPZ(sigs: string[]) {
    let params: HttpParams = new HttpParams();
    sigs.forEach(c => {
      params = params.append('signatura', c);
    });
    return this.get(`/search/dpz`, params);
  }

  getRelations(carkods: string[], sigs: string[]) {
    let params: HttpParams = new HttpParams();
    if (carkods) {
      carkods.forEach(c => {
        params = params.append('carkod', c);
      });
    }
    if (sigs) {
      sigs.slice(0,20).forEach(c => {
        params = params.append('signatura', c);
      });
    }
    this.config.sources.forEach(c => {
      if (this.state.sources[c.label] && this.state.source !== c.label && c.searchable) {
        params = params.append('insource', c.label);
      }
    });
    return this.get(`/search/relations`, params);
  }

  getCZBRD(carkods: string[]) {
    let params: HttpParams = new HttpParams();
    carkods.forEach(c => {
      params = params.append('carkod', c);
    });
    return this.get(`/search/czbrd`, params);
  }

  getDigObjects(id: string) {
    const params: HttpParams = new HttpParams()
      .set('id', id);
    return this.get(`/search/rdcz_digobjects`, params);

  }
}
