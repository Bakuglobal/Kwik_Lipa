import { Component, OnInit } from '@angular/core';
import { Router, NavigationExtras, ActivatedRoute } from '@angular/router';
import { FirestoreService } from '../services/firestore.service';
import { AlertController, ToastController, ModalController, NavController } from '@ionic/angular';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { DatabaseService } from '../services/database.service';
import { CPage } from '../c/c.page';
import { Location } from '@angular/common';
import { THIS_EXPR, ThrowStmt } from '@angular/compiler/src/output/output_ast';
import { Category } from '../models/categories';
import { Product } from '../models/product';
// import { Observable } from 'rxjs';
// import { AdMobFree } from '@ionic-native/admob-free/ngx';


//interface
export interface product {
  currentprice: string;
  image: string;
  initialprice: string;
  product: string;
  quantity: string;
  shop: string;
  status: string;
}

@Component({
  selector: 'app-offers',
  templateUrl: './offers.page.html',
  styleUrls: ['./offers.page.scss'],
})

export class OffersPage implements OnInit {

  //variables

  shopSelected: any;
  offers = [];
  UnfilteredOffers :Product [];
  cart = [];
  showLoader = false;
  count = 0;
  showSearch = false;
  searchTerm: string;
  docID = [];
  skeleton = [1,2,3,4,5];
  category: string  = 'All';
  categories = [] ;
  productCollection: AngularFirestoreCollection<product>;

  constructor(
    public fireApi: FirestoreService,
    public navCtrl: Router,
    public alertCtrl: AlertController,
    private fs: AngularFirestore,
    private toastCtrl: ToastController,
    public db: DatabaseService,
    private modal: ModalController,
    private nav: NavController,
    private location: Location
  ) {

    console.log('shop name -- ' + this.shopSelected);
    this.fireApi.hiddenTabs = true ;

  }
  ngOnInit() {
    
  }

  ionViewWillEnter() {
    this.showShop();
    // this.productCollection = this.fs.collection(this.shopSelected, ref => {
    //   return ref.orderBy('currentprice', 'asc');
    // })
    this.db.getproducts(this.shopSelected).valueChanges().subscribe(res => {
      this.offers = res;
      this.UnfilteredOffers = res;
    })
    console.log('products' + this.UnfilteredOffers);
    
    this.db.getCategories(this.shopSelected).valueChanges().subscribe(res => {
      this.categories = res.categories ;
      console.log(this.categories);
    });
    this.category = 'All' ;
  }
  filterCategory(){
    console.log(this.category);
    if(this.category === "All"){
      console.log(this.category);
      this.offers = this.UnfilteredOffers ;
    }else {
      console.log('unfiltered',this.UnfilteredOffers);
      this.offers  = this.filtercat();
    }
  }
  filtercat(){
    return this.UnfilteredOffers.filter(item => {
      console.log(item.category);
      return item.category.toLowerCase().indexOf(this.category.toLowerCase()) > -1;
    });
  }

  // searchbar
  showSearchBar() {
    if (this.showSearch == false) {
      this.showSearch = true;
    } else {
      this.showSearch = false;
    }
  }
  setFilteredItems() {
    if (this.searchTerm != null || this.searchTerm != '') {
      this.offers = this.filterItems()
      console.log(this.offers)
    }
  }

  filterItems() {
    return this.UnfilteredOffers.filter(item => {
      return item.product.toLowerCase().indexOf(this.searchTerm.toLowerCase()) > -1;
    });
  }

  addToCart(item) {
    // this.contains(this.cart, item);
    this.db.addCart(item);
    this.toast('Product added To cart');
  }
  // go to home page

  back() {
    this.offers.length = 0;
    this.cart.length = 0;
    this.fireApi.setCount(0);
    this.categories.length = 0 ;
    this.UnfilteredOffers.length = 0 ;
    this.fireApi.hiddenTabs = false;
    this.fireApi.shareShopBy('shopBy');
    this.location.back();
    // this.navCtrl.navigate(['tabs/tab1']);
  }


  //get a shop name

  showShop() {
    this.fireApi.serviceData
      .subscribe(data => (this.shopSelected = data));
    console.log("sent data from home page : ", this.shopSelected);
  }

  //toast message

  async toast(data) {
    const toast = await this.toastCtrl.create({
      message: data,
      duration: 1000
    });
    await toast.present();
  }

  //  share cart details with cart page

  sendCart() {
    this.fireApi.hiddenTabs = true;
    this.navCtrl.navigate(['tabs/cart'])
  }
  //view a product details in a  modal
  async viewProduct(item) {
    const mod = await this.modal.create({
      component: CPage,
      componentProps: item
    });
    await mod.present()
  }
}
