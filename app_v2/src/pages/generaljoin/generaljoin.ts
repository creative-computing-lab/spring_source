import { Component } from '@angular/core';
import { Events, NavController, NavParams, LoadingController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';

import { sHttp } from '../../providers/sHttp';
import { sToast } from '../../providers/sToast';
import { IDValidator } from '../../validator/idValidator';
import { NumbericValidator } from '../../validator/NumbericValidator';

import { WelcomePage } from '../welcome/welcome';
import { TabsPage } from '../tabs/tabs';

/*
  Generated class for the Generaljoin page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-generaljoin',
  templateUrl: 'generaljoin.html'
})
export class GeneraljoinPage {

  public gender: AbstractControl;
  public username: AbstractControl;
  public password: AbstractControl;
  public cPassword: AbstractControl;
  public birthday: AbstractControl;
  public recommendationCode: AbstractControl;
  public userDiv: string;

  registerForm: FormGroup;
  errorMessage: string;

  constructor(public events: Events,
            public navCtrl: NavController,
            public formBuilder: FormBuilder,
            public loadingCtrl: LoadingController,
            public navParams: NavParams,
            public sHttp: sHttp,
            public sToast: sToast) {
    this.registerForm = formBuilder.group({
      gender: ['', Validators.compose([Validators.required])],
      username: ['', Validators.compose([Validators.maxLength(30), IDValidator.id, Validators.required])],
      password: ['', Validators.compose([Validators.maxLength(4), NumbericValidator.number, Validators.required])],
      cPassword: ['', Validators.compose([Validators.maxLength(4), NumbericValidator.number, Validators.required])],
      birthday: ['', Validators.compose([Validators.required])],
      recommendationCode: ['', Validators.compose([Validators.minLength(4), Validators.required])]
    });

    this.gender = this.registerForm.controls["gender"];
    this.username = this.registerForm.controls["username"];
    this.password = this.registerForm.controls["password"];
    this.cPassword = this.registerForm.controls["cPassword"];
    this.birthday = this.registerForm.controls["birthday"];
    this.recommendationCode = this.registerForm.controls["recommendationCode"];
    this.userDiv = "NORMAL";

    this.recommendationCode.setAsyncValidators(c=>{
      return this.asyncCodeValidate(c);
    });

    this.listenToLoginEvents();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad GeneraljoinPage');
  }

  private asyncCodeValidate(c: AbstractControl) {
    return new Promise((resolve, reject) => {
      this.sHttp.post('/recommCode/isAvailable', { code: c.value }).toPromise().then(data => {
        if (data.resultCode == 0 && data.data.isAvailable == true) {
          resolve(null);
        } else {
          resolve({ 'code': true });
        }
      }, error => {
        reject({ 'code': true });
      });
    });
  }

  goToWelcome() {
    this.navCtrl.push(WelcomePage);
  }

  close() {
    this.navCtrl.setRoot(TabsPage);
  }

  register() {
    let loader = this.loadingCtrl.create({
      content: "회원가입중입니다.<br/>잠시만 기다려 주세요."
    });

    const register = {
      gender: this.gender.value,
      birthday: this.birthday.value,
      username: this.username.value,
      password: this.password.value,
      recommendationCode: this.recommendationCode.value,
      userDiv: this.userDiv
    };

    if (this.registerForm.valid) {
      loader.present();
      this.sHttp.post('/user/register', register).subscribe(
        data => {
          loader.dismiss();

          if ( data.resultCode == "0" ) {
            this.sToast.show('회원가입이 완료되었습니다.', 2000, null);

            // auto login process
            this.sHttp.login(this.username.value, this.password.value);
          } else {
            this.errorMessage = data.data.msg;
            this.sToast.show(this.errorMessage, 2000, null);
          }
          // Keyboard.close();
        },
        error => {
          loader.dismiss();
          this.joinFailAlert();
        });
    } else {
      // Keyboard.close();
      this.joinFailAlert();
      console.log('registerForm invalid');
    }
  }

  joinFailAlert() {
    this.sToast.show('모든 입력항목은 필수사항입니다. 입력항목을 확인해 주세요!', 2000, null);
  }

  listenToLoginEvents() {
    // const index = this.viewCtrl.index;
    this.events.subscribe('xLoginSuccess', () => {
      this.navCtrl.push(WelcomePage);
    });

    this.events.subscribe('xLoginError', () => {
      // Keyboard.close();
    });
  }
}
