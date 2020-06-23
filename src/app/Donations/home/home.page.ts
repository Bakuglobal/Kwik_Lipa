import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { FirestoreService } from 'src/app/services/firestore.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  NGOs: any[];
  constructor(
    private location: Location,
    private navCrtl : Router,
    private service: FirestoreService
  ) {
    this.service.hiddenTabs = true ;
    this.getNGO();
   }

  ngOnInit() {
  }
back(){
  this.service.hiddenTabs = false ;
  this.location.back();
}
donate(){
this.navCrtl.navigate(['tabs/region']);
}
getNGO(){
  this.service.getNGO().valueChanges().subscribe(res => {
    this.NGOs = res ;
    console.log('NGOS',this.NGOs);
  })
}
}
