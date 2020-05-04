import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-regions',
  templateUrl: './regions.page.html',
  styleUrls: ['./regions.page.scss'],
})
export class RegionsPage implements OnInit {
  regions = [1,2,3,4,5,6]
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
}
