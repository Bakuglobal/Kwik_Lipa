import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { IpaytransmodalPage } from './ipaytransmodal.page';

const routes: Routes = [
  {
    path: '',
    component: IpaytransmodalPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [IpaytransmodalPage]
})
export class IpaytransmodalPageModule {}
