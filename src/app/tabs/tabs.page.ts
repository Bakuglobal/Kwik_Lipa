import { Component, OnInit } from '@angular/core';
import { FirestoreService } from '../services/firestore.service';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage  implements OnInit{

  count = '0';
  constructor(
    public service: FirestoreService,
    public platform: Platform
  ) {
    this.service.serviceNotice.subscribe(res => {
      this.count = res ;
      console.log(this.count)
    });
  }


  ngOnInit(){
    // this.platform.backButton.unsubscribe()
  }


}
