import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AppConfiguration } from './app-configuration';


@Injectable()
export class ApiInterceptor implements HttpInterceptor {
    constructor(
        private config: AppConfiguration) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        if (request.url.startsWith('/api')) {
            request = request.clone({ url: `${this.config.context}${request.url}`, withCredentials: true });
        }
        return next.handle(request);
    }
}
