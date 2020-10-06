import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ResumeChatPage } from './resume-chat.page';
import { DateAgoPipe } from 'src/app/pipes/date-ago.pipe';

const routes: Routes = [
  {
    path: '',
    component: ResumeChatPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ResumeChatPage,DateAgoPipe]
})
export class ResumeChatPageModule {}
