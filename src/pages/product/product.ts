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
  public variation: any;

  constructor(
    public navCtrl: NavController,
    public params: NavParams,
    public toastCtrl: ToastController
  ) {
    this.product = this.params.data.item;
    if(this.product.vars) {
      if(this.product.vars[0].name) {
        this.variation = this.product.vars[0].atkey + "|" + this.product.vars[0].atvalue + "|" + this.product.vars[0].id + "|" + this.product.vars[0].name;
      } else {
        this.variation = this.product.vars[1].atkey + "|" + this.product.vars[1].atvalue + "|" + this.product.vars[1].id + "|" + this.product.vars[0].name;
      }
    }
    console.log('Product',this.product);
  }

  addToCart() {
    console.log('Variation -> ' + this.variation);
    console.log('Product -> ' + this.product);
    if(window.localStorage.getItem('mbb-cart')) {
      this.cart = JSON.parse(window.localStorage.getItem('mbb-cart'));
      this.product['variation'] = this.variation;
      this.cart.push(this.product);
      window.localStorage.setItem('mbb-cart',JSON.stringify(this.cart));
    } else {
      this.cart = [];
      this.product['variation'] = this.variation;
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
