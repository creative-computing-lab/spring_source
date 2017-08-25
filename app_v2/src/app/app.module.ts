import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { IonicStorageModule, Storage } from '@ionic/storage';

import { Geolocation } from '@ionic-native/geolocation';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Toast } from '@ionic-native/toast';
import { Device } from '@ionic-native/device'
import { InAppBrowser } from '@ionic-native/in-app-browser';

import '../../node_modules/chart.js/dist/Chart.bundle.min.js';
import { ChartsModule } from 'ng2-charts/ng2-charts';

import { SpringApp } from './app.component';
import { TabsPage } from '../pages/tabs/tabs';
import { HomePage } from '../pages/home/home';
import { DescriptionPage } from '../pages/description/description';
import { Write1Page } from '../pages/write1/write1';
import { Write2Page } from '../pages/write2/write2';
import { UserselectionPage } from '../pages/userselection/userselection';
import { CheckmoodPage } from '../pages/checkmood/checkmood';
import { SettingsPage } from '../pages/settings/settings';
import { LoginPage } from '../pages/login/login';
import { GeneraljoinPage } from '../pages/generaljoin/generaljoin';
import { AdviserjoinPage } from '../pages/adviserjoin/adviserjoin';
import { WelcomePage } from '../pages/welcome/welcome';
import { CommentPage } from '../pages/comment/comment';
import { CommentDetailPage } from '../pages/comment-detail/comment-detail';
import { NoteWritePage } from '../pages/note-write/note-write';
import { GeneralMypagePage } from '../pages/general-mypage/general-mypage';
import { AdviserMypagePage } from '../pages/adviser-mypage/adviser-mypage';
import { BackgroundSelectPage } from '../pages/background-select/background-select';
import { PreviewPage } from '../pages/preview/preview';
import { NoteViewPage } from '../pages/note-view/note-view';
import { FeedPage } from '../pages/feed/feed';
import { SetPage } from '../pages/set/set';
import { PwChangePage } from '../pages/pw-change/pw-change';
import { PwFindPage } from '../pages/pw-find/pw-find';

import { ModalJoinRecommendationPage } from '../pages/modal_join_recommendation/modal_join_recommendation';
import { ModalThinkChangePage } from '../pages/modal_think_change/modal_think_change';
import { ModalThankYouNotePage } from '../pages/modal_thank_you_note/modal_thank_you_note';
import { ModalPublicChangePage } from '../pages/modal_public_change/modal_public_change';
import { ModalThankYouGuidePage } from '../pages/modal_thank_you_guide/modal_thank_you_guide';
import { ModalFindPasswordPage } from '../pages/modal_find_password/modal_find_password';

import { sUser } from '../providers/sUser';
import { sHttp } from '../providers/sHttp';
import { sSettings } from '../providers/sSettings';
import { sToast } from '../providers/sToast';
import { sTimeAgo } from '../providers/sTimeAgo';

import { TextCountPipe } from '../pipe/Textcount.pipe';

import { EqualValidator } from '../validator/equalValidator';

//EqualValidator

export function sProvideSettings(storage: Storage) {
  /**
   * The Settings provider takes a set of default settings for your app.
   *
   * You can add new settings options at any time. Once the settings are saved,
   * these values will not overwrite the saved values (this can be done manually if desired).
   */
  return new sSettings(storage, {
    initDescription: false,
    moodValue: 50,           // 기분, mood range value
    title: '',              // 기분, 상황, 생각의 제목
    situations: '',         // 상황, 어떤 상황이었냐면...
    postsCategory: '기타',   // 상황, 카테고리
    thoughts: '',           // 생각, 글
    backgroundSeq: 1,       // background image seq
    username: '',
    token: ''
  });
}

@NgModule({
  declarations: [
    SpringApp,
    TabsPage,
    HomePage,
    DescriptionPage,
    Write1Page,
    Write2Page,
    UserselectionPage,
    CheckmoodPage,
    SettingsPage,
    ModalJoinRecommendationPage,
    ModalThinkChangePage,
    ModalThankYouNotePage,
    ModalPublicChangePage,
    ModalThankYouGuidePage,
    ModalFindPasswordPage,
    LoginPage,
    GeneraljoinPage,
    AdviserjoinPage,
    WelcomePage,
    CommentPage,
    CommentDetailPage,
    NoteWritePage,
    GeneralMypagePage,
    AdviserMypagePage,
    BackgroundSelectPage,
    PreviewPage,
    FeedPage,
    SetPage,
    PwChangePage,
    PwFindPage,
    NoteViewPage,
    TextCountPipe,
    EqualValidator
  ],
  imports: [
    IonicModule.forRoot(SpringApp),
    IonicStorageModule.forRoot(),
    ChartsModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    SpringApp,
    TabsPage,
    HomePage,
    DescriptionPage,
    Write1Page,
    Write2Page,
    UserselectionPage,
    CheckmoodPage,
    SettingsPage,
    ModalJoinRecommendationPage,
    ModalThinkChangePage,
    ModalThankYouNotePage,
    ModalPublicChangePage,
    ModalThankYouGuidePage,
    ModalFindPasswordPage,
    LoginPage,
    GeneraljoinPage,
    AdviserjoinPage,
    WelcomePage,
    CommentPage,
    CommentDetailPage,
    NoteWritePage,
    GeneralMypagePage,
    AdviserMypagePage,
    BackgroundSelectPage,
    PreviewPage,
    FeedPage,
    SetPage,
    PwChangePage,
    PwFindPage,
    NoteViewPage
  ],
  providers: [
    sUser,
    sHttp,
    sToast,
    //Storage,
    Geolocation,
    StatusBar,
    SplashScreen,
    Toast,
    Device,
    InAppBrowser,
    sTimeAgo,
    
    { provide: sSettings, useFactory: sProvideSettings, deps: [ Storage ] },
    // Keep this to enable Ionic's runtime error handling during development
    { provide: ErrorHandler, useClass: IonicErrorHandler }
  ]
})
export class AppModule { }
