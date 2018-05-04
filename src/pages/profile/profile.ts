import { Component } from '@angular/core';
import { NavController, IonicPage, AlertController, LoadingController, ToastController, Events } from 'ionic-angular';
import { AngularFireDatabase } from 'angularfire2/database';
import { Http } from '@angular/http';

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
  providers: [ AngularFireDatabase ]
})
export class ProfilePage {

  private uid: string;
  private name: string = '';
  private lastname: string = '';
  private address: string = '';
  private city: string = '';
  private state: string = '';
  private zip: string = '';
  private phone: string = '';
  private gender: string;
  private status: string;
  private my_birthday: string;
  private partner_birthday: string;
  private flag: number = 0;
  public message: string;

  constructor(
    public navCtrl: NavController,
    public db: AngularFireDatabase,
    public alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    private http: Http,
    public toast: ToastController,
    public events: Events
  ) {
    this.uid = window.localStorage.getItem('mbb-uid');
    this.name = window.localStorage.getItem('mbb-name');
    this.lastname = window.localStorage.getItem('mbb-lastname');
    this.address = window.localStorage.getItem('mbb-address');
    this.city = window.localStorage.getItem('mbb-city');
    this.state = window.localStorage.getItem('mbb-state');
    this.zip = window.localStorage.getItem('mbb-zip');
    this.phone = window.localStorage.getItem('mbb-phone');
    this.status = window.localStorage.getItem('mbb-status');
    this.gender = window.localStorage.getItem('mbb-gender');
    this.my_birthday = window.localStorage.getItem('mbb-mybday');
    this.partner_birthday = window.localStorage.getItem('mbb-partnerbday');
  }

  saveUserInformation() {

    let loading = this.loadingCtrl.create({
      content: 'Processing...'
    });
    loading.present();

    this.http.get("https://www.mybeesbox.com/fb/fb.php?action=update_full_profile&uid=" + this.uid +
    "&name=" + this.name +
    "&lastname=" + this.lastname +
    "&address=" + this.address +
    "&city=" + this.city +
    "&state=" + this.state +
    "&zip=" + this.zip +
    "&phone=" + this.phone +
    "&gender=" + this.gender +
    "&status=" + this.status +
    "&my_birthday=" + this.my_birthday +
    "&partner_birthday=" + this.partner_birthday)
    .subscribe(data => {
      let result = JSON.parse(data.text());
      if(result.result) {
        this.db.object('users/' + this.uid).update({
          gender: this.gender,
          name: this.name,
          lastname: this.lastname,
          address: this.address,
          city: this.city,
          state: this.state,
          phone: this.phone,
          status: this.status,
          my_birthday: this.my_birthday,
          partner_birthday: this.partner_birthday
        }).then(() => {
          window.localStorage.setItem('mbb-name',this.name);
          window.localStorage.setItem('mbb-lastname',this.lastname);
          window.localStorage.setItem('mbb-address',this.address);
          window.localStorage.setItem('mbb-city',this.city);
          window.localStorage.setItem('mbb-state',this.state);
          window.localStorage.setItem('mbb-zip',this.zip);
          window.localStorage.setItem('mbb-phone',this.phone);
          window.localStorage.setItem('mbb-mybday',this.my_birthday);
          window.localStorage.setItem('mbb-partnerbday',this.partner_birthday);
          window.localStorage.setItem('mbb-gender',this.gender);
          window.localStorage.setItem('mbb-status',this.status);
          this.events.publish('user:login');
          loading.dismiss().then(() => {
            let toast = this.toast.create({
              message: "Profile Updated!",
              duration: 1000
            });
            toast.present();
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
