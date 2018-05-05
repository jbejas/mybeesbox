import { Component } from '@angular/core';
import { NavController, IonicPage, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-pre-curated',
  templateUrl: 'pre-curated.html'
})
export class PreCuratedPage {

  public firstLine: string;
  public secondLine: string;
  public category: string;

  constructor(
    public navCtrl: NavController,
    public params: NavParams
  ) {
    this.firstLine = this.params.data.first;
    this.secondLine = this.params.data.second;
    this.category = this.params.data.category;
  }

  openCategory(i) {
    this.navCtrl.push('CategoryPage', { first: this.firstLine, second: this.secondLine, category: this.category, subcategory: i });
  }

  goBack() {
    this.navCtrl.pop();
  }

  viewCart() {
    this.navCtrl.push('CartPage');
  }

}
