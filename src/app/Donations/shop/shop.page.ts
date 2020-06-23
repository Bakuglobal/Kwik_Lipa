import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { FirestoreService } from 'src/app/services/firestore.service';


@Component({
  selector: 'app-shop',
  templateUrl: './shop.page.html',
  styleUrls: ['./shop.page.scss'],
})
export class ShopPage implements OnInit {
  shops: any[];
  region : any ;
  constructor(
    private location: Location,
    private navCtrl: Router,
    private service: FirestoreService
  ) {
    this.getShops();
    this.getRegion();
   }

  ngOnInit() {
  }
  getRegion(){
   this.region =  this.service.getRegion();
  }

  back(){
    this.location.back();
  }
  selectPackage(item){
    console.log('selected : ', item);
    this.navCtrl.navigate(['tabs/packages']);
  }
  getShops(){
    this.service.getNgoShops().valueChanges().subscribe(res => {
      this.shops = res ;
      console.log('shops',this.shops)
    })
  }
  cart(){
    this.navCtrl.navigate(['tabs/Donationcart']);
  }
}
