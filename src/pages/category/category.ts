import { Component } from '@angular/core';
import { NavController, IonicPage, LoadingController, NavParams } from 'ionic-angular';
import { AngularFireDatabase } from 'angularfire2/database';

@IonicPage()
@Component({
  selector: 'page-category',
  templateUrl: 'category.html',
  providers: [ AngularFireDatabase ]
})
export class CategoryPage {

  public filter: string;
  public products: any;
  public firstLine: string;
  public secondLine: string;
  public category: string;

  constructor(
    public navCtrl: NavController,
    public db: AngularFireDatabase,
    public loadingCtrl: LoadingController,
    public params: NavParams
  ) {
    this.filter = 'new';
    this.firstLine = this.params.data.first;
    this.secondLine = this.params.data.second;
    this.category = this.params.data.category;
  }

  viewItem(item) {
    this.navCtrl.push('ProductPage', { item: item });
  }

  ionViewDidLoad() {
    this.products = [];
    this.db.list('products', ref => ref.orderByChild('category/slug').equalTo(this.category)).snapshotChanges().subscribe(products => {
      products.forEach(product => {
        this.products.push(product.payload.val());
      });
      console.log('Products', this.products);
    })
  }

  segmentChanged(s) {
    console.log('Segment -> ' + s);
  }

}
