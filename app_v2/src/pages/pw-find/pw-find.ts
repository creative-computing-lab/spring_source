import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavController, PopoverController, NavParams } from 'ionic-angular';

import { ModalFindPasswordPage } from '../modal_find_password/modal_find_password';

import { sHttp } from '../../providers/sHttp';
import { sToast } from '../../providers/sToast';

@Component({
  selector: 'page-pw-find',
  templateUrl: 'pw-find.html'
})
export class PwFindPage {
  form: FormGroup;

  constructor(public navCtrl: NavController,
    public popoverCtrl: PopoverController,
    public navParams: NavParams,
    public formBuilder: FormBuilder,
    public sHttp: sHttp,
    public sToast: sToast) {
    this.form = formBuilder.group({
      //username: ['', Validators.compose([Validators.maxLength(30), IDValidator.id, Validators.required])],
      username: ['', Validators.compose([Validators.required])],
      birthday: ['', Validators.compose([Validators.required])],
      recommendationCode: []
    });
    //this.form.value['username'] = 'test';
    //this.form.value['birthday'] = '1994-03-10';
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PwFindPage');
  }

  findPassword(id) {

    if (this.form.status === 'VALID') {
      var url = '/user/findPwd'
      this.sHttp.post(url, this.form.value).subscribe(
        data => {
          if (data.resultCode != 0) {
            this.sToast.show(data.data.msg, 2000, null);
          } else {
            //console.log('oppose create success');
            //this.sToast.show('', 2000, null);
            //this.getPosts(0);
            this.openFindPasswordModal(data.data.newpassword);
          }
        },
        // error =>  this.errorMessage = <any>error
        error => {
        }
      );
    } else {
      this.sToast.show('입력된 값을 확인해주세요.', 2000, null);
    }
  }
  openFindPasswordModal(newpassword) {
    let popover = this.popoverCtrl.create(ModalFindPasswordPage,   // definition
      { 'newpassword': newpassword },   // some params
      { cssClass: 'find-popover backdropOpacityPopover' });  // Popover options

    popover.onDidDismiss(()=> {
      this.close();
    });
    popover.present();
  }

  close() {
    this.navCtrl.pop();
  }

}
