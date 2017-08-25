import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NavController, NavParams } from 'ionic-angular';

import { UserselectionPage } from '../userselection/userselection';
import { TabsPage } from '../tabs/tabs';

import { sSettings } from '../../providers/sSettings';

/*
  Generated class for the Description page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-description',
  templateUrl: 'description.html'
})
export class DescriptionPage {
  // Our local settings object
  options: any;

  settingsReady = false;

  form: FormGroup;

  constructor(public navCtrl: NavController,
            public navParams: NavParams,
            public sSettings: sSettings,
            public formBuilder: FormBuilder) {
  }

  _buildForm() {
    let group: any = {
      initDescription: [this.options.initDescription]
    };

    this.form = this.formBuilder.group(group);

    // Watch the form for changes, and
    this.form.valueChanges.subscribe((v) => {
      // console.log('value chagne', this.form.value);
      this.sSettings.merge(this.form.value);
    });
  }

  ionViewDidLoad() {
    this.form = this.formBuilder.group({});
  }

  ionViewWillEnter() {
    // Build an empty form for the template to render
    this.form = this.formBuilder.group({});

    this.sSettings.load().then(() => {
      this.settingsReady = true;
      this.options = this.sSettings.allSettings;

      // console.log('DescriptionPage settings.load()');
      // console.log('initDescription:', this.options.initDescription);

      this._buildForm();
    });
  }

  goToUserselection() {
    this.navCtrl.push(UserselectionPage);
  }

  close() {
    this.navCtrl.setRoot(TabsPage);
  }
}


