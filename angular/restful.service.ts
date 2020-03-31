import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpClient, HttpHeaders, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';

import { Configuration } from '../app.constants';

import 'rxjs/add/operator/map';

@Injectable()

export abstract class RestfulService {
  protected baseUrl: string;

  constructor(public http: HttpClient, private configuration: Configuration){
    this.baseUrl = configuration.Server;
  }

  public getAll<T>(relativeUrl: string): Observable<T> {
    return this.http.get<T>(this.baseUrl + relativeUrl);
  }

  public getSingle<T>(relativeUrl: string, _id: string): Observable<T> {
    return this.http.get<T>(this.baseUrl + relativeUrl + _id);
  }

  public add(relativeUrl: string, item: Object ): Promise<any>{
    const toAdd = JSON.stringify({ item: item });
    return Promise.all( toAdd );
  }

  public update<T>(relativeUrl: string, _id: string, itemToUpdate: any): Observable<T> {
    return this.http
        .put<T>(this.baseUrl + relativeUrl + _id, itemToUpdate);
  }

  public delete<T>(relativeUrl: string, id: number): Observable<T> {
    return this.http.delete<T>(this.baseUrl + relativeUrl + id);
  }
}

@Injectable()
export class CustomInterceptor implements HttpInterceptor {

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if (!req.headers.has('Content-Type')) {
            req = req.clone({ headers: req.headers.set('Content-Type', 'application/json') });
        }

        req = req.clone({ headers: req.headers.set('Accept', 'application/json') });
        console.log(JSON.stringify(req.headers));
        return next.handle(req);
    }
}
