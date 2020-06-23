import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { FirestoreService } from 'src/app/services/firestore.service';

@Component({
  selector: 'app-regions',
  templateUrl: './regions.page.html',
  styleUrls: ['./regions.page.scss'],
})
export class RegionsPage implements OnInit {
  regions: any[];
  constructor(
    private location: Location,
    private navCtrl: Router,
    private service: FirestoreService
  ) {
    this.getRegions();
   }

  ngOnInit() {
  }


  back(){
    this.location.back();
  }
  selectPackage(item){
    this.service.setRegion(item);
    console.log('selected : ', item);
    this.navCtrl.navigate(['tabs/packages']);
  }
  getRegions(){
    this.service.getRegions().valueChanges().subscribe(res => {
      this.regions = res ;
      console.log(this.regions);
    })
  }
}
