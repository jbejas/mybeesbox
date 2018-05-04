import { Component } from '@angular/core';
import { NavController, IonicPage, AlertController, LoadingController } from 'ionic-angular';
import { AngularFireDatabase } from 'angularfire2/database';
import { Http } from '@angular/http';

@IonicPage()
@Component({
  selector: 'page-step4',
  templateUrl: 'step4.html',
  providers: [ AngularFireDatabase ]
})
export class Step4Page {

  private my_birthday: string = '';
  private partner_birthday: string = '';
  private flag: number = 0;
  public message: string;

  constructor(
    public navCtrl: NavController,
    public db: AngularFireDatabase,
    public alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    private http: Http
  ) {

  }

  home() {
    this.navCtrl.push("HomePage");
  }

  saveUserInformation() {

    let uid = window.localStorage.getItem('mbb-uid');

    let loading = this.loadingCtrl.create({
      content: 'Processing...'
    });
    loading.present();

    this.message = '';
    this.flag = 0;
    if(!this.my_birthday) {
      this.flag = 1;
      this.message += '- Your Birthday<br>';
    }
    if(!this.partner_birthday) {
      this.flag = 1;
      this.message += '- Your partner Birthday<br>';
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
      this.http.get("https://www.mybeesbox.com/fb/fb.php?action=update_user_bday" +
      "&uid=" + uid +
      "&my_birthday=" + this.my_birthday +
      "&partner_birthday=" + this.partner_birthday)
      .subscribe(data => {
        let result = JSON.parse(data.text());
        if(result.result) {
          this.db.object('users/' + uid).update({
            my_birthday: this.my_birthday,
            partner_birthday: this.partner_birthday
          }).then(() => {
            loading.dismiss().then(() => {
              this.navCtrl.push('HomePage');
              window.localStorage.setItem('mbb-mybday',this.my_birthday);
              window.localStorage.setItem('mbb-partnerbday',this.partner_birthday);
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

}
