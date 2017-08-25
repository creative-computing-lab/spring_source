import { Component } from '@angular/core';
import { NavController, NavParams, ViewController, App } from 'ionic-angular';
import { Device } from '@ionic-native/device';

import { PwChangePage } from '../pw-change/pw-change';
import { TabsPage } from '../tabs/tabs';

import { sHttp } from '../../providers/sHttp';
import { sToast } from '../../providers/sToast';
import { sSettings } from '../../providers/sSettings';

/*
  Generated class for the Set page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-set',
  templateUrl: 'set.html'
})
export class SetPage {

  isAgreeSend: boolean = false;
  disabledIsAgree: boolean = false;
  deviceId: string;
  token: any;

  settingsReady = false;
  options: any;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public viewCtrl: ViewController,
    public device: Device,
    public sHttp: sHttp,
    public sToast: sToast,
    public settings: sSettings,
    public app: App) {
    
    // Storage synchronous call(promise)
    this.getSettings().then((value) => {
      if (value != null) {
        console.log('[set.ts]token:', value.token);
        this.token = value.token;
      } else {
        console.log('[set.ts]value is not');
      }
    });

  }

  getSettings(): any {
    return this.settings.load().then(() => {
      this.settingsReady = true;
      this.options = this.settings.allSettings;

      return this.options;
    });
  }

  ionViewDidLoad() {
    // get device id
    // console.log('ionViewDidLoad isAgreeSend:', this.isAgreeSend);

    this.deviceId = this.device.uuid;
    this.getIsArgee();
  }

  goToPwChange() {
    this.navCtrl.push(PwChangePage);
  }

  logout() {
    this.sHttp.logout();
    this.sToast.show('로그아웃하였습니다.', 2000, null);
    this.app.getRootNav().setRoot(TabsPage);
  }

  getIsArgee() {
    this.disabledIsAgree = true;
    let url = `/push/getIsArgee/?deviceId=${this.deviceId}`;
    this.sHttp.get(url).subscribe(data => {
      console.log("getIsAgreeSend", data)
      if (data.resultCode == '0') {
        this.isAgreeSend = data.data.isAgreeSend;
        this.disabledIsAgree = false;

        // console.log('getIsArgee isAgreeSend:', data.data.isAgreeSend);
      }
    }, error => { console.log("getisAgreeSend failed", error) });
  }

  changeIsAgreeSend() {
    // 해제 -> 설정
    if (this.isAgreeSend) {
      // get push token
      // this.isAgreeSend = true;
    } else {
      // this.isAgreeSend = false;
    }
    // console.log('changeIsAgreeSend isAgreeSend:', this.isAgreeSend);

    this.putDevice(this.token, this.isAgreeSend, this.deviceId);
  }

  private putDevice(token, isAgreeSend, deviceId) {
    this.sHttp.post('/push/putDevice', { token: token, isAgreeSend: isAgreeSend, deviceId: deviceId }).subscribe(data => {
      console.log("updateIsArgee", data)
    }, error => { console.log("updateIsArgee failed", error) });
  }
}
