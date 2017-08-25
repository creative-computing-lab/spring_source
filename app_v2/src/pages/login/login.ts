import { Component } from '@angular/core';
import { Events, NavController, NavParams } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators , AbstractControl } from '@angular/forms';

import { UserselectionPage } from '../userselection/userselection';
import { PwFindPage } from '../pw-find/pw-find';
import { TabsPage } from '../tabs/tabs';
import { IDValidator } from '../../validator/idValidator';
import { NumbericValidator } from '../../validator/NumbericValidator';

import { sHttp } from '../../providers/sHttp';
import { sToast } from '../../providers/sToast';
// import { sSettings } from '../../providers/sSettings';

/*
  Generated class for the Login page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {

  public username:AbstractControl;
  public pwd:AbstractControl;
  loginForm: FormGroup;

  // settingsReady = false;
  // options: any;

  constructor(public events: Events,
            public navCtrl: NavController,
            public navParams: NavParams,
            public sHttp: sHttp,
            public sToast: sToast,
            // public settings: sSettings,
            public formBuilder: FormBuilder) {

    //this.listenToLoginEvents();

    this.loginForm = formBuilder.group({
        username: ['', Validators.compose([Validators.maxLength(30), IDValidator.id, Validators.required])],
        pwd: ['', Validators.compose([Validators.maxLength(4), NumbericValidator.number, Validators.required])]
    });

    this.username = this.loginForm.controls["username"];
    this.pwd = this.loginForm.controls["pwd"];

    /*
    this.getSettings().then((value) => {
      if ( value != null ) {
        console.log('LoginPage settings value.username:', value.username);
        if ( value.username == '' || value.username == undefined ) {
          // username not exists
        } else {
          this.username = value.username;
        }
      } else {
        console.log('[app.component.ts]value is not');
      }
    });
    */
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  goToUserselection() {
    this.navCtrl.push(UserselectionPage);
  }
   goToPwFind() {
      this.navCtrl.push(PwFindPage);
    }

  /*
  getSettings(): any {
    return this.settings.load().then(() => {
      this.settingsReady = true;
      this.options = this.settings.allSettings;

      return this.options;
    });
  }
  */

  login() {
    if ( this.loginForm.valid ) {
      this.sHttp.login(this.username.value, this.pwd.value);
    } else {
      this.loginFail();
    }

    // test
    // this.sHttp.login('cslr', this.pwd.value);
  }

  loginFail() {
    this.sToast.show('로그인에 실패하였습니다. 아이디, 패스워드를 확인해주세요.', 2000, null);
  }

  loginSuccess() {
    this.sToast.show('로그인에 성공하였습니다.', 2000, null);
  }

  close() {
    this.navCtrl.setRoot(TabsPage);
  }

  ngOnInit() {
    // const index = this.viewCtrl.index;
    this.events.subscribe('xLoginSuccess', () => {
      this.loginSuccess();
      // Keyboard.close();

      // console.log("setRoot");
      this.navCtrl.setRoot(TabsPage);
    });

    this.events.subscribe('xLoginError', () => {
      // Keyboard.close();
      this.loginFail();
    });
  }

  ngOnDestroy() {
    this.events.unsubscribe('xLoginSuccess');
    this.events.unsubscribe('xLoginError');
  }
}
