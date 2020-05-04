import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';


@Component({
  selector: 'app-shop',
  templateUrl: './shop.page.html',
  styleUrls: ['./shop.page.scss'],
})
export class ShopPage implements OnInit {
  shops = [1,2,3,4,5,6]
  constructor(
    private location: Location,
    private navCtrl: Router
  ) { }

  ngOnInit() {
  }


  back(){
    this.location.back();
  }
  selectPackage(item){
    console.log('selected : ', item);
    this.navCtrl.navigate(['tabs/packages']);
  }
  cart(){
    this.navCtrl.navigate(['tabs/Donationcart']);
  }
}
