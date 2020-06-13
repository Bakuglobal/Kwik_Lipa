import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { FirestoreService } from 'src/app/services/firestore.service';


@Component({
  selector: 'app-lifestyle',
  templateUrl: './lifestyle.page.html',
  styleUrls: ['./lifestyle.page.scss'],
})
export class LifestylePage implements OnInit {

  constructor(    private location: Location,
    private service: FirestoreService,) { }

  ngOnInit() {
  }


  back(){
    this.service.hiddenTabs = false ;
    this.location.back();
  }

}
