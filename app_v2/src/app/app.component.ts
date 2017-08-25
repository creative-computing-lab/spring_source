import { Component, ViewChild } from '@angular/core';
import { AlertController, Events, Platform, MenuController, Nav } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { Device } from '@ionic-native/device';
import { InAppBrowser } from '@ionic-native/in-app-browser';

import { DescriptionPage } from '../pages/description/description';
import { TabsPage } from '../pages/tabs/tabs';

import { sSettings } from '../providers/sSettings';
import { sUser } from '../providers/sUser';
import { sHttp } from '../providers/sHttp';

declare var FCMPlugin;

@Component({
  templateUrl: 'app.html'
})

export class SpringApp {
  @ViewChild(Nav) nav: Nav;

  // make HelloIonicPage the root (or first) page
  rootPage: any = TabsPage;
  pages: Array<{ title: string, component: any }>;

  settingsReady = false;
  options: any;
  initDescription = false;

  deviceId: any;
  isAgreeSend: boolean = true;
  errorMessage: string;

  constructor(public alertCtrl: AlertController,
    public events: Events,
    public platform: Platform,
    public menu: MenuController,
    public settings: sSettings,
    public user: sUser,
    public sHttp: sHttp,
    private statusBar: StatusBar,
    private device: Device,
    private inAppBrowser: InAppBrowser
    ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      console.log('platform.ready() success');

      this.deviceId = this.device.uuid;

      //os and version
      let system = this.platform.is('ios') ? 'ios' : (this.platform.is('android') ? 'android' : 'windows');
      console.log('[device-info]',system,'-',this.deviceId,'@',this.device.version);

      this.initPushNotification();

      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      // Splashscreen.hide();

      this.platform.registerBackButtonAction(() => {
        console.log('back button pressed');
        if (this.nav.canGoBack()) {
          this.nav.pop();
        } else {
          let confirm = this.alertCtrl.create({
            title: '종료하시겠습니까?',
            message: '',
            buttons: [
              {
                text: '아니요',
                handler: () => {
                  confirm.dismiss();
                }
              },
              {
                text: '예',
                handler: () => {
                  this.platform.exitApp();
                }
              }
            ]
          });
          confirm.present();
        }
      }
      );
    });

    // Storage synchronous call(promise)
    this.getSettings().then((value) => {
      if (value != null) {
        console.log('[app.component.ts]synchronous call!!!');

        if (value.initDescription == true) {
          this.rootPage = TabsPage;
        } else {
          this.rootPage = DescriptionPage;
        }
      } else {
        console.log('[app.component.ts]value is not');
      }
    });
  }

  getSettings(): any {
    return this.settings.load().then(() => {
      this.settingsReady = true;
      this.options = this.settings.allSettings;

      console.log('[app.component.ts]settings.load()');
      console.log('initDescription:', this.options.initDescription);

      return this.options;
    });
  }

  initPushNotification() {
    /** 
     * cordova-plugin-fcm
     */
    FCMPlugin.getToken((token) => {
      console.log('[FCMPlugin.getToken]', token);

      this.putDevice(token);

      // Storage synchronous call(promise)
      this.getSettings().then((value) => {
        if (value != null) {
          this.settings.setValue('token', token);
        } else {
        }
      });
    });

    FCMPlugin.onTokenRefresh((token) => {
      console.log('[FCMPlugin.onTokenRefresh]', token);

      this.putDevice(token);

      // Storage synchronous call(promise)
      this.getSettings().then((value) => {
        if (value != null) {
          this.settings.setValue('token', token);
        } else {
        }
      });
    });

    // FCMPlugin.onNotification(function (data) {   old coding
    FCMPlugin.onNotification((data) => {
      console.log('push data:', JSON.stringify(data));
      if ( this.platform.is('ios') ) {
        if ( data.wasTapped ) {
          // Notification was received on device tray and tapped by the user.
          if ( data.link != undefined ) {
            this.inAppBrowser.create(data.link, '_blank', 'hardwareback=yes,location=yes,hidden=no');
          }
        } else {
          // Notification was received in foreground. Maybe the user needs to be notified.
          this.pushAlert(data.aps.alert.body, data.link);
          // console.log('tap false:', JSON.stringify(data));
        }
      } else if ( this.platform.is('android') ) {
        if ( data.wasTapped ) {
          // Notification was received on device tray and tapped by the user.
          if ( data.link != undefined ) {
            this.inAppBrowser.create(data.link, '_blank', 'hardwareback=yes,location=yes,hidden=no');
          }
        } else {
          // Notification was received in foreground. Maybe the user needs to be notified.
          this.pushAlert(data.body, data.link);
          // console.log('tap false:', JSON.stringify(data));
        }
      }
    });
  }

  pushAlert(body, link) {
    let pushAlert = this.alertCtrl.create({
            title: '알림',
            message: body,
            buttons: [
              {
                text: '확인',
                handler: () => {
                  pushAlert.dismiss();
                  console.log('link:', link);
                  if ( link != undefined ) {
                    this.inAppBrowser.create(link, '_blank', 'hardwareback=yes,location=yes,hidden=no');
                  }
                }
              }
            ]
          });

    pushAlert.present();
  }

  putDevice(token) {
    // push/putDevice
    var url = '/push/putDevice';
    this.sHttp.post(url, { 'deviceId': this.deviceId, 'token': token, 'isAgreeSend': this.isAgreeSend }).subscribe(
      data => {
        console.log('/push/putDevice success', data);
      },
      error => {
        this.errorMessage = <any>error;
        console.log('/push/putDevice errorMessage:', this.errorMessage);
        if ( typeof error === 'object') {
          console.log('error.status:', error.status);
          if ( error.status == 401 ) {
            // this.events.publish('xLoginError');
          } else if ( error.status == 403 ) {
          } else {
          }
        }
      }
    );
  }

  updateDevice() {
    // push/updateDevice
    var url = '/push/updateDevice';
    console.log('[updateDevice]', this.deviceId);

    this.sHttp.post(url, { 'deviceId': this.deviceId }).subscribe(
      data => {
        console.log('/push/updateDevice success', data);
      },
      error => {
        this.errorMessage = <any>error;
        console.log('/push/updateDevice errorMessage:', this.errorMessage);
        if ( typeof error === 'object') {
          console.log('error.status:', error.status);
          if ( error.status == 401 ) {
            // this.events.publish('xLoginError');
          } else if ( error.status == 403 ) {
          } else {
          }
        }
      }
    );
  }

  ngOnInit() {
    this.events.subscribe('xLoginSuccess', () => {
      console.log('[app.component]xLoginSuccess subscribe');
      this.updateDevice();
      this.events.publish('xTabRequestRedraw');
    });
    this.events.subscribe('xLogoutSuccess', () => {
      console.log('[app.component]xLogoutSuccess subscribe');
      this.events.publish('xTabRequestRedraw');
    });
    this.events.subscribe('xUserInit', () => {
      console.log('[app.component]xUserInit subscribe');
      this.sHttp.validate();
    });
    this.events.subscribe('xValidateSuccess', () => {
      console.log('[app.component]xValidateSuccess subscribe');
      this.updateDevice();
      this.events.publish('xTabRequestRedraw');
    });
    this.events.subscribe('xValidateError', () => {
      console.log('[app.component]xValidateError subscribe');
      this.events.publish('xTabRequestRedraw');
    });
  }

  ngOnDestroy() {
    this.events.unsubscribe('xLoginSuccess');
    this.events.unsubscribe('xLogoutSuccess');
    this.events.unsubscribe('xUserInit');
    this.events.unsubscribe('xValidateSuccess');
    this.events.unsubscribe('xValidateError');
  }
}
