import { Component } from '@angular/core';
import { NavController, NavParams, Platform } from 'ionic-angular';

import { PreviewPage } from '../preview/preview';
import { LoginPage } from '../login/login';

import { sUser } from '../../providers/sUser';
import { sHttp } from '../../providers/sHttp';
import { sSettings } from '../../providers/sSettings';

/*
  Generated class for the BackgroundSelect page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-background-select',
  templateUrl: 'background-select.html'
})
export class BackgroundSelectPage {
  settingsReady = false;
  options: any;

  public isLogin : boolean;

  private title : string;
  private situations : string;
  private thoughts : string;

  public isModify: boolean = false;
  public postsId: number;

  public backgroundImage : any = 'assets/images/background/1.png';
  public backgroundSeq : number = 1;

  public isIos: boolean = false;

  constructor(public navCtrl: NavController,
            public navParams: NavParams,
            public platform: Platform,
            public user: sUser,
            public http: sHttp,
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
        this.title = value.title;
        this.situations = value.situations;
        this.thoughts = value.thoughts;
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
  
  goToPreview() {
    this.sSettings.setValue('backgroundSeq', this.backgroundSeq);

    this.navCtrl.push(PreviewPage, {'backgroundSeq':this.backgroundSeq, 'isModify': this.isModify, 'postsId': this.postsId});
  }

  clickBackground(backgroundImageNumber) {
    this.backgroundImage = 'assets/images/background/' + backgroundImageNumber + '.png';
    this.backgroundSeq = backgroundImageNumber;
  }
}
