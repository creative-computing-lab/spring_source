import { Component } from '@angular/core';
import { Events, NavController, ViewController, PopoverController, NavParams } from 'ionic-angular';

import { NoteWritePage } from '../note-write/note-write';
import { ModalThankYouGuidePage } from '../modal_thank_you_guide/modal_thank_you_guide';

@Component({
  templateUrl: 'modal_thank_you_note.html'
})

export class ModalThankYouNotePage {

  public commentId:number;

  constructor(public navCtrl: NavController,
            public viewCtrl: ViewController,
            public popoverCtrl: PopoverController,
            public navParams: NavParams,
            public events: Events) {
    this.commentId = this.navParams.get('commentId');
  }

  goToNoteWrite() {
    // this.viewCtrl.dismiss();
    const index = this.viewCtrl.index;
    console.log('ModalThankYouNotePage viewCtrl index:', index);

    this.navCtrl.push(NoteWritePage, {'commentId':this.commentId, 'preViewIndex':index});
  }

  goToNo() {
    this.viewCtrl.dismiss();

    let popover = this.popoverCtrl.create(ModalThankYouGuidePage,   // definition
                                      {},   // some params
                                      {cssClass: 'thank_you_note-popover backdropOpacityPopover'});  // Popover options
    popover.present();

    this.events.publish('xViewReload');
  }
}
