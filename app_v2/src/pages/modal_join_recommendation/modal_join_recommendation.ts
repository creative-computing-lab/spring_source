import {Component} from '@angular/core';
import {Events, ViewController, NavParams} from 'ionic-angular';

@Component({
  templateUrl: 'modal_join_recommendation.html'
})

export class ModalJoinRecommendationPage {

  constructor(public viewCtrl: ViewController, params: NavParams, public events: Events) {

  }

  dismiss() {
    this.viewCtrl.dismiss();
  }
}
