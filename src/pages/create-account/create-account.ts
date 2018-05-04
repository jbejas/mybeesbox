import { Component } from '@angular/core';
import { NavController, IonicPage, AlertController, LoadingController } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Http } from '@angular/http';
import { AngularFireDatabase } from 'angularfire2/database';
import { OneSignal } from '@ionic-native/onesignal';

@IonicPage()
@Component({
  selector: 'page-create-account',
  templateUrl: 'create-account.html',
  providers: [ SplashScreen, AngularFireDatabase, OneSignal ]
})
export class CreateAccountPage {

  private email: string = '';
  private password: string = '';
  private password1: string = '';
  private flag: number = 0;
  public message: string;

  constructor(
    public navCtrl: NavController,
    public splashScreen: SplashScreen,
    public alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    private http: Http,
    public db: AngularFireDatabase,
    private oneSignal: OneSignal
  ) {

  }

  ionViewDidLoad() {
    this.splashScreen.hide();
  }

  login() {
    this.navCtrl.setRoot('LoginPage');
  }

  registerNewUser() {

    let loading = this.loadingCtrl.create({
      content: 'Processing...'
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
    if(!this.password1) {
      this.flag = 1;
      this.message += '- Repeat Password<br>';
    }
    if(this.password != this.password1) {
      this.flag = 1;
      this.message += '- Passwords don\'t match<br>';
    }
    if(this.password.length < 6) {
      this.flag = 1;
      this.message += '- Password length (6 chars min)<br>';
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
      this.http.get("https://www.mybeesbox.com/fb/fb.php?action=create_user&email=" + this.email + "&p=" + this.password)
      .subscribe(data => {
        let result = JSON.parse(data.text());
        if(result.result) {
          window.localStorage.setItem('mbb-uid',result.user_id);
          this.db.object('users/' + result.user_id).set({
            uid: result.user_id,
            email: this.email
          }).then(() => {
              window.localStorage.setItem('mbb-email', this.email);
              window.localStorage.setItem('mbb-pass', this.password);
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
                  this.navCtrl.push('Step1Page');
                });
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
