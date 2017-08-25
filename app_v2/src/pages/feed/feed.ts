import { Component } from '@angular/core';
import { Events, NavController, NavParams, LoadingController, ActionSheetController, Platform } from 'ionic-angular';

import { Geolocation } from '@ionic-native/geolocation';

import { LoginPage } from '../login/login';
import { CommentPage } from '../comment/comment';
import { CheckmoodPage } from '../checkmood/checkmood';

import { sUser } from '../../providers/sUser';
import { sHttp } from '../../providers/sHttp';
import { sToast } from '../../providers/sToast';
import { sTimeAgo } from '../../providers/sTimeAgo';
import { sSettings } from '../../providers/sSettings';
import  _ from 'lodash';
/*
  Generated class for the Preview page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-feed',
  templateUrl: 'feed.html'
})
export class FeedPage {
  public isLogin : boolean;
  public errorMessage;

  public postsId;
  public postsData = {'resultCode':0, 'data':[]};
  public distance : any;

  public currentLatitude: any = 37.576149;
  public currentLongitude: any = 126.976901;

  constructor(public events: Events,
            public navCtrl: NavController,
            public navParams: NavParams,
            public loadingCtrl: LoadingController,
            public actionSheetCtrl: ActionSheetController,
            public platform: Platform,
            public sUser: sUser,
            public sHttp: sHttp,
            public sToast: sToast,
            public sTimeAgo: sTimeAgo,
            public sSettings: sSettings,
            public geolocation: Geolocation) {
    this.isLogin = sUser.isLogin();

    if ( this.isLogin ) {
    } else {
      this.navCtrl.setRoot(LoginPage);
    }

    this.postsId = navParams.get('id');
    // this.postsData = {'resultCode':0, 'list':[]};
  }

  ionViewDidLoad() {
    // Build an empty form for the template to render
    // Storage synchronous call(promise)
    // this.getPost();
  }

  ionViewWillEnter() {
    this.geolocation.getCurrentPosition().then((resp) => {
      this.currentLatitude = resp.coords.latitude;
      this.currentLongitude = resp.coords.longitude;
    }).catch((error) => {
      console.log('Error getting location', error);
    });

    this.getPost();
  }

  getPost() {
    var url = (_.template('/posts/item?seq=${seq}'))({'seq':this.postsId});
    this.sHttp.get(url).subscribe(
              data => {
                console.log(data);
                // 시간 transform display logic
                data.data[0].dateCreated = this.sTimeAgo.timeAgo(data.data[0].dateCreated);
                
                this.postsData = data;

                var calDistance = this.calculateDistance(this.currentLatitude,
                                      this.currentLongitude,
                                      this.postsData.data[0].latitude,
                                      this.postsData.data[0].longitude);

                this.distance = Math.floor(calDistance * 100)/100;
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

  getBackgroundSrc(index) {
    return "assets/images/background/"+index+".png";
  }

  calculateDistance(lat1, lon1, lat2, lon2) {
    var R = 6371; // km
    var dLat = this.toRadians(lat2-lat1);
    var dLon = this.toRadians(lon2-lon1);

    var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(this.toRadians(lat1)) * Math.cos(this.toRadians(lat2)) * 
            Math.sin(dLon/2) * Math.sin(dLon/2);

    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    var d = R * c;

    return d;
  }
  
  toRadians(param) {
    return param * Math.PI / 180;
  }

  createRecomm(id) {
    var url = (_.template('/posts/${seq}/recomm'))({ 'seq': id });
    this.sHttp.post(url, { '': '' }).subscribe(
      data => {
        if (data.resultCode != 0) {
          this.errorToast(data.data.msg);
        } else {
          console.log('recommend create success');
          this.getPost();
        }
      },
      // error =>  this.errorMessage = <any>error
      error => {
        this.errorMessage = <any>error;
        console.log('createRecomm errorMessage:', this.errorMessage);
        if (typeof error === 'object') {
          console.log('error.status:', error.status);
          if (error.status == 401) {
            this.events.publish('xLoginError');
          } else if (error.status == 403) {
          } else {
          }
        }

        this.sUser.remove();
        // this.navCtrl.setRoot(TabsPage);
      }
    );
  }

  goToCommentList(id) {
    this.navCtrl.push(CommentPage, { 'id': id });
  }

  errorToast(msg) {
    this.sToast.show(msg, 2000, null);
  }

  moreActionSheet(postsId, isOwner) {
    if (isOwner) {
      let ownerSheet = this.actionSheetCtrl.create({
        buttons: [
          {
            text: '삭제하기',
            role: 'destructive',
            handler: () => {
              var url = (_.template('/posts/remove?seq=${seq}'))({ 'seq': postsId });
              this.sHttp.post(url, '').subscribe(
                data => {
                  if (data.resultCode == "0") {
                    this.sToast.show('삭제되었습니다.', 2000, null);
                    this.navCtrl.pop();
                  } else {
                    this.errorToast(data.data.msg);
                  }
                },
                error => {
                  this.errorMessage = <any>error;
                  console.log('/posts/remove errorMessage:', this.errorMessage);

                  this.errorToast('삭제 중 에러가 발생하였습니다!');
                }
              );
            },
            // cssClass: 'action-button1'
          }, {
            text: '수정하기',
            handler: () => {
              this.navCtrl.setRoot(CheckmoodPage, { 'isModify': true, 'postsId': postsId });
            },
            // cssClass: 'action-button1'
          }, {
            text: '취소',
            role: 'cancel',
            // cssClass: 'action-button2'
          }
        ]
      });
      ownerSheet.present();
    }
  }
}
