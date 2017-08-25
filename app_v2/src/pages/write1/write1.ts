import { Component } from '@angular/core';
import { AlertController, NavController, NavParams, Platform } from 'ionic-angular';
import { FormBuilder, FormGroup } from '@angular/forms';

import { LoginPage } from '../login/login';
import { TabsPage } from '../tabs/tabs';
import { Write2Page } from '../write2/write2';

import { sUser } from '../../providers/sUser';
import { sHttp } from '../../providers/sHttp';
import { sToast } from '../../providers/sToast';
import { sSettings } from '../../providers/sSettings';

/*
  Generated class for the Write1 page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-write1',
  templateUrl: 'write1.html'
})
export class Write1Page {
  settingsReady = false;
  options: any;

  public isLogin : boolean;

  private title : String = '';
  private situations : String = '';
  private postsCategory : String = '';

  public isModify: boolean = false;
  public postsId: number;

  write1Form: FormGroup;

  public isIos: boolean = false;

  constructor(public alertCtrl: AlertController,
            public navCtrl: NavController,
            public navParams: NavParams,
            public platform: Platform,
            public user: sUser,
            public http: sHttp,
            public sSettings: sSettings,
            public sToast: sToast,
            public formBuilder: FormBuilder) {
    this.isLogin = user.isLogin();
    this.isModify = this.navParams.get('isModify');
    this.postsId = this.navParams.get('postsId');

    this.isIos = platform.is('ios');

    if ( this.isLogin ) {
      console.log('login');
    } else {
      console.log('not login');
      this.navCtrl.setRoot(LoginPage);
    }
  }

  ionViewDidLoad() {
  }

  ionViewWillEnter() {
    // Build an empty form for the template to render
    // Storage synchronous call(promise)
    this.getSettings().then((value) => {
      if ( value != null ) {
        if ( value.title == '' || value.title == undefined ) {
          this.title = '이전 화면에서 기분을 입력해 주세요';
        } else {
          this.title = value.title;
        }

        if ( value.situations == '' || value.situations == undefined ) {
          this.situations = '';
        } else {
          this.situations = value.situations;
        }

        if ( value.postsCategory == '' || value.postsCategory == undefined ) {
          this.postsCategory = '';
        } else {
          this.postsCategory = value.postsCategory;
        }
      } else {
        console.log('Not load settings');
      }
    });
  }

  logout() {
    this.http.logout();
    this.sToast.show('로그아웃하였습니다.', 2000, null);
    this.navCtrl.setRoot(TabsPage);
  }

  closeConfirm() {
    let confirm = this.alertCtrl.create({
      title: '글쓰기를 취소하시겠습니까?',
      message: '',
      buttons: [
        {
          text: '아니요',
          handler: () => {
            confirm.dismiss();
          }
        },
        {
          text: '예',
          handler: () => {
            this.close();
          }
        }
      ]
    });
    confirm.present();
  }

  close() {
    // Initialize post setting value
    this.sSettings.initialPost();

    this.navCtrl.setRoot(TabsPage);
  }

  goBack() {
    this.navCtrl.pop();
  }
  
  goToWrite2() {
    console.log('situations:', this.situations);
    console.log('postsCategory:', this.postsCategory);

    if ( this.situations == '' || this.situations == undefined ) {
      this.alertMessage('현재 상황을 입력해 주세요!');
    } else if ( this.postsCategory == '' || this.postsCategory == undefined ) {
      this.alertMessage('카테고리를 선택해 주세요!');
    } else {
      this.sSettings.setValue('situations', this.situations);
      this.sSettings.setValue('postsCategory', this.postsCategory);

      this.navCtrl.push(Write2Page, { 'isModify': this.isModify, 'postsId': this.postsId });
    }
  }

  getSettings(): any {
    return this.sSettings.load().then(() => {
      this.settingsReady = true;
      this.options = this.sSettings.allSettings;

      return this.options;
    });
  }

  alertMessage(message) {
    this.sToast.show(message, 2000, null);
  }
}
