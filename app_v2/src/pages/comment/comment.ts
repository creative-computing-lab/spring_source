import { Component, ChangeDetectorRef } from '@angular/core';
import { NavController, PopoverController, NavParams, Events } from 'ionic-angular';

import { CommentDetailPage } from '../comment-detail/comment-detail';
import { ModalThinkChangePage } from '../modal_think_change/modal_think_change';

import { sUser } from '../../providers/sUser';
import { sHttp } from '../../providers/sHttp';
import { sToast } from '../../providers/sToast';
import { sTimeAgo } from '../../providers/sTimeAgo';
import _ from 'lodash';
/*
  Generated class for the Comment page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-comment',
  templateUrl: 'comment.html'
})
export class CommentPage {
  // base_url = Config.url;

  public postsId: number;
  public comments = [];
  public commentTotal = -1;
  public body: string = '';
  errorMessage: string;

  public isLogin: boolean;
  public isCounselor: boolean = false;
  public isOwner: boolean = false;

  constructor(public navCtrl: NavController,
    public popoverCtrl: PopoverController,
    public navParams: NavParams,
    public events: Events,
    public sHttp: sHttp,
    public sUser: sUser,
    public sToast: sToast,
    public sTimeAgo: sTimeAgo,
    public changeDetectorRef: ChangeDetectorRef) {
    //this.listenToLoginEvents();

    this.postsId = this.navParams.get('id');
    /*
    this.isLogin = sUser.isLogin();

    console.log('CommentPage login:', this.isLogin);
    console.log('CommentPage user role:', sUser.getRole());
    if (this.isLogin && sUser.getRole() == 'ROLE_COUNSELOR') {
      this.isCounselor = true;
    }
    */
  }

  ionViewDidLoad() {
    this.getCommentList(0);
    //  this.getOwnerByPostId();
  }

  ionViewWillEnter() {
    this.isLogin = this.sUser.isLogin();

    console.log('CommentPage login:', this.isLogin);
    console.log('CommentPage user role:', this.sUser.getRole());
    if (this.isLogin && this.sUser.getRole() == 'ROLE_COUNSELOR') {
      this.isCounselor = true;
    }
  }

  ionViewDidLeave() {
    console.log('CommentPage ionViewDidLeave');
    this.isCounselor = false;
  }

  goToCommentDetail(id) {
    this.navCtrl.push(CommentDetailPage, { 'id': id });
  }

  getCommentList(offset) {
    var url = (_.template('/posts/${id}/comment/list?max=${max}&offset=${offset}&order=desc'))({ 'id': this.postsId, 'max': 10, 'offset': offset });

    this.sHttp.get(url).subscribe(
      data => {
        // 댓글 시간 transform display logic
        for ( var i=0; i < data.data.list.length; i++ ) {
          data.data.list[i].lastUpdated = this.sTimeAgo.timeAgo(data.data.list[i].lastUpdated);
        }

        //Array.prototype.push.apply(this.comments, data.data.list);
        let list = data.data.list;
        if(this.comments.length == 0) {
          this.comments = Object.assign(this.comments, list);
        } else {
          for(let i=0,max=list.length;i<max;i++) {
            this.comments[offset+i] = list[i];
          }
        }

        this.commentTotal = data.data.total;
        this.isOwner = data.data.isOwner;
      },
      // error =>  this.errorMessage = <any>error
      error => {
        this.errorMessage = <any>error;
        console.log('getCommentList errorMessage:', this.errorMessage);
        if (typeof error === 'object') {
          console.log('error.status:', error.status);
          if (error.status == 401) {
            this.events.publish('xLoginError');
          } else if (error.status == 403) {
          } else {
          }
        }

        // this.sUser.remove();
        // this.navCtrl.setRoot(LoginPage);
      }
    );
  }

  getOwnerByPostId() {
    var url = (_.template('/posts/item?seq=${seq}'))({ 'seq': this.postsId });
    this.sHttp.get(url).subscribe(
      data => {
        // Need getUsername
        console.log('posts/item owner', data.data.owner);
        console.log('sUser.name:', this.sUser.getUsername());

        if (data.data.owner == this.sUser.getUsername()) {
          this.isOwner = true;
        }
      },
      // error =>  this.errorMessage = <any>error
      error => {
        this.errorMessage = <any>error;
        console.log('/posts/item?seq=${seq} errorMessage:', this.errorMessage);
        if (typeof error === 'object') {
          console.log('error.status:', error.status);
          if (error.status == 401) {
            this.events.publish('xLoginError');
          } else if (error.status == 403) {
          } else {
          }
        }

        // this.sUser.remove();
        // this.navCtrl.setRoot(LoginPage);
      }
    );
  }

  create() {
    if (this.body.length > 0) {
      var url = (_.template('/comment/create?postsSeq=${postsSeq}'))({ 'postsSeq': this.postsId });
      this.sHttp.post(url, { 'body': this.body }).subscribe(
        data => {
          this.comments = [];
          this.getCommentList(0);
          // this.ngAfterViewInit();
        },
        // error =>  this.errorMessage = <any>error
        error => {
          this.errorMessage = <any>error;
          console.log('/comment/create?postsSeq=${postsSeq} errorMessage:', this.errorMessage);
          if (typeof error === 'object') {
            console.log('error.status:', error.status);
            if (error.status == 401) {
              this.events.publish('xLoginError');
            } else if (error.status == 403) {
            } else {
            }
          }

          // this.sUser.remove();
          // this.navCtrl.setRoot(LoginPage);
        }
      );
      this.body = "";
    }
  }

  ngOnInit() {
    this.events.subscribe('xLoginSuccess', () => {
      this.isLogin = true;
    });
    this.events.subscribe('xLoginError', () => {
      this.isLogin = false
    });
    this.events.subscribe('xViewReload', () => {
      this.comments = [];
      this.getCommentList(0);
      // this.ngAfterViewInit();
    });
    
  }

  ngOnDestroy() {
    this.events.unsubscribe('xLoginSuccess');
    this.events.unsubscribe('xLoginError');
    this.events.unsubscribe('xViewReload');
  }

  ngAfterViewInit() {
    console.log('ngAfterViewInit');
    /*
    window.setTimeout(() =>
      this.changeDetectorRef.detectChanges()
    );
    */
    setTimeout(() => {
      // this.getCommentList(0);
      this.changeDetectorRef.detectChanges();
    }, 1);
    // this.getCommentList(0);
    // this.changeDetectorRef.detectChanges();
  }

  openThinkChangeModal(commentId) {
    // 새싹(댓글 채택)
    let popover = this.popoverCtrl.create(ModalThinkChangePage,   // definition
      { postsId: this.postsId, commentId: commentId },   // some params
      { cssClass: 'think-change-popover backdropOpacityPopover' });  // Popover options

    popover.present();
  }

  loginSuccess() {
    this.sToast.show('로그인에 성공하였습니다.', 2000, null);
  }

  recomm(commentId) {
    if (this.sUser.isLogin()) {
      var url = (_.template('/comment/${id}/recomm'))({ 'id': commentId });
      this.sHttp.post(url, { '': '' }).subscribe(
        data => {
          if (data.resultCode != 0) {
            this.errorToast(data.data.msg);
          } else {
            this.updateCommentInfo(commentId);
          }
        },
        error => {
          this.errorMessage = <any>error;
          console.log('recomm errorMessage:', this.errorMessage);
          if (this.errorMessage == '403 - Forbidden') {
            this.sToast.show('공감은 로그인 후 사용 가능합니다.', 2000, null);
          }
        }
      );
    } else {
      this.sToast.show('공감은 로그인 후 사용 가능합니다.', 2000, null);
    }
  }

  cancelRecomm(commentId) {
    var url = (_.template('/comment/${id}/cancelRecomm'))({ 'id': commentId });
    this.sHttp.post(url, { '': '' }).subscribe(
      data => {
        if (data.resultCode != 0) {
          this.errorToast(data.data.msg);
        } else {
          this.updateCommentInfo(commentId);
        }
      },
      error => {
        this.errorMessage = <any>error;
        console.log('cancelRecomm errorMessage:', this.errorMessage);
      }
    );
  }

  updateCommentInfo(commentId) {
    var url = (_.template('/comment/item/${id}'))({ 'id': commentId });

    this.sHttp.get(url).subscribe(
        data => {
          data.data.lastUpdated = this.sTimeAgo.timeAgo(data.data.lastUpdated);

          for(let i=0; i<this.comments.length; i++) {
            if ( this.comments[i].id == data.data.id ) {
              this.comments[i] = data.data;
              break;
            }
          }
        },
        error => {
          this.errorMessage = <any>error;
          console.log('updateCommentInfo errorMessage:', this.errorMessage);
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
  }

  errorToast(msg) {
    this.sToast.show(msg, 2000, null);
  }
}
