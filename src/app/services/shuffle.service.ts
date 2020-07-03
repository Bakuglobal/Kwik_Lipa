import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Shops, Restaurants } from '../models/shops';
import { Meal } from '../models/meal';
import { Lifestyle } from '../models/lifestyle';
import { Product } from '../models/product';

@Injectable({
  providedIn: 'root'
})
export class ShuffleService {
  shops: Shops[]=[];
  restaurants: Restaurants[]=[];
  foodPool: Meal[]=[];
  videos: Lifestyle[]=[];
  productPool: Product[]=[];


  constructor(
    private fs: AngularFirestore
  ) {
    this.getShops();
    this.getRestaurants();
    this.getAllvideos();
  }



  // search fliters for shops
  getShops() {
    this.fs.collection<Shops>('shops').valueChanges().subscribe(res => {
      this.shops = res;
      console.table(this.shops);
      this.createProductPool();
    }, err => {
      console.log(err);
    });
  }
  ShopSearch(shopname) {
    let result = this.filterShop(shopname);
    return result;
  }
  filterShop(shopname) {
    return this.shops.filter(item => {
      return item.shop.toLowerCase().indexOf(shopname.toLowerCase()) > -1;
    });
  }


  // search filters for food
  getRestaurants() {
    this.fs.collection<Restaurants>('restaurants').valueChanges().subscribe(res => {
      this.restaurants = res;
      console.table(this.restaurants);
      this.createFoodPool();
    }, err => {
      console.log(err);
    });
  }
  getMeals(rest) {
    this.fs.collection<Meal>(rest).valueChanges().subscribe(res => {
      console.table(res);
      res.forEach(item => {
        this.foodPool.push(item);
        console.log('======');
        // console.table(this.foodPool);
      })
    }, err => {
      console.log(err);
    })
  }
  createFoodPool() {
    this.restaurants.forEach(item => {
      this.getMeals(item.Restaurant)
    })
  }
  searchRestaurant(restname){
    let rests = this.filterRest(restname);
    return rests ;
  }
  filterRest(restname) {
    return this.restaurants.filter(item => {
      return item.Restaurant.toLowerCase().indexOf(restname.toLowerCase()) > -1;
    });
  }

  searchFood(foodname) {
    let food = this.filterFood(foodname);
    return food;
  }
  filterFood(foodname) {
    return this.foodPool.filter(item => {
      return item.Meal.toLowerCase().indexOf(foodname.toLowerCase()) > -1;
    });
  }


  // search filters for lifestyle videos
  getAllvideos() {
    this.fs.collection<Lifestyle>('lifestyleVideos').valueChanges().subscribe(res => {
      this.videos = res;
      console.table(this.videos);
    }, err => {
      console.log(err);
    });
  }
  searchVideo(videoname) {
    let video = this.filterVideo(videoname);
    return video;
  }
  filterVideo(videoname) {
    return this.videos.filter(item => {
      return item.Title.toLowerCase().indexOf(videoname.toLowerCase()) > -1;
    });
  }

  // search filters for products

  createProductPool(){
    console.log('shops',this.shops)
    this.shops.forEach(item => {
      this.getProducts(item.shop);
      console.log(item.shop);
    })
  }
  getProducts(shop){
    this.fs.collection<Product>(shop).valueChanges().subscribe(res => {
      console.table(res);
      res.forEach(item => {
        this.productPool.push(item);
      });
    },err => {
      console.log(err);
    })
  }
  searchProduct(productname){
    let products = this.filterProduct(productname);
    return products;
  }
  filterProduct(productname) {
    return this.productPool.filter(item => {
      return item.product.toLowerCase().indexOf(productname.toLowerCase()) > -1;
    });
  }

}
