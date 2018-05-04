import { Component } from '@angular/core';
import { NavController, IonicPage, LoadingController, AlertController } from 'ionic-angular';
import { AngularFireDatabase } from 'angularfire2/database';
import { Http } from '@angular/http';

@IonicPage()
@Component({
  selector: 'page-step1',
  templateUrl: 'step1.html',
  providers: [ AngularFireDatabase ]
})
export class Step1Page {

  constructor(
    public navCtrl: NavController,
    public db: AngularFireDatabase,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    private http: Http
  ) {

  }

  step2() {
    this.navCtrl.push('Step2Page');
  }

  setGender(i) {

    let loading = this.loadingCtrl.create({
      content: 'Processing...'
    });
    loading.present();

    let user_id = window.localStorage.getItem('mbb-uid');

    this.http.get("https://www.mybeesbox.com/fb/fb.php?action=update_user_gender&uid=" + user_id + "&g=" + i)
    .subscribe(data => {
      let result = JSON.parse(data.text());
      if(result.result) {
        this.db.object('users/' + user_id).update({
          gender: i
        }).then(() => {
          loading.dismiss().then(() => {
            this.navCtrl.push('Step2Page');
            window.localStorage.setItem('mbb-gender',i.toString());
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
