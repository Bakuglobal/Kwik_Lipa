import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { EReceiptPage } from './e-receipt.page';

import { NgxQRCodeModule } from 'ngx-qrcode2';


const routes: Routes = [
  {
    path: '',
    component: EReceiptPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NgxQRCodeModule,
    RouterModule.forChild(routes)
  ],
  declarations: [EReceiptPage]
})
export class EReceiptPageModule {}
