import { Component } from '@angular/core';
import { Events, NavController, ViewController, NavParams } from 'ionic-angular';

@Component({
  templateUrl: 'modal_thank_you_guide.html'
})

export class ModalThankYouGuidePage {

  public commentId:number;

  constructor(public navCtrl: NavController,
            public viewCtrl: ViewController,
            public navParams: NavParams,
            public events: Events) {
    this.commentId = this.navParams.get('commentId');
  }

  goToOk() {
    this.viewCtrl.dismiss();
  }
}
