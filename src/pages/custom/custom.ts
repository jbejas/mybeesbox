import { Component } from '@angular/core';
import { NavController, IonicPage, AlertController, LoadingController } from 'ionic-angular';
import { Http } from '@angular/http';

@IonicPage()
@Component({
  selector: 'page-custom',
  templateUrl: 'custom.html'
})
export class CustomPage {

  public name: string;
  public lastname: string;
  public email: string;
  public address: string;
  public city: string;
  public state: string ;
  public zip: string;
  public phone: string;
  public gender: string;
  public flag: number = 0;
  public message: string;

  constructor(
    public navCtrl: NavController,
    public alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    private http: Http
  ) {

  }

  goBack() {
    this.navCtrl.pop();
  }

  viewCart() {
    this.navCtrl.push('CartPage');
  }

  sendProject() {

    let loading = this.loadingCtrl.create({
      content: 'Processing...'
    });
    loading.present();

    this.name = window.localStorage.getItem('mbb-name');
    this.lastname = window.localStorage.getItem('mbb-lastname');
    this.address = window.localStorage.getItem('mbb-address');
    this.city = window.localStorage.getItem('mbb-city');
    this.state = window.localStorage.getItem('mbb-state');
    this.zip = window.localStorage.getItem('mbb-zip');
    this.phone = window.localStorage.getItem('mbb-phone');
    this.email = window.localStorage.getItem('mbb-email');
    this.gender = window.localStorage.getItem('mbb-gender');

    this.http.get("https://www.mybeesbox.com/fb/fb.php?action=custom_boxes&name=" + this.name +
    "&lastname=" + this.lastname +
    "&address=" + this.address +
    "&city=" + this.city +
    "&state=" + this.state +
    "&zip=" + this.zip +
    "&phone=" + this.phone +
    "&gender=" + this.gender +
    "&message=" + this.message)
    .subscribe(data => {
      loading.dismiss();
      let result = JSON.parse(data.text());
      if(result.result) {
        let alert = this.alertCtrl.create({
          title: "Success!",
          message: "Your Custom Box request has been sent! We will be in touch as soon as possible!",
          buttons: ["OK"]
        });
        alert.present();
        this.message = '';
      } else {
        let alert = this.alertCtrl.create({
          title: "Error!",
          message: result.message,
          buttons: ["OK"]
        });
        alert.present();
      }
    }, error => {
      loading.dismiss();
        let alert = this.alertCtrl.create({
          title: "Error",
          message: "An error occured while trying to send your message. Please try again.",
          buttons: ["OK"]
        });
        alert.present();
    });
  }

}
