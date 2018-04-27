import { Component } from '@angular/core';
import { NavController, IonicPage } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  providers: [ SplashScreen ]
})
export class HomePage {

  public name: string;

  constructor(
    public navCtrl: NavController,
    public splashScreen: SplashScreen
  ) {
    this.name = window.localStorage.getItem('mbb-name');
  }

  ionViewDidLoad() {
    this.splashScreen.hide();
  }

  goTo(p) {
    if(p == 'precurated') {
      this.navCtrl.push('PreCuratedPage', { first: 'PRE-CURATED', second: 'BOXES', category: 'precurated' });
    }
    if(p == 'bundle') {
      this.navCtrl.push('PreCuratedPage', { first: 'BUNDLE', second: 'BOXES', category: 'beesbundle' });
    }
    if(p == 'custom') {
      this.navCtrl.push('CustomPage');
    }
  }

  faqs() {
    this.navCtrl.push('FaqsPage');
  }

}
