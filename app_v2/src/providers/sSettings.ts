import { Injectable } from '@angular/core';

import { Storage } from '@ionic/storage';

/**
* A simple settings/config class for storing key/value pairs with persistence.
*/
@Injectable()
export class sSettings {
  private SETTINGS_KEY: string = '_settings';

  settings: any;

  _defaults: any;
  _readyPromise: Promise<any>;

  constructor(public storage: Storage, defaults: any) {
    this._defaults = defaults;
  }

  load() {
    return this.storage.ready().then(() => {
      return this.storage.get(this.SETTINGS_KEY).then((value) => {
        if (value) {
          this.settings = value;
          this._mergeDefaults(this._defaults);
        } else {
          return this.setAll(this._defaults).then((val) => {
            this.settings = val;
          })
        }
      });

    });
  }

  _mergeDefaults(defaults: any) {
    for (let k in defaults) {
      if (!(k in this.settings)) {
        this.settings[k] = defaults[k];
      }
    }
    return this.setAll(this.settings);
  }

  merge(settings: any) {
    for (let k in settings) {
      this.settings[k] = settings[k];
    }
    return this.save();
  }

  setValue(key: string, value: any) {
    this.settings[key] = value;
    return this.storage.set(this.SETTINGS_KEY, this.settings);
  }

  setAll(value: any) {
    return this.storage.set(this.SETTINGS_KEY, value);
  }

  getValue(key: string) {
    return this.storage.get(key);
  }

  save() {
    return this.setAll(this.settings);
  }

  get allSettings() {
    return this.settings;
  }

  initialPost() {
    this.settings['moodValue'] = 50;
    this.settings['title'] = '';
    this.settings['situations'] = '';
    this.settings['postsCategory'] = '';
    this.settings['thoughts'] = '';
    this.settings['backgroundSeq'] = 1;

    return this.storage.set(this.SETTINGS_KEY, this.settings);
  }
}