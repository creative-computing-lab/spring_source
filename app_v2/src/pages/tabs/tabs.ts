import { Component, ViewChild } from '@angular/core';
import { Events, NavController, Platform } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';


import { HomePage } from '../home/home';
import { CheckmoodPage } from '../checkmood/checkmood';
import { GeneralMypagePage } from '../general-mypage/general-mypage';
import { AdviserMypagePage } from '../adviser-mypage/adviser-mypage';

import { sUser } from '../../providers/sUser';
import { sHttp } from '../../providers/sHttp';
import { sSettings } from '../../providers/sSettings';
// import { sParams } from '../../providers/sParams';

// import { ElementRemove } from '../../directives/ElementRemove';

export class Tab {
  title: string;
  component: any;
  icon: string;
}

const USER_TABS = [
  { component: GeneralMypagePage, title: '마이페이지', icon: 'contacts' }
];

const COUNSELOR_TABS = [
  { component: AdviserMypagePage, title: '상담자', icon: 'contacts' },
];

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {
  @ViewChild('writeTab') writeTab: Tab;
  // @ViewChild('writeTab') elementRemove: ElementRemove;

  // this tells the tabs component which Pages
  // should be each tab's root Page
  tab1Root: any = HomePage;

  public isLogin: boolean;
  public isNormalUser: boolean = false;
  public isCounselorUser: boolean = false;

  tabs: Array<Tab>;

  constructor(public events: Events,
    public navCtrl: NavController,
    public platform: Platform,
    public sSettings: sSettings,
    public user: sUser,
    public http: sHttp,
    private splashScreen: SplashScreen) {

    // console.log('[tabs.ts]writeTab:', this.writeTab);

    this.generateTabs();
    console.log('[tabs.ts]constructor, isCounselorUser:', this.isCounselorUser);

    // this.presentLoading();
    this.platform.ready().then(() => {
      console.log('[tabs.ts]platform.ready() success');
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.splashScreen.hide();
    });
  }

  ionViewDidLoad() {
    console.log('[tabs.ts]ionViewDidLoad');
  }

  ionViewDidEnter() {
    this.http.validate();
  }

  ngOnInit() {
    this.events.subscribe('xTabRequestRedraw', () => {
      console.log('[tabs.ts]xTabRequestRedraw');
      this.generateTabs();
    });
  }

  ngAfterViewInit() {
    console.log('[tabs.ts]ngAfterViewInit');
    // this.generateTabs();
    console.log('[tabs.ts]writeTab:', this.writeTab);
  }

  ngOnDestroy() {
    this.events.unsubscribe('xTabRequestRedraw');
  }

  goWrite1() {
    // console.log("goWrite1");
    this.navCtrl.setRoot(CheckmoodPage);
  }

  generateTabs() {
    this.isLogin = this.user.isLogin();

    if (this.isLogin) {
      if (this.user.getRole() == 'ROLE_USER') {
        this.tabs = USER_TABS;
      } else if (this.user.getRole() == 'ROLE_COUNSELOR') {
        this.isCounselorUser = true;
        // console.log('[tabs.ts]ROLE_COUNSELOR, isCounselorUser:', this.isCounselorUser);

        if ( this.writeTab != undefined ) {
          // console.log('[tabs.ts]counselor element:', this.writeTab);
          // this.writeTab.show = false;
          (<any>this.writeTab).show = false;
        }
        this.tabs = COUNSELOR_TABS;
      } else {
      }
    } else {
      this.tabs = null;
    }
  }

}
