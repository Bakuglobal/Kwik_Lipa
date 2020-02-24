import { Component, OnInit } from '@angular/core';
import { Router, NavigationExtras, ActivatedRoute } from '@angular/router';
import { FirestoreService } from '../services/firestore.service';
import { AlertController, ToastController, ModalController, NavController } from '@ionic/angular';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { DatabaseService } from '../services/database.service';
import { CPage } from '../c/c.page';
import { Location } from '@angular/common';
import { THIS_EXPR, ThrowStmt } from '@angular/compiler/src/output/output_ast';
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
  UnfilteredOffers = [];
  cart = [];
  showLoader = false;
  count = 0;
  showSearch = false;
  searchTerm: string;
  docID = [];

  productCollection: AngularFirestoreCollection<product>;
  // products: Observable<product[]>;


  constructor(
    public fireApi: FirestoreService,
    public navCtrl: Router,
    public alertCtrl: AlertController,
    private fs: AngularFirestore,
    private toastCtrl: ToastController,
    private db: DatabaseService,
    private modal: ModalController,
    private location: Location,
    private nav: NavController
  ) {
    
    console.log('shop name -- ' + this.shopSelected)

  }
  ngOnInit() {
  }

  // //cart count
  //     changeCount(number){
  //       // this.count = number ;
  //       this.fireApi.
  //         .subscribe(data => (this.shopSelected = data));
  //       console.log("sent data from home page : ", this.shopSelected);
  //     }
  //get products from database

  ionViewWillEnter() {
    this.showShop();
    this.productCollection = this.fs.collection(this.shopSelected, ref => {
      return ref.orderBy('currentprice', 'asc');
    })
    this.productCollection.valueChanges().subscribe(res => {
      this.offers = res;
      this.UnfilteredOffers = res;
    })
    console.log('products' + this.offers);
    // this.count = this.fireApi.getCount() ;

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


  //add items to the cart

  addToCart(item) {
    if (this.cart.includes(item)) {
      let index = this.cart.indexOf(item);
      this.cart[index].count++;
      let ct = this.count++;
      this.count = ct;
      this.fireApi.setCount(ct);


    } else {
      let mod = item;
      mod.count = 1;
      this.cart.push(mod);
      this.count = this.fireApi.getCount();
      this.count++;
      this.fireApi.setCount(this.count)

      console.log('Cart --> ' + JSON.stringify(this.cart));
      this.toast('Product added To cart');
    }
  }
  // go to home page

  back() {
    this.offers.length = 0;
    this.cart.length = 0;
    this.fireApi.setCount(0);
    this.fireApi.hiddenTabs = false;
    this.navCtrl.navigate(['tabs/tab1']);
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
    })
    await toast.present();
  }

  //  share cart details with cart page

  sendCart() {
    this.cart.forEach(item => {
      this.db.setData(item);
    })
    this.fireApi.hiddenTabs = true;
    this.navCtrl.navigate(['tabs/cart'])
  }
  //view a product details in a  modal
  async viewProduct(item) {
    const mod = await this.modal.create({
      component: CPage,
      componentProps: item

    })
    await mod.present()
  }
}
