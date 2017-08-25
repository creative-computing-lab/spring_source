import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { CheckmoodPage } from '../checkmood/checkmood';
import { GeneraljoinPage } from '../generaljoin/generaljoin';
import { AdviserjoinPage } from '../adviserjoin/adviserjoin';
import { TabsPage } from '../tabs/tabs';

import { sUser } from '../../providers/sUser';

/*
  Generated class for the Userselection page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-userselection',
  templateUrl: 'userselection.html'
})
export class UserselectionPage {

  public isLogin : boolean;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public sUser: sUser
              ) {
    this.isLogin = sUser.isLogin();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad UserselectionPage');
  }


  ionViewWillEnter() {
    console.log('ionViewWillEnter UserselectionPage');
    if ( this.isLogin ) {
      console.log('login');
      this.navCtrl.setRoot(TabsPage);
    } else {
    }
  }

  goToCheckmood() {
    this.navCtrl.push(CheckmoodPage);
  }

  goToGeneraljoin() {
    this.navCtrl.push(GeneraljoinPage);
  }
  goToAdviserjoin() {
    this.navCtrl.push(AdviserjoinPage);
  }

  close() {
    this.navCtrl.setRoot(TabsPage);
  }
}
