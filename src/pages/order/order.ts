import { Component } from '@angular/core';
import { NavController, IonicPage, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-order',
  templateUrl: 'order.html'
})
export class OrderPage {

  public order: string = null;

  constructor(
    public navCtrl: NavController,
    public params: NavParams
  ) {
    this.order = this.params.data.order;
    console.log('Order', this.order);
  }

  goBack() {
    this.navCtrl.pop();
  }

}
