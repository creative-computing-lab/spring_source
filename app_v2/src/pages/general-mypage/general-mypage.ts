import { Component } from '@angular/core';
import { Events, NavController, PopoverController, NavParams } from 'ionic-angular';
import { ChartsModule } from 'ng2-charts/ng2-charts';

import { NoteViewPage } from '../note-view/note-view';
import { ModalPublicChangePage } from '../modal_public_change/modal_public_change';
import { FeedPage } from '../feed/feed';
import { SetPage } from '../set/set';
import { CommentPage } from '../comment/comment';

import { sHttp } from '../../providers/sHttp';
import { sUser } from '../../providers/sUser';
import { sToast } from '../../providers/sToast';
import { sTimeAgo } from '../../providers/sTimeAgo';
import  _ from 'lodash';
/*
  Generated class for the GeneralMypage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-general-mypage',
  templateUrl: 'general-mypage.html'
})
export class GeneralMypagePage {

  mypage: string = "my_story";

  public postsList = [];
  public count: any;
  public total: any;

  public moodData = {};

  public newsData = [];
  public newsDataTotal = -1;

  public thankYouNoteList = [];
  public thankYouNoteTotal = -1;

  public errorMessage: string;

  constructor(public events: Events,
            public navCtrl: NavController,
            public popoverCtrl: PopoverController,
            public navParams: NavParams,
            public sUser: sUser,
            public sHttp: sHttp,
            public sToast: sToast,
            public sTimeAgo: sTimeAgo,
            public chart: ChartsModule) {
    // this.newsData = {'total':0, 'count':0, 'list':[]};
    // this.thankYouNoteData = {'total':0, 'count':0, 'list':[]};
  }

  ionViewDidLoad() {

  }

  ionViewDidEnter() {
    this.onChangeSegment();
  }

  getPosts(offset) {
    // this.presentLoading();
    if ( offset == 0 ) {
      this.postsList = [];
    }

    var url = (_.template('/posts/mylist?max=${max}&offset=${offset}'))
              ({'max':10, 'offset':offset});

    this.sHttp.get(url).subscribe(
              data => {
//                for ( var i=0; i < data.data.list.length; i++ ) {
//                  data.data.list[i].category = this.categoryToName(data.data.list[i].category);
//                }

                // this.postsList = data.data.list;

                // for list append
                Array.prototype.push.apply(this.postsList, data.data.list);

                this.count = data.data.count;
                this.total = data.data.total;
              },
              // error =>  this.errorMessage = <any>error
              error => {
                this.errorMessage = <any>error;
                console.log('[GeneralMypagePage]/posts/mylist errorMessage:', this.errorMessage);
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

  goToNoteView(noteId) {
    this.navCtrl.push(NoteViewPage, {'id': noteId});
  }

  goToFeed(postsId) {
    this.navCtrl.push(FeedPage, {'id':postsId});
  }

  goToCommentList(postsId) {
    this.navCtrl.push(CommentPage, { 'id': postsId });
  }

  goToNewsFeed(newsId, postsId, newsType) {
    // markAsRead process
    var url = (_.template('/feed/markAsRead?seq=${seq}'))({ 'seq': newsId });
    this.sHttp.post(url, null).subscribe(
      data => {
        if (data.resultCode != 0) {
          this.errorToast(data.data.msg);
        } else {
          console.log('/feed/markAsRead success');
        }
      },
      // error =>  this.errorMessage = <any>error
      error => {
        this.errorMessage = <any>error;
        console.log('markAsRead errorMessage:', this.errorMessage);
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

    if ( newsType == 'RECOMM' ) {
      this.goToFeed(postsId);
    } else {
      this.goToCommentList(postsId);
    }
  }

  errorToast(msg) {
    this.sToast.show(msg, 2000, null);
  }

  goToSet() {
    this.navCtrl.push(SetPage);
  }

  openMoreModal(postsId, isPrivate, isSprout, isSentThankYouNote, sproutedCommentId) {
    console.log('[openMoreModal]postsId:', postsId,
          ', isPrivate:', isPrivate,
          ', isSprout:', isSprout,
          ', isSentThankYouNote:', isSentThankYouNote,
          ', sproutedCommentId:', sproutedCommentId);

    let popover = this.popoverCtrl.create(ModalPublicChangePage,
                                        {'id':postsId,
                                        'isPrivate':isPrivate,
                                        'isSprout': isSprout,
                                        'isSentThankYouNote':isSentThankYouNote,
                                        'sproutedCommentId':sproutedCommentId},   // some params
                                        {cssClass: 'more-popover backdropOpacityPopover'});  // Popover options
    popover.present();
    popover.onDidDismiss(data => {
      this.getPosts(0);
    })
  }


  public showChart = false
  public lineChartData:Array<any> = []
  public lineChartLabels:Array<any> = []
  public lineChartType:string = 'line';
  
  public lineChartOptions = {
                                    legend: {
                                        display: false
                                    },

                              tooltips: {
                                enabled: false
                              }
                            }

  public chartClicked(e:any):void {
    console.log(e);
  }

  public chartHovered(e:any):void {
    console.log(e);
  }

  onChangeSegment() {
    console.log("onChangeSegment "+this.mypage)
    if(this.mypage == 'my_story') {
      this.getPosts(0);
    } else if(this.mypage == 'mood_statistics') {
      this.getMood(0);
    } else if(this.mypage == 'news') {
      this.getNews(0);
    } else if(this.mypage == 'thank_you_note') {
      this.getThankYouNote(0);
    }
  }

  getMood(offset) {
    var url = (_.template('/mood/mylist?max=${max}&offset=${offset}'))
              ({'max':10, 'offset':offset});

    this.sHttp.get(url).subscribe(
              data => {
                 if ( data.resultCode == "0" ) {
                  this.showChart = true;
                  this.generateMoodData(data.data);
                 } else {
                 //this.errorToast(data.data.msg);
                 }

              },
              // error =>  this.errorMessage = <any>error
              error => {
                this.errorMessage = <any>error;
                console.log('[GeneralMypagePage]/mood/mylist errorMessage:', this.errorMessage);
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

  generateMoodData(data) {
    //let data = this.moodData;
    this.lineChartData = [];
    this.lineChartLabels = [];

    this.lineChartData = _.map(data, 'moodValue')
    this.lineChartLabels = _.map(data, 'lastUpdatedDate')

    console.log(this.lineChartData);
    console.log(this.lineChartLabels);
/*
    let temp = _.groupBy(data.list, 'postsId');
    _.forEach(temp, itemList => {
      let tempArray = [];
      _.forEach(itemList, item => {
        tempArray.push(item['moodValue'])
      });
      this.lineChartData.push(tempArray);
    });
    this.lineChartLabels = _.keys(temp);


    */
  }

  getNews(offset) {
    var url = (_.template('/feed/mylist?max=${max}&offset=${offset}'))
              ({'max':10, 'offset':offset});

    this.sHttp.get(url).subscribe(
              data => {
                // this.newsData = data.data;
                // Array.prototype.push.apply(this.newsData, data.data);

                // 시간 transform display logic
                for ( var i=0; i < data.data.list.length; i++ ) {
                  data.data.list[i].dateCreated = this.sTimeAgo.timeAgo(data.data.list[i].dateCreated);
                }

                let list = data.data.list;
                if(this.newsData.length == 0) {
                  this.newsData = Object.assign(this.newsData, list);
                } else {
                    for(let i=0,max=list.length;i<max;i++) {
                    this.newsData[offset+i] = list[i];
                  }
                }

                this.newsDataTotal = data.data.total;
              },
              // error =>  this.errorMessage = <any>error
              error => {
                this.errorMessage = <any>error;
                console.log('[GeneralMypagePage]/feed/mylist errorMessage:', this.errorMessage);
                if ( typeof error === 'object') {
                  console.log('error.status:', error.status);
                  if ( error.status == 401 ) {
                    // this.events.publish('xLoginError');
                  } else if ( error.status == 403 ) {
                  } else {
                  }
                }
              }
    );
  }

   getThankYouNote(offset) {
      if ( offset == 0 ) {
        this.thankYouNoteList = [];
      }

      var url = (_.template('/thankYouNote/mylist?max=${max}&offset=${offset}'))
                ({'max':10, 'offset':offset});

      this.sHttp.get(url).subscribe(
                data => {
                  // 시간 transform display logic
                  for ( var i=0; i < data.data.list.length; i++ ) {
                    data.data.list[i].dateCreated = this.sTimeAgo.timeAgo(data.data.list[i].dateCreated);
                  }
                  Array.prototype.push.apply(this.thankYouNoteList, data.data.list);

                  this.thankYouNoteTotal = data.data.total;
                },
                // error =>  this.errorMessage = <any>error
                error => {
                  this.errorMessage = <any>error;
                  console.log('[GeneralMypagePage]/thankYouNote/mylist errorMessage:', this.errorMessage);
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

  ngOnInit() {
    this.events.subscribe('xViewReload', () => {
      // console.log('xViewReload subscribe');
      this.getPosts(0);
    });
  }

  ngOnDestroy() {
    this.events.unsubscribe('xViewReload');
  }
}
