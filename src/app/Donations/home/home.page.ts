import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { FirestoreService } from 'src/app/services/firestore.service';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';


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
    private service: FirestoreService,
    private iab: InAppBrowser,

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
inbrowser(link){
  console.log("Opens link in the app");
  const target = '_blank';
  // const options = { location : 'no' } ;
  this.iab.create(link,target);
}
}
