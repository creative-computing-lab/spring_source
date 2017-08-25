import { Component } from '@angular/core';
import { AlertController, NavController, NavParams, PopoverController, Platform } from 'ionic-angular';

import { LoginPage } from '../login/login';
import { TabsPage } from '../tabs/tabs';
import { Write1Page } from '../write1/write1';
import { ModalJoinRecommendationPage } from '../modal_join_recommendation/modal_join_recommendation';

import { sUser } from '../../providers/sUser';
import { sHttp } from '../../providers/sHttp';
import { sToast } from '../../providers/sToast';
import { sSettings } from '../../providers/sSettings';

import  _ from 'lodash';
/*
  Generated class for the Checkmood page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-checkmood',
  templateUrl: 'checkmood.html'
})
export class CheckmoodPage {
  settingsReady = false;
  options: any;
  public errorMessage;

  public isLogin : boolean;

  private moodValue: number = 50;
  private title: String;
  private situations: String = '';
  private postsCategory: String = '';
  private thoughts: String = '';

  public isModify: boolean = false;
  public postsId: number;
  public postsData = {'resultCode':0, 'data':[]};
  public distance : any;

  public isIos: boolean = false;

  constructor(public alertCtrl: AlertController,
            public navCtrl: NavController,
            public navParams: NavParams,
            public popoverCtrl: PopoverController,
            public platform: Platform,
            public user: sUser,
            public sHttp: sHttp,
            public sSettings: sSettings,
            public sToast: sToast) {

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

    if ( this.isModify ) {
      this.getPost();
    }

    this.sSettings.load().then(() => {
      this.settingsReady = true;
      this.options = this.sSettings.allSettings;

      console.log('CheckmoodPage settings.load()');
    });
  }

  ionViewDidLoad() {
    // console.log('ionViewDidLoad CheckmoodPage');
  }

  ionViewWillEnter() {
    
  }

  openModalJoinRecommendation() {
    let popover = this.popoverCtrl.create(ModalJoinRecommendationPage);
    popover.present();
  }

  getPost() {
    var url = (_.template('/posts/item?seq=${seq}'))({'seq':this.postsId});
    this.sHttp.get(url).subscribe(
              data => {
                console.log(data);
                this.postsData = data;

                this.moodValue = this.postsData.data[0].moodValue;
                this.title = this.postsData.data[0].title;

                // this.sSettings.setValue('situations', this.postsData.data[0].situations);
                // this.sSettings.setValue('thoughts', this.postsData.data[0].thoughts);
                this.situations = this.postsData.data[0].situations;
                this.thoughts = this.postsData.data[0].thoughts;
                this.postsCategory = this.postsData.data[0].category;
              },
              // error =>  this.errorMessage = <any>error
              error => {
                this.errorMessage = <any>error;
                console.log('[feed]/posts/item?seq=${seq} errorMessage:', this.errorMessage);
                if ( typeof error === 'object') {
                  console.log('error.status:', error.status);
                  if ( error.status == 401 ) {
                    // this.events.publish('xLoginError');
                  } else if ( error.status == 403 ) {
                  } else {
                  }
                }

                // this.sUser.remove();
                // this.navCtrl.setRoot(LoginPage);
              }
    );
  }

  goWrite1() {
    console.log('goWrite1 moodValue:', this.moodValue);
    console.log('goWrite1 title:', this.title);

    if ( this.title == '' || this.title == undefined ) {
      this.alertMessage('현재 기분을 입력해 주세요!');
    } else {
      this.sSettings.setValue('moodValue', this.moodValue);
      this.sSettings.setValue('title', this.title);
      this.sSettings.setValue('situations', this.situations);
      this.sSettings.setValue('thoughts', this.thoughts);
      this.sSettings.setValue('postsCategory', this.postsCategory);

      this.navCtrl.push(Write1Page, { 'isModify': this.isModify, 'postsId': this.postsId });
    }
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
