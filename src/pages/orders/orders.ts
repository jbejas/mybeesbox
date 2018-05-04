import { Component } from '@angular/core';
import { NavController, IonicPage, LoadingController } from 'ionic-angular';
import { AngularFireDatabase } from 'angularfire2/database';

@IonicPage()
@Component({
  selector: 'page-orders',
  templateUrl: 'orders.html',
  providers: [ AngularFireDatabase ]
})
export class OrdersPage {

  public name: string = null;
  public lastname: string = null;
  public email: string = null;
  public orders: any = [];
  public show: boolean = false;

  constructor(
    public navCtrl: NavController,
    public loadingCtrl: LoadingController,
    public db: AngularFireDatabase
  ) {
    this.email = window.localStorage.getItem('mbb-email');
    if(window.localStorage.getItem('mbb-name')) {
      this.name = window.localStorage.getItem('mbb-name');
      this.lastname = window.localStorage.getItem('mbb-lastname');
    }
  }

  ionViewDidLoad() {
    let loading = this.loadingCtrl.create({
      content: "Loading orders..."
    });
    loading.present();
    this.db.list('orders', ref => ref.orderByChild('billing_address/email').equalTo(this.email)).snapshotChanges().subscribe(orders => {
      console.log('Orders', orders);
      orders.forEach(order => {
        this.orders.push(order.payload.val());
      });
      loading.dismiss().then(() => {
        this.show = true;
      })
    })
  }

  viewOrder(order) {
    this.navCtrl.push("OrderPage", { order: order });
  }

  goBack() {
    this.navCtrl.pop();
  }

}
