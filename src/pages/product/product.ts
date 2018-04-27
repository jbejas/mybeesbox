import { Component } from '@angular/core';
import { NavController, IonicPage, NavParams, ToastController } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-product',
  templateUrl: 'product.html'
})
export class ProductPage {

  public product: any;
  public cart: any;

  constructor(
    public navCtrl: NavController,
    public params: NavParams,
    public toastCtrl: ToastController
  ) {
    this.product = this.params.data.item;
    console.log('Product',this.product);
  }

  addToCart() {
    if(window.localStorage.getItem('mbb-cart')) {
      this.cart = JSON.parse(window.localStorage.getItem('mbb-cart'));
      this.cart.push(this.product);
      window.localStorage.setItem('mbb-cart',JSON.stringify(this.cart));
    } else {
      this.cart = [];
      this.cart.push(this.product);
      window.localStorage.setItem('mbb-cart',JSON.stringify(this.cart));
    }
    let toast = this.toastCtrl.create({
      message: 'Product Added to Cart!',
      duration: 1000
    });
    toast.onDidDismiss(() => {
      this.navCtrl.pop();
    });
    toast.present();
  }

  goBack() {
    this.navCtrl.pop();
  }

}
