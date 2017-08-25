import 'rxjs/add/observable/throw';

// Operators
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/concatAll';


import { Injectable } from '@angular/core';
import { Events } from 'ionic-angular';
import { Http, Response,Headers, RequestOptions } from '@angular/http';

import { Config } from '../config/config';
import { sUser } from '../providers/sUser';
import { Observable }  from 'rxjs/Observable';

@Injectable()
export class sHttp {

  base_url = Config.url;

  constructor(public http: Http, public sUser:sUser, public events: Events) {}


  public post(url, params) {
    // console.log('post token', this.sUser.getToken());

    if ( this.sUser.getToken() != null &&  this.sUser.isExpireTime()  ){
      return this._validate().map(value=>{
         return this._post(url, params);
      }).concatAll();
    } else {
      return this._post(url, params);
    }
  }

  public _post(url, params){
    let body = JSON.stringify(params);
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');

    let authToken = this.sUser.getToken();
    if(authToken!=null){
      headers.append('Authorization', 'Bearer '+authToken);
    }

    let options = new RequestOptions({ headers: headers });

    return this.http
      .post(this.base_url + url ,body , options).map(this.extractData)
      .catch(this.handleError);
  }

  public get(url) {
    if( this.sUser.getToken() != null && this.sUser.isExpireTime()){
      return this._validate().map(value=>{
        return this._get(url);
      }).concatAll();
    }else{
      return this._get(url);
    }
  }

  public _get(url) {

    let authToken = this.sUser.getToken();
    let headers = new Headers();
    if(authToken!=null){
        headers.append('Authorization', 'Bearer '+authToken);
    }
    let options = new RequestOptions({ headers: headers });

     return this.http
              .get(this.base_url + url , options ).map(this.extractData)
              .catch(this.handleError);
  }

  private extractData(res: Response) {
    let body;
    if (res.text()) {
      body = res.json();
    }
    return body || { };
  }

  private handleError (error: any) {
    // In a real world app, we might use a remote logging infrastructure
    // We'd also dig deeper into the error to get a better message
    let errMsg = (error.message) ? error.message :
      error.status ? `${error.status} - ${error.statusText}` : 'Server error';
    console.error(errMsg); // log to console instead
    if( error.status != 401 ){
    return Observable.throw(errMsg);
    }else{
      return Observable.throw(error);
    }
  }

  login(id:string, password:string) {
    this._post('/sec/login' , {'name':id, 'pwd':password}).subscribe(
      data =>{
        this.sUser.login(data);
      },
      error => {
        if ( typeof error === 'object' ) {
          if ( error.status == 401 ) {
            /*
            if ( error.json().code == -100 ) {
              this.events.publish('xEmailValidation', id);
              return;
            }
            */
            this.events.publish('xLoginError');
            return;
          }
        }
        this.events.publish('xLoginError');
      }
    );

    // local test code
    // this.sUser.login({"username":"eumbook@eumbook.com","roles":["ROLE_ADMIN","ROLE_AUTHOR","ROLE_USER"],"access_token":"b8p9vl832222c8m6badk0uiuap9ptaph","display_name":"이음북","token_type":"Bearer","profile_path":"/contents/user/20150508/eumbook_profile_uZMIUjXK.png"});
  }

  logout(){
    let token = this.sUser.getToken();

    if ( token != null ) {
      this.sUser.logout();
    }
    /*
    if ( token!=null ) {
      this._post('/sec/logout',{}).subscribe(data =>{
        this._post('/j_spring_security_logout',{});
      });
      this.sUser.logout();
    }
    */
  }



  public validate(){
    let temp = this._validate();
    if(temp!=undefined) {
      temp.subscribe(data=>{
          this.sUser.set(data);
          this.events.publish('xValidateSuccess');
        })
    }
  }
  public _validate(){
    let token = this.sUser.getToken();
    if(token != null) {
      return this._post('/sec/validate',{}).catch(
      (error: any)=>{
        var username = this.sUser.get().username;
        this.sUser.remove();

        if( typeof error === 'object' ){
          if( error.status == 401 ){
            if( error.json().code == -100 ){
              this.events.publish('xEmailValidation', username);
              return(error);
            }
          }
        }
        this.events.publish('xValidateError');
        return(error);
      });
    }
    return null;
  }
}
