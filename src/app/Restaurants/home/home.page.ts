import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { FirestoreService } from 'src/app/services/firestore.service';
import { NavigationExtras, Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  Restaurants;

  AdvertslideOpts = {
    initialSlide: 1,
    speed: 500,
    autoplay: true,
    slidesPerView: 1
  };
  slideme = {
    initialSlide: 0,
    speed: 500,
    autoplay: true,
    slidesPerView: 1.7,
  }
  skeleton = [1,2,3];
  constructor(
    private location: Location,
    private service: FirestoreService,
    private navCtrl: Router
  ) { 
    this.service.hiddenTabs = true ;
  }

  ngOnInit() {
    this.getRestaurants();
  }
  back(){
    this.service.hiddenTabs = false ;
    this.location.back();
  }
  getRestaurants(){
    this.service.getRest().subscribe(res => {
      console.log('restaurants',res);
      this.Restaurants = res ;
    });
  }
  goToRest(rest){
    this.service.changeData(rest.Restaurant);
    let navigationExtras: NavigationExtras = {
      queryParams: rest
    };
    this.service.hiddenTabs = true ;
    this.navCtrl.navigate(['tabs/profile'], navigationExtras);
  }
}
