import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { FeaturedproductsPage } from './featuredproducts.page';

const routes: Routes = [
  {
    path: '',
    component: FeaturedproductsPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [FeaturedproductsPage]
})
export class FeaturedproductsPageModule {}
