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
categories: any[];
Fashion: any[];
diets:any[];
fitness: any[];
books:any[];
hair:any[];

  constructor(    private location: Location,
    private service: FirestoreService, 
    private youtube: YoutubeVideoPlayer,
    private navCtrl: Router
    ) {
      this.getShops();
      this.getCategories();
      this.getDietVideos();
      this.getFashionVlogs();
      this.getFitnessHealth();
      this.getBooks();
      this.getHairsBeauty();
    
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
    this.service.getShops().subscribe(res => {
      this.shops = res ;
      console.log(this.shops);
    })
  }
  getDietVideos(){
    this.service.getvideos('Diets and food').valueChanges().subscribe(res => {
      this.diets = res ;
      console.log('diets',this.diets);
    })
  }
  getFashionVlogs(){
    this.service.getvideos('Fashion Vlogs').valueChanges().subscribe(res => {
      this.Fashion = res ;
      console.log('fashion',this.Fashion);
    })
  }
  getFitnessHealth(){
    this.service.getvideos('Fitness and Health').valueChanges().subscribe(res => {
      this.fitness = res ;
      console.log('fitness',this.fitness);
    })
  }
  getBooks(){
    this.service.getvideos('Book reviews').valueChanges().subscribe(res => {
      this.books = res ;
      console.log('books',this.books);
    })
  }
  getHairsBeauty(){
    this.service.getvideos('Hair and Beauty').valueChanges().subscribe(res => {
      this.hair = res ;
      console.log('books',this.hair);
    })
  }
  
  getCategories(){
    this.service.getCats().valueChanges().subscribe(res => {
      this.categories = res ;
      console.log("Categories",this.categories);
    })
  }

}
