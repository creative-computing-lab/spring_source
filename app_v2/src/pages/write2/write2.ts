import { Component } from '@angular/core';
import { AlertController, NavController, NavParams, Platform } from 'ionic-angular';

import { BackgroundSelectPage } from '../background-select/background-select';
import { TabsPage } from '../tabs/tabs';
import { LoginPage } from '../login/login';

import { sUser } from '../../providers/sUser';
import { sHttp } from '../../providers/sHttp';
import { sToast } from '../../providers/sToast';
import { sSettings } from '../../providers/sSettings';

/*
  Generated class for the Write2 page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-write2',
  templateUrl: 'write2.html'
})
export class Write2Page {
  settingsReady = false;
  options: any;

  public isLogin : boolean;

  private title : string;
  private thoughts : string = '';

  public isModify: boolean = false;
  public postsId: number;

  public isIos: boolean = false;

  constructor(public alertCtrl: AlertController,
            public navCtrl: NavController,
            public navParams: NavParams,
            public platform: Platform,
            public user: sUser,
            public http: sHttp,
            public sToast: sToast,
            public sSettings: sSettings) {
    this.isLogin = user.isLogin();
    this.isModify = this.navParams.get('isModify');
    this.postsId = this.navParams.get('postsId');

    this.isIos = platform.is('ios');

    if ( this.isLogin ) {
    } else {
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

        if ( value.thoughts == '' || value.thoughts == undefined ) {
          this.thoughts = '';
        } else {
          this.thoughts = value.thoughts;
        }
      } else {
        console.log('Not load settings');
      }
    });
  }

  getSettings(): any {
    return this.sSettings.load().then(() => {
      this.settingsReady = true;
      this.options = this.sSettings.allSettings;

      return this.options;
    });
  }

  goToBackgroundSelect() {
    console.log('thoughts:', this.thoughts);

    if ( this.thoughts == '' || this.thoughts == undefined ) {
      this.alertMessage('이런 감정이 드는 이유를 입력해 주세요!');
    } else {
      this.sSettings.setValue('thoughts', this.thoughts);
      this.navCtrl.push(BackgroundSelectPage, { 'isModify': this.isModify, 'postsId': this.postsId });
    }
  }

  goBack() {
    this.navCtrl.pop();
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

  alertMessage(message) {
    this.sToast.show(message, 2000, null);
  }
}
