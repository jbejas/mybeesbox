import { Component } from '@angular/core';
import { NavController, IonicPage, LoadingController, ToastController, AlertController } from 'ionic-angular';
import { AngularFireDatabase } from 'angularfire2/database';
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
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController,
    public alertCtrl: AlertController,
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
          if(product.variation) {
            this.order += "&variation" + this.count.toString() + "=" + product.variation
          }
          this.count++;
        } else {
          this.order += "&p" + this.count.toString() + "=" + product.id + "&q" + this.count + "=1";
          if(product.variation) {
            this.order += "&variation" + this.count.toString() + "=" + product.variation
          }
          this.count++;
        }
      });
      this.total = this.total.toFixed(2);
    } else {
      this.products = 0;
    }
  }

  home() {
    this.navCtrl.setRoot('HomePage');
  }

  completeOrder() {
    
    let loading = this.loadingCtrl.create({
      content: 'Processing...'
    });
    //loading.present();

    this.user_email = window.localStorage.getItem('mbb-email');
    this.user_pass = window.localStorage.getItem('mbb-pass');

    console.log("https://www.mybeesbox.com/fb/fb.php?action=complete_order&email=" + this.user_email + "&pass=" + this.user_pass + "&" + this.order + "&qty=" + this.qty);

    let url = encodeURI("https://www.mybeesbox.com/fb/fb.php?action=complete_order&email=" + this.user_email + "&pass=" + this.user_pass + "&" + this.order + "&qty=" + this.qty);
    const browser = this.iab.create(url, '_blank', 'location=no,clearcache=yes,clearsessioncache=yes');
    //const browser = this.iab.create("https://www.lagaceta.com.ar",'_blank', 'location=no');

    browser.on('loadstart').subscribe((data) => {
      console.log('Load Start',JSON.stringify(data));
      if(data.url.includes("cancel_order=true")) {
        var oid = data.url.substring(data.url.lastIndexOf("order_id=")+9,data.url.lastIndexOf("&redirect"));
        window.localStorage.removeItem('mbb-cart');
        this.products = 0;
        this.navCtrl.setRoot('HomePage', { order: 'cancelled', oid: oid }).then(() => {
          browser.close();
        });
      }

      if(data.url.includes("checkout/order-received/")) {
        var oid = data.url.substring(data.url.lastIndexOf("received/")+9,data.url.lastIndexOf("/?key"));
        window.localStorage.removeItem('mbb-cart');
        this.products = 0;
        this.navCtrl.setRoot('HomePage', { order: 'processed', oid: oid }).then(() => {
          browser.close();
        });
      }

    });

    browser.on('loadstop').subscribe((data) => {
      console.log('Load Stop',JSON.stringify(data));
    });

    browser.on('loaderror').subscribe((data) => {
      console.log('Load Error',data);
      browser.close();
      setTimeout(() => {
        let alert = this.alertCtrl.create({
          title: "HTTP Error",
          message: "Check your device is connected to internet.",
          buttons: ["OK"]
        });
        alert.present();
      }, 500);
    });

    //browser.close();
  }

  removeItem(i) {

    this.total = 0;
    this.products.splice(i, 1);

    this.products.forEach(product => {
      this.total = this.total + parseFloat(product.price[0]);
    });
    this.total = this.total.toFixed(2);

    window.localStorage.setItem('mbb-cart',JSON.stringify(this.products));
    let toast = this.toastCtrl.create({
      message: 'Product removed from Cart!',
      duration: 1000
    });
    toast.present();
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

  goBack() {
    this.navCtrl.pop();
  }

}
