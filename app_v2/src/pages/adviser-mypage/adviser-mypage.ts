import { Component } from '@angular/core';
import { Events, NavController, NavParams } from 'ionic-angular';

import { NoteViewPage } from '../note-view/note-view';
import { FeedPage } from '../feed/feed';
import { SetPage } from '../set/set';
import { CommentPage } from '../comment/comment';

import { sHttp } from '../../providers/sHttp';
import { sUser } from '../../providers/sUser';
import { sToast } from '../../providers/sToast';
import { sTimeAgo } from '../../providers/sTimeAgo';
import  _ from 'lodash';
/*
  Generated class for the AdviserMypage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-adviser-mypage',
  templateUrl: 'adviser-mypage.html'
})
export class AdviserMypagePage {

  adviserMypage : string = "my_story";

  public postsData = {};
  public postsCount:string = '0';
  public sproutCount : string = '0';
  
  public newsData = [];
  public newsDataTotal = -1;
  
  public thankYouNoteList = [];
  public thankYouNoteTotal = -1;

  public errorMessage: string;

  constructor(public events: Events,
            public navCtrl: NavController,
            public navParams: NavParams,
            public sHttp: sHttp,
            public sUser: sUser,
            public sToast: sToast,
            public sTimeAgo: sTimeAgo) {
    this.postsData = {'total':0, 'count':0, 'list':[]};
    // this.newsData = {'total':0, 'count':0, 'list':[]};
    // this.thankYouNoteData = {'total':0, 'count':0, 'list':[]};
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AdviserMypagePage');
  }

  ionViewDidEnter() {
    this.getCount();
    this.onChangeSegment();
  }

  goToNoteView(noteId) {
    // markAsRead process
    var url = (_.template('/thankYouNote/markAsRead?seq=${seq}'))({ 'seq': noteId });
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

    this.navCtrl.push(NoteViewPage, {'id':noteId});
  }

  goToFeed(postsId) {
    this.navCtrl.push(FeedPage, {'id':postsId});
  }
  
  goToSet() {
    this.navCtrl.push(SetPage);
  }

  onChangeSegment() {
    console.log("onChangeSegment "+this.adviserMypage)
    if (this.adviserMypage == 'my_story' ) {
      this.getPosts(0);
    } else if ( this.adviserMypage == 'adviser_news' ) {
      this.getNews(0);
    } else if (this.adviserMypage == 'receive_thankyou_note' ) {
      this.getThankYouNote(0);
    }
  }

  getCount() {
    var url = '/posts/myCounselingCount';
    this.sHttp.get(url).subscribe(
      data => {
        if ( data.resultCode == "0" ) {
          this.postsCount = data.data.postsCount;
          this.sproutCount = data.data.sproutCount;
        } else {
          this.errorToast(data.data.msg);
        }
      },
      error => {
        this.errorMessage = <any>error;
        console.log('[AdviserMypagePage]/posts/myCounselingCount errorMessage:', this.errorMessage);
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

  getPosts(offset) {
    if ( offset == 0 ) {
      this.postsData = {'total':0, 'count':0, 'list':[]};

    }

    var url = (_.template('/posts/myCounselinglist?max=${max}&offset=${offset}'))
              ({'max':10, 'offset':offset});
    this.sHttp.get(url).subscribe(
      data => {
        if ( data.resultCode == "0" ) {
          this.postsData = data.data;
        } else {
          this.errorToast(data.data.msg);
        }
      },
      error => {
        this.errorMessage = <any>error;
        console.log('[AdviserMypagePage]/posts/myCounselinglist errorMessage:', this.errorMessage);
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

  getNews(offset) {
    var url = (_.template('/feed/mylist?max=${max}&offset=${offset}'))
              ({'max':10, 'offset':offset});

    this.sHttp.get(url).subscribe(
              data => {
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

                // this.sUser.remove();
                // this.navCtrl.setRoot(LoginPage);
              }
    );
  }

  getThankYouNote(offset) {
    if ( offset == 0 ) {
      this.thankYouNoteList = [];
    }

    var url = (_.template('/thankYouNote/myRecvlist?max=${max}&offset=${offset}'))
              ({'max':10, 'offset':offset});

    this.sHttp.get(url).subscribe(
              data => {
                  for ( var i=0; i < data.data.list.length; i++ ) {
                    data.data.list[i].dateCreated = this.sTimeAgo.timeAgo(data.data.list[i].dateCreated);
                  }
                  Array.prototype.push.apply(this.thankYouNoteList, data.data.list);

                  this.thankYouNoteTotal = data.data.total;
              },
            // error =>  this.errorMessage = <any>error
            error => {
              this.errorMessage = <any>error;
              console.log('[AdviserMypagePage]/thankYouNote/myRecvlist errorMessage:', this.errorMessage);
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

    this.navCtrl.push(CommentPage, { 'id': postsId });
  }

  errorToast(msg) {
    this.sToast.show(msg, 2000, null);
  }
}
