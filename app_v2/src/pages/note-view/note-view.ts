import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { FeedPage } from '../feed/feed';

import { sHttp } from '../../providers/sHttp';
import _ from 'lodash';

@Component({
  selector: 'page-note-view',
  templateUrl: 'note-view.html'
})
export class NoteViewPage {

  private id;
  public note = {}
  errorMessage: string;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public sHttp: sHttp) {
    this.id = this.navParams.get('id');
  }

  ionViewDidLoad() {
    this.getNote();
  }

  getNote() {
    var url = (_.template('/thankYouNote/${id}'))({ 'id': this.id });
    this.sHttp.get(url).subscribe(
      data => {
        this.note = data.data;
      },
      // error =>  this.errorMessage = <any>error
      error => {
        this.errorMessage = <any>error;
        console.log('getComment errorMessage:', this.errorMessage);
        if (typeof error === 'object') {
          console.log('error.status:', error.status);
          if (error.status == 401) {
            // this.events.publish('xLoginError');
          } else if (error.status == 403) {
          } else {
          }
        }
      }
    );
  }

  goToFeed(postsId) {
    this.navCtrl.push(FeedPage, {'id':postsId});
  }
  
}
