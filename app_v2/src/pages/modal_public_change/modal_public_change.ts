import {Component} from '@angular/core';
import {Events, ViewController, NavController, NavParams} from 'ionic-angular';

import { NoteWritePage } from '../note-write/note-write';

import { sHttp } from '../../providers/sHttp';
import { sToast } from '../../providers/sToast';
import  _ from 'lodash';
@Component({
  templateUrl: 'modal_public_change.html'
})

export class ModalPublicChangePage {

  private postsId;
  private isPrivate;
  private isSprout;
  private isSentThankYouNote;
  private sproutedCommentId;

  public errorMessage: string;

  public changePrivate: boolean = true;

  constructor(public viewCtrl: ViewController,
              public navCtrl: NavController,
              public params: NavParams,
              public events: Events,
              public sHttp: sHttp,
              public sToast: sToast) {
    this.postsId = this.params.get('id');
    this.isPrivate = this.params.get('isPrivate');
    this.isSprout = this.params.get('isSprout');
    this.isSentThankYouNote = this.params.get('isSentThankYouNote');
    this.sproutedCommentId = this.params.get('sproutedCommentId');

    console.log('postsId:', this.postsId,
              ', isPrivate:', this.isPrivate,
              ', isSprout:', this.isSprout,
              ', isSentThankYouNote:', this.isSentThankYouNote,
              ', sproutedCommentId:', this.sproutedCommentId);
  }

  delete() {
    var url = (_.template('/posts/remove?seq=${seq}'))({'seq': this.postsId});
    this.sHttp.post(url,'').subscribe(
                  data => {
                    if ( data.resultCode == "0" ) {
                      this.sToast.show('삭제되었습니다.', 2000, null);
                      this.viewCtrl.dismiss();
                    } else {
                      this.errorToast(data.data.msg);
                    }
                  },
                  error => {
                    console.log('/posts/remove error');
                    this.errorToast('삭제 중 에러가 발생하였습니다!');
                  }
    );
  }

  privatePublicChange(isPrivate) {
    const updateBody = {isPrivate:isPrivate};

    // this.sHttp.post('/posts/update/${seq}', updateBody).subscribe(
    var successMessage = '';
    if ( isPrivate ) {
      successMessage = '비공개로';
    } else {
      successMessage = '공개로';
    }

    var url = (_.template('/posts/update?seq=${postsSeq}'))({'postsSeq': this.postsId});
    this.sHttp.post(url, {posts : updateBody}).subscribe(
            data => {
              if ( data.resultCode == "0" ) {
                this.sToast.show(successMessage + ' 변경되었습니다.', 2000, null);
                this.viewCtrl.dismiss();
              } else {
                this.errorToast(data.data.msg);
              }
            },
            error => {
              this.errorMessage = <any>error;
              console.log('/posts/update?seq=${postsSeq} errorMessage:', this.errorMessage);

              this.errorToast('비공개로 전환중 에러가 발생하였습니다!');
            }
    );
  }

  sendThankYouNote() {
    this.navCtrl.push(NoteWritePage, {'commentId':this.sproutedCommentId});
    this.viewCtrl.dismiss();
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  errorToast(msg) {
    this.sToast.show(msg, 2000, null);
  }
}
