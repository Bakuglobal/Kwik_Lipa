import { Component, OnInit } from '@angular/core';
import { FirestoreService } from '../services/firestore.service';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage  implements OnInit{


  constructor(
    public service: FirestoreService,
    public platform: Platform
  ) {}


  ngOnInit(){
    // this.platform.backButton.unsubscribe()
  }


}
