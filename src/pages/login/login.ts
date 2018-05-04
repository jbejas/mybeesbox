import { Component } from '@angular/core';
import { NavController, IonicPage, AlertController, LoadingController, Events } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { constants } from '../../environments/environment';
import { Http } from '@angular/http';
import { AngularFireDatabase } from 'angularfire2/database';
import { OneSignal } from '@ionic-native/onesignal';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
  providers: [ SplashScreen, AngularFireDatabase, OneSignal ]
})
export class LoginPage {

  private email: string = '';
  private password: string = '';
  private flag: number = 0;
  public message: string;

  constructor(
    public navCtrl: NavController,
    public splashScreen: SplashScreen,
    public alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    private http: Http,
    public db: AngularFireDatabase,
    public events: Events,
    private oneSignal: OneSignal
  ) {
    
  }

  ionViewDidLoad() {
    this.splashScreen.hide();
  }

  register() {
    this.navCtrl.setRoot('CreateAccountPage');
  }

  loginUser() {

    let loading = this.loadingCtrl.create({
      content: 'Logging in...'
    });
    loading.present();

    this.message = '';
    this.flag = 0;
    if(!this.email) {
      this.flag = 1;
      this.message += '- Email<br>';
    }
    if(!this.validateEmail(this.email)) {
      this.flag = 1;
      this.message += '- Invalid Email<br>';
    }
    if(!this.password) {
      this.flag = 1;
      this.message += '- Password<br>';
    }
    
    if(this.flag == 1) {
      loading.dismiss().then(() => {
        let alert = this.alertCtrl.create({
          title: "Error",
          message: "Please complete the following fields:<br>" + this.message,
          buttons: ["OK"]
        });
        alert.present();
      });
    } else {
      this.http.get("https://www.mybeesbox.com/fb/fb.php?action=login_user&email=" + this.email + "&p=" + this.password)
      .subscribe(data => {
        let result = JSON.parse(data.text());
        if(result.result) {
          window.localStorage.setItem('mbb-uid',result.user_id);
          window.localStorage.setItem('mbb-email',this.email);
          window.localStorage.setItem('mbb-pass',this.password);
          window.localStorage.setItem('mbb-name',result.name);
          window.localStorage.setItem('mbb-lastname',result.lastname);
          window.localStorage.setItem('mbb-address',result.address);
          window.localStorage.setItem('mbb-city',result.city);
          window.localStorage.setItem('mbb-state',result.state);
          window.localStorage.setItem('mbb-zip',result.zip);
          window.localStorage.setItem('mbb-phone',result.phone);
          window.localStorage.setItem('mbb-mybday',result.my_birthday);
          window.localStorage.setItem('mbb-partnerbday',result.partner_birthday);
          window.localStorage.setItem('mbb-gender',result.gender);
          window.localStorage.setItem('mbb-status',result.status);
          this.events.publish('user:login');

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
          this.oneSignal.endInit().then(() => {
            loading.dismiss().then(() => {
              this.navCtrl.push('HomePage');
            });
          });
        } else {
          loading.dismiss().then(() => {
            let alert = this.alertCtrl.create({
              title: "Error",
              message: result.message,
              buttons: ["OK"]
            });
            alert.present();
          });
        }
      });
    }
    
  }

  validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }

}
