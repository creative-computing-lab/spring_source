import {Component} from '@angular/core';
import {Events, ViewController, PopoverController, NavParams} from 'ionic-angular';
import { ModalThankYouNotePage } from '../modal_thank_you_note/modal_thank_you_note';
import { sHttp } from '../../providers/sHttp';
import  _ from 'lodash';
@Component({
  selector: 'page-modal_think_change',
  templateUrl: 'modal_think_change.html'
})

export class ModalThinkChangePage {

  // private posts : any;
  // private comment : any;
  private moodValue : number = 0;
  private postsId : number;
  private commentId : number;

  public postsData = {'resultCode':0, 'data':[]};

  errorMessage: string;

  constructor(public viewCtrl: ViewController,
            public popoverCtrl: PopoverController,
            public navParams: NavParams,
            public events: Events,
            public sHttp: sHttp) {

    this.postsId = this.navParams.get('postsId');
    this.commentId = this.navParams.get('commentId');
  }

  ionViewDidLoad() {
    // console.log('ionViewDidLoad ModalThinkChangePage');
  }

  ionViewWillEnter() {
    this.getPost();
  }

  getPost() {
    var url = (_.template('/posts/item?seq=${seq}'))({'seq':this.postsId});
    this.sHttp.get(url).subscribe(
              data => {
                console.log(data);
                this.postsData = data;

                this.moodValue = this.postsData.data[0].moodValue;
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

  dismiss() {
    this.viewCtrl.dismiss();
  }

  openThankYouNoteModal() {
    this.viewCtrl.dismiss();

    console.log('moodValue:', this.moodValue);

    var mood = {'moodValue':this.moodValue}
    var url = (_.template('/comment/sprout/${commentId}'))({'commentId': this.commentId});
    this.sHttp.post(url, {'mood':mood}).subscribe(
              data=>{
              },
              // error =>  this.errorMessage = <any>error
              error => {
                this.errorMessage = <any>error;
                console.log('[ModalThinkChangePage]/comment/sprout/${commentId} errorMessage:', this.errorMessage);
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

    let popover = this.popoverCtrl.create(ModalThankYouNotePage,   // definition
                                      {commentId:this.commentId},   // some params
                                      {cssClass: 'thank_you_note-popover backdropOpacityPopover'});  // Popover options
    popover.present();

    popover.onDidDismiss(data => {
      console.log('ModalThankYouNotePage dismiss');
    })
  }
}
