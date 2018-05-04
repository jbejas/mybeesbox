import { Component } from '@angular/core';
import { NavController, IonicPage, NavParams, AlertController, LoadingController } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { CodePush } from '@ionic-native/code-push';
import { AngularFireDatabase } from 'angularfire2/database';
import * as moment from 'moment';

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  providers: [ SplashScreen, CodePush, AngularFireDatabase ]
})
export class HomePage {

  public name: string;
  public order: any;
  public oid: any;
  public notification_his: string;
  public notification_her: string;
  public notification_other: string;
  public notification_all: string;
  public notification: string;
  public config: any;

  constructor(
    public navCtrl: NavController,
    public splashScreen: SplashScreen,
    public params: NavParams,
    public alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    private codePush: CodePush,
    public db: AngularFireDatabase
  ) {
    this.name = window.localStorage.getItem('mbb-name');
    this.order = this.params.data.order;
    this.oid = this.params.data.oid;
  }

  ionViewDidLoad() {

    this.splashScreen.hide();
    if(this.order == 'cancelled') {
      let alert = this.alertCtrl.create({
        title: "Order Cancelled",
        message: "The Order #" + this.oid + " has been cancelled.",
        buttons: ["OK"]
      });
      alert.present();
    }

    if(this.order == 'processed') {
      let alert = this.alertCtrl.create({
        title: "Congratulations!",
        message: "The Order #" + this.oid + " has been processed correctly!. We will keep you informed about any changes in your order.",
        buttons: ["OK"]
      });
      alert.present();
    }

    let loader = this.loadingCtrl.create({
      content: "Downloading Update Package. Please hold..."
    });

    setTimeout( () => {
      console.log('Check for Update');
      const downloadProgress = (progress) => {
        console.log('Downloading');
      }

      this.codePush.sync({ updateDialog: {
        updateTitle: "Update Available!",
        mandatoryUpdateMessage: "My Bees Box will update now.",
        mandatoryContinueButtonLabel: "Installl Update"
      } }, downloadProgress).subscribe(
        (syncStatus) => {
          console.log('Sync Status -> ' + syncStatus);
          if(syncStatus == 7) {
            loader.present();
          }

        }
      );
    }, 2500);

    this.db.list('config').valueChanges().subscribe(config => {

      this.config = config;
      let gender = window.localStorage.getItem('mbb-gender');
      let status = window.localStorage.getItem('mbb-status');
      let partnerbday = window.localStorage.getItem('mbb-partnerbday');

      if(config[1] == 1 && gender == '1') {
        this.notification = config[2].toString();
      }
      if(config[1] == 1 && gender == '2') {
        this.notification = config[3].toString();
      }
      if(config[1] == 1 && gender == '3') {
        this.notification = config[4].toString();
      }
      if(config[1] == 2) {
        if(status != '1') { // IN A RELATIONHIP OR MARRIED
          var year = moment().format('YYYY');
          partnerbday = partnerbday.replace(/^.{4}/g, year.toString());
          console.log('Partner Bday -> ' + partnerbday);
          var start = moment();
          var end = moment(partnerbday);
          var diff = end.diff(start, "days");
          console.log('Days to Bday',diff);
          if(diff > 0 && diff <= 7) {
            console.log('Birthday Coming!');
            this.notification = "Your hubby’s birthday is in " + diff + " days. Get him a 15% off bundle!";
          } else {
            console.log('Birthday Far Away!');
            if(gender == '1') {
              this.notification = config[2].toString();
            }
            if(gender == '2') {
              this.notification = config[3].toString();
            }
            if(gender == '3') {
              this.notification = config[4].toString();
            }
          }
        }
        if(status == '1') { // SINGLE
          if(gender == '1') {
            this.notification = config[2].toString();
          }
          if(gender == '2') {
            this.notification = config[3].toString();
          }
          if(gender == '3') {
            this.notification = config[4].toString();
          }
        }
      }
      if(config[1] == 3) {
        this.notification = config[0].toString();
      }
    })

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
