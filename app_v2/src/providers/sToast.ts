import { Injectable } from '@angular/core';
import { ToastController , Platform} from 'ionic-angular';
import { Toast } from '@ionic-native/toast';

@Injectable()
export class sToast {

  constructor(public toastCtrl: ToastController,
            public platform: Platform,
            private toast: Toast) {          
  }

  public show(message:string, duration:number, closeButtonText:string) {
    if ( this.platform.is("cordova") ) {
      this.toast.show(message, duration+'', 'bottom').subscribe(
        toast => {
          console.log(toast);
        }
      );
    } else {
      if( closeButtonText == null ) {
        let toast = this.toastCtrl.create({
          duration: duration,
          message: message
        });
        toast.present();
      } else {
        let toast = this.toastCtrl.create({
          message: message,
          showCloseButton: true,
          closeButtonText: closeButtonText
        });

        toast.present();
      }
    }
  }

}