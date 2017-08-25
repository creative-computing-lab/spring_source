import {Component} from '@angular/core';
import {Events, ViewController, NavParams} from 'ionic-angular';

@Component({
  templateUrl: 'modal_find_password.html'
})

export class ModalFindPasswordPage {

  public newpassword : string;

  constructor(public viewCtrl: ViewController, params: NavParams, public events: Events) {
    this.newpassword = params.get('newpassword');
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }
}
