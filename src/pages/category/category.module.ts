import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CategoryPage } from './category';
// PIPES
import { PipesModule } from '../../pipes/pipes.module';

@NgModule({
  declarations: [
    CategoryPage
  ],
  imports: [
    IonicPageModule.forChild(CategoryPage),
    PipesModule
  ],
})
export class CategoryPageModule {}
