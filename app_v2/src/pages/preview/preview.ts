import { Component } from '@angular/core';
import { AlertController, NavController, NavParams, LoadingController, Platform } from 'ionic-angular';

import { Geolocation } from '@ionic-native/geolocation';

import { TabsPage } from '../tabs/tabs';
import { LoginPage } from '../login/login';

import { sUser } from '../../providers/sUser';
import { sHttp } from '../../providers/sHttp';
import { sToast } from '../../providers/sToast';
import { sSettings } from '../../providers/sSettings';
import  _ from 'lodash';
/*
  Generated class for the Preview page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-preview',
  templateUrl: 'preview.html'
})
export class PreviewPage {
  settingsReady = false;
  options: any;

  public isLogin : boolean;

  private moodValue : number;
  private title : string;
  private situations : string;
  private postsCategory : string;
  private thoughts : string;
  private backgroundSeq : number;
  private isPrivate : boolean;
  private backgroundImage : any = 'assets/images/background/';

  public isModify: boolean = false;
  public postsId: number;

  public isIos: boolean = false;

  public currentLatitude: any;
  public currentLongitude: any;

  constructor(public alertCtrl: AlertController,
  			public navCtrl: NavController,
            public navParams: NavParams,
            public platform: Platform,
            public loadingCtrl: LoadingController,
            public user: sUser,
            public http: sHttp,
            public sToast: sToast,
            public sSettings: sSettings,
            public geolocation: Geolocation) {
    this.isLogin = user.isLogin();
    this.backgroundSeq = this.navParams.get('backgroundSeq');

    this.backgroundImage += this.backgroundSeq + '.png';

    this.isModify = this.navParams.get('isModify');
    this.postsId = this.navParams.get('postsId');

    this.isIos = platform.is('ios');

    if ( this.isLogin ) {
    } else {
      this.navCtrl.setRoot(LoginPage);
    }

  }

  ionViewDidLoad() {
        // Build an empty form for the template to render
    // Storage synchronous call(promise)
    this.getSettings().then((value) => {
      if ( value != null ) {
        this.moodValue = value.moodValue;
        this.title = value.title;
        this.situations = value.situations;
        this.postsCategory = value.postsCategory;
        this.thoughts = value.thoughts;
      } else {
        console.log('Not load settings');
      }
    });
  }

  ionViewWillEnter() {
    this.geolocation.getCurrentPosition().then((resp) => {
      this.currentLatitude = resp.coords.latitude;
      this.currentLongitude = resp.coords.longitude;
    }).catch((error) => {
      console.log('Error getting location', error);
    });
  }

  getSettings(): any {
    return this.sSettings.load().then(() => {
      this.settingsReady = true;
      this.options = this.sSettings.allSettings;

      return this.options;
    });
  }

  privateCreate() {
    this.isPrivate = true;
    this.doPost();
  }

  publicCreate() {
    this.isPrivate = false;
    this.doPost();
  }

  doPost() {
    if ( this.isModify ) {
      let loader = this.loadingCtrl.create({
        content: "포스트 수정중입니다.<br/>잠시만 기다려 주세요."
      });
      
      console.log(this.title, ', ',
                  this.situations, ', ',
                  this.postsCategory, ', ',
                  this.thoughts, ', ',
                  this.backgroundSeq, ', ',
                  this.isPrivate);

      const posts = {title:this.title,
                      situations:this.situations,
                      category:this.postsCategory,
                      thoughts:this.thoughts,
                      backgroundSeq:this.backgroundSeq,
                      isPrivate:this.isPrivate,
                      latitude:this.currentLatitude,
                      longitude:this.currentLongitude,
                      };
      const mood = {moodValue:this.moodValue};

      const updateBody = {posts:posts, mood:mood};

      loader.present();

      var url = (_.template('/posts/update?seq=${postsSeq}'))({ 'postsSeq': this.postsId });
      this.http.post(url, updateBody).subscribe(
                  data => {
                    if (data.resultCode == "0") {
                      loader.dismiss();

                      this.sToast.show('포스트 수정이 완료되었습니다.', 2000, null);

                      // Initial storage
                      this.sSettings.setValue('moodValue', 0);
                      this.sSettings.setValue('title', '');
                      this.sSettings.setValue('situations', '');
                      this.sSettings.setValue('postsCategory', '');
                      this.sSettings.setValue('thoughts', '');
                      this.sSettings.setValue('backgroundSeq', 0);

                      this.navCtrl.setRoot(TabsPage);
                    } else {
                      loader.dismiss();
                      console.log('/posts/update error');
                      this.failAlert()
                    }
                  }
        );
    } else {
      let loader = this.loadingCtrl.create({
        content: "포스트 등록중입니다.<br/>잠시만 기다려 주세요."
      });

      const posts = {title:this.title,
                      situations:this.situations,
                      category:this.postsCategory,
                      thoughts:this.thoughts,
                      backgroundSeq:this.backgroundSeq,
                      isPrivate:this.isPrivate,
                      latitude:this.currentLatitude,
                      longitude:this.currentLongitude,
                      };
      const mood = {moodValue:this.moodValue};

      const createBody = {posts:posts, mood:mood};

      loader.present();
      this.http.post('/posts/create', createBody).subscribe(
        data => {
          loader.dismiss();
          // Keyboard.close();

          this.sToast.show('포스트 등록이 완료되었습니다.', 2000, null);

          if ( data.resultCode == "0" ) {
            // Initial storage
            this.sSettings.setValue('moodValue', 0);
            this.sSettings.setValue('title', '');
            this.sSettings.setValue('situations', '');
            this.sSettings.setValue('postsCategory', '');
            this.sSettings.setValue('thoughts', '');
            this.sSettings.setValue('backgroundSeq', 0);

            this.navCtrl.setRoot(TabsPage);
          } else {
            this.failAlert();
          }
        },
        error => {
          loader.dismiss();
          console.log('/posts/create error');
          this.failAlert()
        });
    }
  }

  failAlert() {
    this.sToast.show('포스트 등록이 실패하였습니다. 입력 내용을 확인해주세요', 2000, null);
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
    this.navCtrl.setRoot(TabsPage);
  }
}
