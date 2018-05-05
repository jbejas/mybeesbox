import { Component } from '@angular/core';
import { NavController, IonicPage, AlertController, LoadingController } from 'ionic-angular';
import { AngularFireDatabase } from 'angularfire2/database';
import { Http } from '@angular/http';

@IonicPage()
@Component({
  selector: 'page-custom',
  templateUrl: 'custom.html',
  providers: [ AngularFireDatabase ]
})
export class CustomPage {

  private name: string = '';
  private lastname: string = '';
  private address: string = '';
  private city: string = '';
  private state: string = '';
  private zip: string = '';
  private phone: string = '';
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

  goBack() {
    this.navCtrl.pop();
  }

  saveUserInformation() {

    let uid = window.localStorage.getItem('mbb-uid');

    let loading = this.loadingCtrl.create({
      content: 'Processing...'
    });
    loading.present();

    this.message = '';
    this.flag = 0;
    if(!this.name) {
      this.flag = 1;
      this.message += '- Name<br>';
    }
    if(!this.lastname) {
      this.flag = 1;
      this.message += '- Lastname<br>';
    }
    if(!this.address) {
      this.flag = 1;
      this.message += '- Address<br>';
    }
    if(!this.city) {
      this.flag = 1;
      this.message += '- City<br>';
    }
    if(!this.state) {
      this.flag = 1;
      this.message += '- State<br>';
    }
    if(!this.zip) {
      this.flag = 1;
      this.message += '- Zip Code<br>';
    }
    if(!this.phone) {
      this.flag = 1;
      this.message += '- Phone Number<br>';
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
      this.http.get("https://www.mybeesbox.com/fb/fb.php?action=update_user" +
      "&uid=" + uid +
      "&name=" + this.name +
      "&lastname=" + this.lastname +
      "&address=" + this.address +
      "&city=" + this.city +
      "&state=" + this.state +
      "&zip=" + this.zip +
      "&phone=" + this.phone)
      .subscribe(data => {
        let result = JSON.parse(data.text());
        if(result.result) {
          this.db.object('users/' + uid).update({
            name: this.name,
            lastname: this.lastname,
            address: this.address,
            city: this.city,
            state: this.state,
            phone: this.phone
          }).then(() => {
            window.localStorage.setItem('mbb-name',this.name);
            window.localStorage.setItem('mbb-lastname',this.lastname);
            window.localStorage.setItem('mbb-address',this.address);
            window.localStorage.setItem('mbb-city',this.city);
            window.localStorage.setItem('mbb-state',this.state);
            window.localStorage.setItem('mbb-zip',this.zip);
            window.localStorage.setItem('mbb-phone',this.phone);
            loading.dismiss().then(() => {
              this.navCtrl.push('Step4Page');
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

  viewCart() {
    this.navCtrl.push('CartPage');
  }

}
