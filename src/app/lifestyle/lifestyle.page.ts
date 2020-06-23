import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { FirestoreService } from 'src/app/services/firestore.service';
import { YoutubeVideoPlayer } from '@ionic-native/youtube-video-player/ngx';
import { Shop } from '../models/shops';
import { NavigationExtras, Router } from '@angular/router';



@Component({
  selector: 'app-lifestyle',
  templateUrl: './lifestyle.page.html',
  styleUrls: ['./lifestyle.page.scss'],
})
export class LifestylePage implements OnInit {
shops: any[];

slideme = {
  initialSlide: 0,
  speed: 500,
  autoplay: true,
  slidesPerView: 3,
}
AdvertslideOpts = {

}
vidoes: any[];
categories: any[];
trending: any[];

  constructor(    private location: Location,
    private service: FirestoreService, 
    private youtube: YoutubeVideoPlayer,
    private navCtrl: Router
    ) {
      this.getShops();
     }

  ngOnInit() {
  }
  shopProfile(shop){
      this.service.changeData(shop.shop);
      let dt = shop;
      console.log('params',dt);
      let navigationExtras: NavigationExtras = {
        queryParams: dt
      };
      this.navCtrl.navigate(['tabs/shopprofile'], navigationExtras);
  }

  back(){
    this.service.hiddenTabs = false ;
    this.location.back();
  }

  // PLAY YOUTUBE VIDEO
  openMyVideo(id){
    this.youtube.openVideo(id);
  }
  getShops(){
    this.service.getShops().valueChanges().subscribe(res => {
      this.shops = res ;
      console.log(this.shops);
    })
  }
  getVideos(cat){
    this.service.getvideos(cat)

  }
  getCategories(){
    this.service.getCats().valueChanges().subscribe(res => {

    })
  }

}
