import { Component } from '@angular/core';
import { App, Events, NavController, PopoverController, ActionSheetController, LoadingController, Platform, Slides } from 'ionic-angular';
// import { Splashscreen } from 'ionic-native';
import { ViewChild } from '@angular/core';

// import { LocationTracker } from '../../providers/location-tracker';
import { Geolocation } from '@ionic-native/geolocation';

import { CheckmoodPage } from '../checkmood/checkmood';
import { DescriptionPage } from '../description/description';
import { CommentPage } from '../comment/comment';
import { SettingsPage } from '../settings/settings';
import { TabsPage } from '../tabs/tabs';

import { sHttp } from '../../providers/sHttp';
import { sUser } from '../../providers/sUser';
import { sToast } from '../../providers/sToast';
import { sTimeAgo } from '../../providers/sTimeAgo';
import  _ from 'lodash';
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  @ViewChild(Slides) slides: Slides;
  public currentIndex: number = 0;

  public postsList = [];
  public id;
  public nextOffset: number = 0;
  public total: number = 0;
  private max: number = 5;
  public errorMessage: string;

  public isLoading: boolean = false;
  public showSkip = true;

  //public isLogin: boolean;
  public isOwner: boolean = false;

  public changePrivate: boolean = true;


  public currentLatitude: any = 37.576149;
  public currentLongitude: any = 126.976901;

  constructor(public app: App,
              public events: Events,
              public navCtrl: NavController,
              public popoverCtrl: PopoverController,
              public actionSheetCtrl: ActionSheetController,
              public loadingCtrl: LoadingController,
              public platform: Platform,
              public sUser: sUser,
              public sHttp: sHttp,
              public sToast: sToast,
              public sTimeAgo: sTimeAgo,
              public geolocation: Geolocation) {
    // console.log('constructor HomePage');
  }

  ionViewDidLoad() {
    // console.log('ionViewDidLoad HomePage');
    //this.getPosts(0);
  }

  ionViewWillEnter() {
    // Build an empty form for the template to render
    // console.log('ionViewWillEnter HomePage');
    this.getCurrentPosition();
    this.postsList = [];
    this.getPosts(0);
  }

  ionViewDidEnter() {
    // console.log('ionViewWillEnter HomePage');
    //this.sHttp.validate();
  }

  getCurrentPosition() {
    this.geolocation.getCurrentPosition().then((resp) => {
      this.currentLatitude = resp.coords.latitude;
      this.currentLongitude = resp.coords.longitude;
      // console.log(this.currentLatitude + ', ' + this.currentLongitude);
    }).catch((error) => {
      console.log('Error getting location', error);
    });
  }

  nextPosts() {
    if (this.nextOffset < this.total) {
      this.getPosts(this.nextOffset);
    }
  }

  updatePosts(updateIndex) {
    this.getPosts(updateIndex);
  }

  getPosts(offset) {
    // this.presentLoading();
    var url = (_.template('/posts/list?max=${max}&offset=${offset}&sort=${sort}&order=${order}'))
      ({ 'max': this.max, 'offset': offset, 'sort': 'lastUpdated', 'order': 'desc' });

    this.sHttp.get(url).map(data => this.mapResult(data)).subscribe(
      data => {
        // 시간 transform display logic
        for ( var i=0; i < data.data.list.length; i++ ) {
          data.data.list[i].dateCreated = this.sTimeAgo.timeAgo(data.data.list[i].dateCreated);
        }

        let list = data.data.list;
        if (this.nextOffset == 0) {
          this.postsList = Object.assign(this.postsList, list);
        } else {
          for (let i = 0, max = list.length; i < max; i++) {
            this.postsList[offset + i] = list[i];
          }
        }

        this.nextOffset = this.postsList.length;
        this.total = data.data.total;
        this.updateSlide();
      },
      // error =>  this.errorMessage = <any>error
      error => {
        this.errorMessage = <any>error;
        console.log('getPosts errorMessage:', this.errorMessage);
        if (typeof error === 'object') {
          console.log('error.status:', error.status);
          if (error.status == 401) {
            this.events.publish('xLoginError');
          } else if (error.status == 403) {
          } else {
          }
        }

        this.sUser.remove();
        this.navCtrl.setRoot(TabsPage);
      }
    );
  }

  private mapResult(data) {
    for (let i in data.data.list) {
      var calDistance = this.calculateDistance(this.currentLatitude,
        this.currentLongitude,
        data.data.list[i].latitude,
        data.data.list[i].longitude);
      data.data.list[i].distance = Math.floor(calDistance * 100) / 100;
      // console.log('distance:', data.data.list[i].distance);
    }
    return data;
  }

  goToDescription() {
    this.navCtrl.push(DescriptionPage);
  }

  goToCommentList(id) {
    this.id = id;
    this.navCtrl.push(CommentPage, { 'id': this.id });
  }

  goToSettings() {
    this.navCtrl.push(SettingsPage);
  }

  recomm(index) {
    if (this.sUser.isLogin()) {
      if(this.isLoading) { return; }
      this.isLoading = true;

      let id = this.postsList[index].id;
      var url = (_.template('/posts/${seq}/recomm'))({ 'seq': id });
      this.sHttp.post(url, { '': '' }).subscribe(
        data => {
          this.isLoading = false;
          if (data.resultCode != 0) {
            this.errorToast(data.data.msg);
          } else {
            console.log('recommend create success');
            //this.updatePosts(updateIndex);
            this.postsList[index].isRecomm = true;
            this.postsList[index].recommTotal++;
          }
        },
        error => {
          this.isLoading = false;
          this.errorMessage = <any>error;
          console.log('createRecomm errorMessage:', this.errorMessage);
          if (this.errorMessage == '403 - Forbidden') {
            this.sToast.show('공감은 로그인 후 사용 가능합니다.', 2000, null);
          }
        }
      );
    } else {
      this.sToast.show('공감은 로그인 후 사용 가능합니다.', 2000, null);
    }
  }


  cancelRecomm(index) {
    if (this.sUser.isLogin()) {
      if(this.isLoading) { return; }
      this.isLoading = true;
      
      let id = this.postsList[index].id;
      var url = (_.template('/posts/${seq}/cancelRecomm'))({ 'seq': id });
      this.sHttp.post(url, { '': '' }).subscribe(
        data => {
          this.isLoading = false;
          if (data.resultCode != 0) {
            this.errorToast(data.data.msg);
          } else {
            console.log('cancelRecomm success');
            //this.updatePosts(updateIndex);
            this.postsList[index].isRecomm = false;
            this.postsList[index].recommTotal--;
            if(this.postsList[index].recommTotal < 0) {
              this.postsList[index].recommTotal = 0;
            }
          }
        },
        error => {
          this.isLoading = false;
          this.errorMessage = <any>error;
          console.log('cancelRecomm errorMessage:', this.errorMessage);
        }
      );
    }
  }

  processOppose(id) {
    if (this.sUser.isLogin()) {
      var url = (_.template('/posts/${seq}/oppose'))({ 'seq': id });
      this.sHttp.post(url, null).subscribe(
        data => {
          if (data.resultCode != 0) {
            this.errorToast(data.data.msg);
          } else {
            console.log('oppose create success');
            this.sToast.show('부적절한 글로 신고하였습니다.', 2000, null);
            //this.getPosts(0);
          }
        },
        // error =>  this.errorMessage = <any>error
        error => {
          this.errorMessage = <any>error;
          console.log('processOppose errorMessage:', this.errorMessage);
          if (typeof error === 'object') {
            console.log('error.status:', error.status);
            if (error.status == 401) {
              this.events.publish('xLoginError');
            } else if (error.status == 403) {
            } else {
            }
          }
        }
      );
    } else {
      this.sToast.show('로그인 후 사용 가능합니다.', 2000, null);
    }
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
                    this.postsList = [];
                    this.getPosts(0);
                    // this.navCtrl.setRoot(TabsPage);
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
              this.app.getRootNav().setRoot(CheckmoodPage, { 'isModify': true, 'postsId': postsId });
            },
            // cssClass: 'action-button1'
          }, {
            text: '비공개로 바꾸기',
            handler: () => {
              const updateBody = { isPrivate: this.changePrivate };

              // this.sHttp.post('/posts/update/${seq}', updateBody).subscribe(

              var url = (_.template('/posts/update?seq=${postsSeq}'))({ 'postsSeq': postsId });
              this.sHttp.post(url, { posts: updateBody }).subscribe(
                data => {
                  if (data.resultCode == "0") {
                    this.sToast.show('비공개로 변경되었습니다.', 2000, null);
                    this.postsList = [];
                    this.getPosts(0);
                    // this.navCtrl.setRoot(TabsPage);
                  } else {
                    this.errorToast(data.data.msg);
                  }
                },
                error => {
                  this.errorMessage = <any>error;
                  console.log('/posts/update?seq=${postsSeq} errorMessage:', this.errorMessage);

                  this.errorToast('비공개로 전환중 에러가 발생하였습니다!');
                });
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
    } else {
      let otherSheet = this.actionSheetCtrl.create({
        buttons: [
          {
            text: '부적절한 글이예요',
            role: 'destructive',
            handler: () => {
              console.log('Destructive clicked');
              this.processOppose(postsId);
            },
            // cssClass: 'action-button1'
          }, {
            text: '취소',
            role: 'cancel',
            handler: () => {
              console.log('Cancel clicked');
            },
            // cssClass: 'action-button2'
          }
        ]
      });
      otherSheet.present();
    }
  }

  // slide
  onSlideChangeStart(slider: Slides) {
    this.showSkip = !slider.isEnd();
  }

  slideChanged() {
    let currentIndex = this.slides.getActiveIndex();
    console.log("Current index is", currentIndex);

    // Need?
    if (this.postsList[currentIndex] != undefined) {
      this.isOwner = this.postsList[currentIndex].isOwner;
      // 현재 화면
      this.currentIndex = currentIndex;
    }

    // 다음 슬라이드가 마지막이라면,
    if (this.nextOffset > 0 && currentIndex + 2 >= this.nextOffset) {
      this.nextPosts();
    }
  }
  //! slide

  getBackgroundSrc(index) {
    return "assets/images/background/" + index + ".png";
  }

  errorToast(msg) {
    this.sToast.show(msg, 2000, null);
  }

  calculateDistance(lat1, lon1, lat2, lon2) {
    var R = 6371; // km
    var dLat = this.toRadians(lat2 - lat1);
    var dLon = this.toRadians(lon2 - lon1);

    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRadians(lat1)) * Math.cos(this.toRadians(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);

    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c;

    return d;
  }

  toRadians(param) {
    return param * Math.PI / 180;
  }

  updateSlide() {
    this.slides.update()

    let index = this.slides.getActiveIndex();
    let postsLength = this.postsList.length
    if (index >= postsLength) {
      this.slides.slideTo(postsLength - 1);
    }
  }
}
