import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { FeaturedmodalPage } from './featuredmodal.page';

const routes: Routes = [
  {
    path: '',
    component: FeaturedmodalPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [FeaturedmodalPage]
})
export class FeaturedmodalPageModule {}
