import { Component } from '@angular/core';
import { Events, NavController, NavParams, Platform } from 'ionic-angular';

import { sHttp } from '../../providers/sHttp';
import { sToast } from '../../providers/sToast';

import  _ from 'lodash';
/*
  Generated class for the NoteWrite page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-note-write',
  templateUrl: 'note-write.html'
})
export class NoteWritePage {

  public commentId:number;
  public body: string;
  errorMessage: string;

  public isIos: boolean = false;
  public preViewIndex: number;

  constructor(public navCtrl: NavController,
            public navParams: NavParams,
            public platform: Platform,
            public sHttp: sHttp,
            public sToast: sToast,
            public events: Events) {
    this.commentId = this.navParams.get('commentId');
    this.preViewIndex = this.navParams.get('preViewIndex');

    this.isIos = platform.is('ios');
  }

  ionViewDidLoad() {
    // console.log('ionViewDidLoad NoteWritePage');
  }

  create() {
    if ( this.body.length > 0 ) {
      var url = (_.template('/comment/${commentSeq}/thankNote/create'))({'commentSeq': this.commentId});
      this.sHttp.post(url,{'body':this.body}).subscribe(
        data=>{
          if ( data.resultCode == "0" ) {
            this.events.publish('xViewReload');
            
            this.showToast('땡큐노트가 작성되었습니다!');

            this.navCtrl.remove(this.preViewIndex);
            this.navCtrl.pop(); // success
            // this.navCtrl.push(CommentPage, { 'id': this.commentId });
            // this.app.getRootNav().setRoot(TabsPage);
            // this.navCtrl.setRoot(TabsPage);
          } else {
            this.showToast('땡큐노트 작성중 에러가 발생하였습니다!');
          }
        }, error => {
            console.log('/comment/${commentSeq}/thankNote/create error');
            this.showToast('땡큐노트 작성중 에러가 발생하였습니다!');
        }
      );
      this.body = "";
    }
  }

  showToast(message) {
    this.sToast.show(message, 2000, null);
  }
}
