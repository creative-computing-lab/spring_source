import { Component } from '@angular/core';
import { Events, NavController, PopoverController, NavParams } from 'ionic-angular';

import { NoteWritePage } from '../note-write/note-write';
import { ModalThinkChangePage } from '../modal_think_change/modal_think_change';

import { sHttp } from '../../providers/sHttp';
import  _ from 'lodash';

/*
  Generated class for the CommentDetail page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-comment-detail',
  templateUrl: 'comment-detail.html'
})
export class CommentDetailPage {

  public id:number;
  public comment = {}
  errorMessage: string;

  constructor(public navCtrl: NavController,
              public popoverCtrl: PopoverController,
              public navParams: NavParams,
              public events: Events,
              public sHttp: sHttp) {
    this.id = this.navParams.get('id');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CommentDetailPage');

    this.getComment();
  }

  getComment(){
    var url = (_.template('/comment/${id}'))({'id': this.id });
    this.sHttp.get(url).subscribe(
            data =>{
              this.comment = data.data;
            },
            // error =>  this.errorMessage = <any>error
            error => {
              this.errorMessage = <any>error;
              console.log('getComment errorMessage:', this.errorMessage);
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

  goToNoteWrite() {
    this.navCtrl.push(NoteWritePage, {'commentId':this.id});
  }

  openThinkChangeModal(commentId) {
    let popover = this.popoverCtrl.create(ModalThinkChangePage,   // definition
                                        {commentId:commentId},   // some params
                                        {cssClass: 'think-change-popover backdropOpacityPopover'});  // Popover options

    popover.present();
  }  
}
