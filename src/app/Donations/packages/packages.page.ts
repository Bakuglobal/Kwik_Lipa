import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-packages',
  templateUrl: './packages.page.html',
  styleUrls: ['./packages.page.scss'],
})
export class PackagesPage implements OnInit {
packages = [1,2,3,4]
  constructor(
    private location: Location,
    private navCtrl: Router
  ) { }

  ngOnInit() {
  }
  back(){
    this.location.back();
  }
  goToShops(pack){
    console.log('selected package',pack);
    this.navCtrl.navigate(['tabs/Regionshop']);
  }
}
