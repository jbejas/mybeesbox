import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { OrdersPage } from './orders';
// PIPES
import { PipesModule } from '../../pipes/pipes.module';

@NgModule({
  declarations: [
    OrdersPage
  ],
  imports: [
    IonicPageModule.forChild(OrdersPage),
    PipesModule
  ],
})
export class OrdersPageModule {}
