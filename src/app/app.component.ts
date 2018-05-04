import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, Events, AlertController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { OneSignal } from '@ionic-native/onesignal';
import { AngularFireDatabase } from 'angularfire2/database';
//import { SplashScreen } from '@ionic-native/splash-screen';

@Component({
  templateUrl: 'app.html',
  providers: [ OneSignal, AngularFireDatabase ]
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any;
  pages: Array<{title: string, component: any, first: string, second: string, category: string}>;
  public name: string = null;
  public lastname: string = null;

  constructor(
    public platform: Platform,
    public statusBar: StatusBar,
    public events: Events,
    private oneSignal: OneSignal,
    public alertCtrl: AlertController,
    public db: AngularFireDatabase
  ) {

    this.initializeApp();

    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'HOME', component: "HomePage", first: null, second: null, category: null },
      { title: 'SHOP PRE-CURATED', component: "PreCuratedPage", first: 'PRE-CURATED', second: 'BOXES', category: 'precurated' },
      { title: 'SHOP BUNDLE ITEMS', component: "PreCuratedPage", first: 'BUNDLE', second: 'BOXES', category: 'beesbundle' },
      { title: "CAN'T FIND WHAT YOU WANT?" , component: "CustomPage", first: null, second: null, category: null },
      { title: "MY ORDERS" , component: "OrdersPage", first: null, second: null, category: null },
      { title: "MY CART" , component: "CartPage", first: null, second: null, category: null },
    ];

    events.subscribe('user:login', () => {
      console.log('User Logged In');
      this.name = window.localStorage.getItem('mbb-name');
      this.lastname = window.localStorage.getItem('mbb-lastname');
    });

  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      //this.splashScreen.hide();

      if(window.localStorage.getItem('mbb-uid')) {
        this.rootPage = "HomePage";
      } else {
        this.rootPage = "CreateAccountPage";
      }

      if(window.localStorage.getItem('mbb-name')) {
        this.name = window.localStorage.getItem('mbb-name');
        this.lastname = window.localStorage.getItem('mbb-lastname');
      }

      this.oneSignal.startInit('4e60e773-888b-46b2-8377-44f8c2151a71', '572716651774');

      this.oneSignal.getIds().then( ids => {
        window.localStorage.setItem("mbb-onesignal",ids.userId);
        console.log('UserID: ' + ids.userId);
        if(window.localStorage.getItem('mbb-uid')) {
          let user_id = window.localStorage.getItem('mbb-uid');
          this.db.object('users/' + user_id).update({
            onesignal: ids.userId
          })
        }
      });

      this.oneSignal.inFocusDisplaying(this.oneSignal.OSInFocusDisplayOption.Notification);

      this.oneSignal.handleNotificationReceived().subscribe(data => {
        console.log('Notificación Recibida',data);
        let alert = this.alertCtrl.create({
          title: data.payload.title,
          message: data.payload.body,
          buttons: ['OK']
        });
        alert.present();
      });

      this.oneSignal.handleNotificationOpened().subscribe(data => {
        console.log('Push Notification Open',data);
      });

      this.oneSignal.endInit();
      
    });
  }

  viewProfile() {
    console.log('View Profile');
    this.nav.push("ProfilePage");
  }

  logout() {
    window.localStorage.removeItem('mbb-uid');
    window.localStorage.removeItem('mbb-email');
    window.localStorage.removeItem('mbb-pass');
    window.localStorage.removeItem('mbb-name');
    window.localStorage.removeItem('mbb-lastname');
    window.localStorage.removeItem('mbb-address');
    window.localStorage.removeItem('mbb-city');
    window.localStorage.removeItem('mbb-state');
    window.localStorage.removeItem('mbb-zip');
    window.localStorage.removeItem('mbb-phone');
    window.localStorage.removeItem('mbb-mybday');
    window.localStorage.removeItem('mbb-partnerbday');
    window.localStorage.removeItem('mbb-gender');
    window.localStorage.removeItem('mbb-status');
    window.localStorage.removeItem('mbb-cart');
    window.localStorage.removeItem('mbb-onesignal');
    this.nav.setRoot('LoginPage');
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    if(page.component == 'HomePage') {
      this.nav.setRoot(page.component, { first: page.first, second: page.second, category: page.category });
    } else {
      this.nav.push(page.component, { first: page.first, second: page.second, category: page.category });
    }
  }

  viewCart() {
    this.nav.push('CartPage');
  }

}
