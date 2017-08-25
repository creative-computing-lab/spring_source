import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators , AbstractControl } from '@angular/forms';

import { sHttp } from '../../providers/sHttp';
import { sToast } from '../../providers/sToast';
import { NumbericValidator } from '../../validator/NumbericValidator';

/*
  Generated class for the PwChange page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-pw-change',
  templateUrl: 'pw-change.html'
})
export class PwChangePage {

  public current: AbstractControl;
  public new: AbstractControl;
  public cNew: AbstractControl;

  passwordForm: FormGroup;

  constructor(public navCtrl: NavController,
              public formBuilder: FormBuilder,
              public navParams: NavParams,
              public viewCtrl: ViewController,
              public sHttp: sHttp,
              public sToast: sToast) {
    this.passwordForm = formBuilder.group({
        current: ['', Validators.compose([Validators.maxLength(4), NumbericValidator.number, Validators.required])],
        new: ['', Validators.compose([Validators.maxLength(4), NumbericValidator.number, Validators.required])],
        cNew: ['', Validators.compose([Validators.maxLength(4), NumbericValidator.number, Validators.required])],
    });

    this.current = this.passwordForm.controls["current"];
    this.new = this.passwordForm.controls["new"];
    this.cNew = this.passwordForm.controls["cNew"];
  }

  ionViewDidLoad() {
    // console.log('ionViewDidLoad PwChangePage');
  }

  updatePassword() {
    if( this.passwordForm.valid ) {
      const pass = {passwordCurrent:this.current.value,passwordNew:this.new.value};
      this.sHttp.post('/user/updatePwd',pass).subscribe(
        data => {
          if ( data.resultCode == '0' ) {
            this.successAlert();
            const index = this.viewCtrl.index;
            this.navCtrl.remove(index);
          } else {
            // console.info(data.message);
            this.failAlert(data.data.msg);
          }
        },
        error =>  {});
    } else {
      this.failAlert();
    }
  }

  successAlert() {
    this.sToast.show('비밀번호 변경이 완료되었습니다.', 2000, null);
  }

  failAlert(msg = null) {
    if(msg==null) {
      msg = '비밀번호 변경이 실패하였습니다. 입력 내용을 확인해주세요';
    }
    this.sToast.show(msg, 2000, null);
  }

}
