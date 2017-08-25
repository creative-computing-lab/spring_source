import { Injectable } from '@angular/core';
import { Events } from 'ionic-angular';

import { Storage } from '@ionic/storage';


@Injectable()
export class sUser {
  token: string;
  loginTime;
  user;
  userRole;
  username;

  constructor(public events: Events, public storage: Storage) {
    console.log('sUser constructor');
    this.storage.ready().then(() => {
      this.storage.get('user').then(value => {
        if (value != null && this.getToken() == null) {
          this.user = JSON.parse(value);
          this.token = this.user.access_token;
          this.username = this.user.username;

          this.events.publish('xUserInit');

          //console.log('[sUser]xUserInit');
          //console.log('[sUser]token:', this.token);
          //console.log('[sUser]username:', this.username);
        }
      });

    });
  }

  login(_user) {
    this.set(_user);
    this.events.publish('xLoginSuccess');
  }

  logout() {
    this.remove();
    this.events.publish('xLogoutSuccess');
  }

  set(_user) {
    //console.log(_user);
    this.storage.set('user', JSON.stringify(_user));
    this.setLoginTime();

    //console.log('token:', _user.access_token);
    this.token = _user.access_token;
    this.user = _user;

    //console.log('roles:', _user.roles[0]);
    this.userRole = _user.roles[0];
  };

  get() {
    return this.user;
  }

  getToken() {
    return this.token;
  }

  setToken(token) {
    this.token = token;
  }

  isLogin() {
    return this.token != null;
  }

  setLoginTime() {
    this.loginTime = new Date().getTime();
  }

  isExpireTime() {
    if (this.loginTime != null) {
      var loginSessionTime = 30 * 60;
      var curTime = new Date().getTime();
      var expireTime = this.loginTime + (loginSessionTime * 1000);
      if (expireTime < curTime) {
        return true;
      } else {
        return false;
      }
    }
    return true;
  }

  remove() {
    this.storage.remove('user');
    this.token = null;
    this.loginTime = null;
    this.user = null;
  }

  getRole() {
    return this.userRole;
  }

  getUsername() {
    return this.username;
  }
}
