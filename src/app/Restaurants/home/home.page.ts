import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { FirestoreService } from 'src/app/services/firestore.service';
import { NavigationExtras, Router } from '@angular/router';
import { ADs } from 'src/app/models/ads';
import { error } from 'protractor';
import { YoutubeVideoPlayer } from '@ionic-native/youtube-video-player/ngx';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  Restaurants;
  recipe: any[];
  Ads: ADs[];
  products = [];
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
    slidesPerView: 2.5,
  }
  skeleton = [1, 2, 3];
  constructor(
    private location: Location,
    private service: FirestoreService,
    private navCtrl: Router,
    private youtube: YoutubeVideoPlayer,
  ) {
    this.service.hiddenTabs = true;
    this.getAds();
  }

  ngOnInit() {
    this.getRestaurants();
    this.getRecipeShop();
  }
  back() {
    this.service.hiddenTabs = false;
    this.location.back();
  }
  viewRecipeShop(item){
    console.log(item);
    let navigationExtras: NavigationExtras = {
      queryParams: item
    };
    this.service.hiddenTabs = true ;
    this.navCtrl.navigate(['tabs/Recipeprofile'], navigationExtras);
  }
  gotoRecipes(){
    this.service.hiddenTabs = true ;
    this.navCtrl.navigate(['tabs/recipes']);
  }
  getRecipeShop() {
    this.service.getRecipe().subscribe(res => {
      this.recipe = res;
      console.log("recipe", this.recipe);
    })
  }
  getRestaurants() {
    this.service.getRest().subscribe(res => {
      console.log('restaurants', res);
      this.Restaurants = res;
      this.getProducts();
    }, error => { console.log(error) }, () => { this.getProducts() })
  }
  getProducts() {
    this.service.getproducts("La Tasca Spanish Corner").valueChanges().subscribe(res => {
      res.forEach(item => { this.products.push(item); })
      console.log(this.products);
    }, error => { console.log(error) });
    this.service.getproducts("Mara Bites").valueChanges().subscribe(res => {
      res.forEach(item => { this.products.push(item); })
      console.log(this.products);
    }, error => { console.log(error) });
  }
    
  seeDetails(item){
    let navigationExtras: NavigationExtras = {
      queryParams: item
    };
    this.service.hiddenTabs = true ;
    this.navCtrl.navigate(['tabs/details'], navigationExtras);
  }
  goToRest(rest) {
    this.service.changeData(rest.Restaurant);
    let navigationExtras: NavigationExtras = {
      queryParams: rest
    };
    this.service.hiddenTabs = true;
    this.navCtrl.navigate(['tabs/profile'], navigationExtras);
  }
  getAds() {
    this.service.getFoodAds().subscribe(res => {
      this.Ads = res;
      console.log(this.Ads);
    })
  }
 
  
  posterToRest(shop) {
    // this.service.changeData(shop);
    let dt = this.filterItems(shop);
    console.log('params',dt);
    let navigationExtras: NavigationExtras = {
      queryParams: dt[0]
    };
    this.navCtrl.navigate(['tabs/profile'], navigationExtras);
  }
  filterItems(shop) {
    return this.Restaurants.filter(item => {
      return item.Restaurant.toLowerCase().indexOf(shop.toLowerCase()) > -1;
    });
  }
}
