import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { CheckmoodPage } from '../checkmood/checkmood';
import { TabsPage } from '../tabs/tabs';

/*
  Generated class for the Welcome page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-welcome',
  templateUrl: 'welcome.html'
})
export class WelcomePage {

  constructor(public navCtrl: NavController,
            public navParams: NavParams) {}

  ionViewDidLoad() {
  }

  goWrite() {
    // console.log("goWrite1");
    this.navCtrl.setRoot(CheckmoodPage);
  }

  close() {
    this.navCtrl.setRoot(TabsPage);
  }
}
