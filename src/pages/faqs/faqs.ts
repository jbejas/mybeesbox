import { Component } from '@angular/core';
import { NavController, IonicPage } from 'ionic-angular';
import { AngularFireDatabase } from 'angularfire2/database';
import { constants } from '../../environments/environment';

@IonicPage()
@Component({
  selector: 'page-faqs',
  templateUrl: 'faqs.html',
  providers: [ AngularFireDatabase ]
})
export class FaqsPage {

  private faqs: any;

  constructor(
    public navCtrl: NavController,
    public db: AngularFireDatabase
  ) {
    this.db.list('faq').valueChanges().subscribe(faqs => {
      this.faqs = faqs;
      console.log('Faqs',this.faqs);
    })
  }

}
