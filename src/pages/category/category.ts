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
  public allproducts: any;
  public firstLine: string;
  public secondLine: string;
  public category: string;
  public subcategory: string;
  public show: boolean = false;
  public searchTerm: string = '';

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
    this.subcategory = this.params.data.subcategory;
    console.log('Subcategory -> ' + this.subcategory);
  }

  viewItem(item) {
    this.navCtrl.push('ProductPage', { item: item });
  }

  ionViewDidLoad() {
    this.db.list('products', ref => ref.orderByChild('category/slug').equalTo(this.category)).snapshotChanges().subscribe(products => {
      this.products = [];
      products.forEach(product => { 
        this.products.push(product.payload.val());
      });
      this.show = true;
      this.allproducts = this.products;
      console.log('Products',this.products);
    });
  }

  setFilteredItems() {
    console.log('Search Term -> ' + this.searchTerm);
    this.allproducts = [];
    return this.products.filter((item) => {
      if(item.title.toLowerCase().indexOf(this.searchTerm.toLowerCase()) > -1) {
        console.log('Item',item.title);
        this.allproducts.push(item);
      }
    });
  }

  goBack() {
    this.navCtrl.pop();
  }

  viewCart() {
    this.navCtrl.push('CartPage');
  }

}
