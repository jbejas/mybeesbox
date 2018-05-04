import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CartPage } from './cart';
// PIPES
import { PipesModule } from '../../pipes/pipes.module';

@NgModule({
  declarations: [
    CartPage
  ],
  imports: [
    IonicPageModule.forChild(CartPage),
    PipesModule
  ],
})
export class CartPageModule {}
