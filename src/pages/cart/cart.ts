import { Component } from '@angular/core';
import { NavController, IonicPage, LoadingController, AlertController, Alert } from 'ionic-angular';
import { AngularFireDatabase } from 'angularfire2/database';
import { Http } from '@angular/http';
import { InAppBrowser } from '@ionic-native/in-app-browser';

@IonicPage()
@Component({
  selector: 'page-cart',
  templateUrl: 'cart.html',
  providers: [ AngularFireDatabase, InAppBrowser ]
})
export class CartPage {

  public products: any;
  public qty: any;
  public total: any = 0;
  public user_email: string;
  public user_pass: string;
  public count: any = 0;
  public order: any;

  constructor(
    public navCtrl: NavController,
    public alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    private http: Http,
    public db: AngularFireDatabase,
    private iab: InAppBrowser
  ) {
    if(window.localStorage.getItem('mbb-cart')) {
      this.products = JSON.parse(window.localStorage.getItem('mbb-cart'));
      this.qty = this.products.length;
      this.products.forEach(product => {
        this.total = this.total + parseFloat(product.price[0]);
        if(this.count == 0) {
          this.order = "p" + this.count.toString() + "=" + product.id + "&q" + this.count + "=1";
          this.count++;
        } else {
          this.order += "&p" + this.count.toString() + "=" + product.id + "&q" + this.count + "=1";
          this.count++;
        }
      });
      this.total = this.total.toFixed(2);
    } else {
      this.products = 0;
    }
  }

  completeOrder() {
    
    let loading = this.loadingCtrl.create({
      content: 'Processing...'
    });
    //loading.present();

    this.user_email = window.localStorage.getItem('mbb-email');
    this.user_pass = window.localStorage.getItem('mbb-pass');

    console.log("https://www.mybeesbox.com/fb/fb.php?action=complete_order&email=" + this.user_email + "&pass=" + this.user_pass + "&" + this.order + "&qty=" + this.qty);

    const browser = this.iab.create("https://www.mybeesbox.com/fb/fb.php?action=complete_order&email=" + this.user_email + "&pass=" + this.user_pass + "&" + this.order + "&qty=" + this.qty,'_blank', 'location=no,clearcache=yes,hideurlbar=yes');

    browser.on('loadstart').subscribe((data) => {
      console.log('Load Start',data);
    });

    browser.on('loadstop').subscribe((data) => {
      console.log('Load Stop',data);
    });

    browser.on('loaderror').subscribe((data) => {
      console.log('Load Error',data);
    });

    //browser.close();
  }

}
