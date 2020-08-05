import { Component, OnInit } from '@angular/core';
import { FirestoreService } from '../services/firestore.service';
import { Router, ActivatedRoute } from '@angular/router';
import { map } from 'rxjs/operators';
import { AngularFirestore } from '@angular/fire/firestore';
import { Shops, Shop } from '../models/shops';
import { ModalController, ActionSheetController, ToastController } from '@ionic/angular';
import { SokomodalPage } from '../sokomodal/sokomodal.page';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { Post } from '../models/post';
import { CallNumber } from '@ionic-native/call-number/ngx';
import { DatabaseService } from '../services/database.service';
import { Product } from '../models/product';
import { CPage } from '../c/c.page';


@Component({
  selector: 'app-shopprofile',
  templateUrl: './shopprofile.page.html',
  styleUrls: ['./shopprofile.page.scss'],
})
export class ShopprofilePage implements OnInit {
  data: Shops;
  // shop: Shops ;
  Posts = [];
  //variables
  liked = false;
  h = false;
  Addcomment = false;
  showSearch = false;
  //objects
  likes = { "count": 0 }
  searchTerm: string ;
  category: string  = 'All';
  categories = [] ;
  offers = [];
  UnfilteredOffers :Product []

  constructor(
    private service: FirestoreService,
    private navCtrl: Router,
    private fs: AngularFirestore,
    private route: ActivatedRoute,
    private modalCtrl: ModalController,
    private iab: InAppBrowser,
    private asC: ActionSheetController,
    private call: CallNumber,
    public db: DatabaseService,
    private modal: ModalController,
    private toastCtrl: ToastController
  ) {
    this.service.hiddenTabs = true;
    this.route.queryParams.subscribe(params => {
      if (params) {
        console.log(params);
        this.data = params;
      }
    });
  }
  ionViewWillEnter() {

    // this.getShop();
    this.getPosts();
    this.db.getproducts(this.data.shop).valueChanges().subscribe(res => {
      this.offers = res;
      this.UnfilteredOffers = res;
    })
    console.log('products' + this.UnfilteredOffers);
    
    this.db.getCategories(this.data.shop).valueChanges().subscribe(res => {
      this.categories = res.categories ;
      console.log(this.categories);
    });
    this.category = 'All' ;
  }
  ngOnInit() {

  }

  back() {
    this.service.changeData('Shopname');
    this.service.hiddenTabs = false;
    this.navCtrl.navigate(['tabs/tab1']);
  }
  //open a link in a browser inside the app

  inbrowser(link) {
    console.log("Opens link in the app");
    const target = '_blank';
    // const options = { location : 'no' } ;
    this.iab.create(link, target);
  }
  //go to maps to see location of the shop

  async maps() {
    const map = await this.modalCtrl.create({
      component: SokomodalPage,
      componentProps: { 'shoplocation': this.data.Location, 'shop': this.data.shop }
    });
    console.log('location', this.data.Location);
    await map.present();
  }

  scanAndPay() {
    this.service.shareShopBy('scan');
    this.navCtrl.navigate(['tabs/shop']);
  }
  pickPayCollect() {
    this.service.hiddenTabs = true;
    this.service.shareShopBy('pick');
    this.navCtrl.navigate(['tabs/offers']);
  }
  // goto shoppinglist page
  Delivery() {
    this.service.hiddenTabs = true;
    this.service.shareShopBy('delivery');
    this.navCtrl.navigate(['tabs/offers']);
  }

  show() {

  }
  infoModal(shop, logo) {

  }
  showImage() {

  }
  comments() {

  }
  //share via whatsapp
  async share() {
    const asc = await this.asC.create({
      animated: true,
      backdropDismiss: true,
      cssClass: './home.page.scss',
      buttons: [{
        icon: 'logo-whatsapp',
        text: 'Whatsapp',
        handler: () => {
        }
      },
      {
        text: 'Cancel',
        role: 'cancel'
      }
      ]
    });
    await asc.present();
  }
  //add a comment
  AddComment() {
    if (this.Addcomment == true) {
      this.Addcomment = false;
    } else {
      this.Addcomment = true;
    }
  }
  // like posts
  like() {
    if (this.liked == false) {
      this.likes.count++;
      this.liked = true;
    } else {
      this.likes.count--;
      this.liked = false;
    }
    if (this.h == false) {
      this.h = true;
    } else {
      this.h = false;
    }

  }
  getPosts() {
    let posts = this.fs.collection<Post>('posts', ref => {
      return ref.where('shop', '==', this.data.shop).orderBy('time', 'desc')
    })
    let fd = posts.snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const id = a.payload.doc.id;
          const data = a.payload.doc.data();
          return { id, ...data }
        });
      })
    );
    fd.subscribe(res => {
      this.Posts = res;
      console.log(this.Posts);
    })
  }
  callShop(number) {
    this.call.callNumber(number, true)
      .then(res => console.log('Launched dialer!', res))
      .catch(err => console.log('Error launching dialer', err));
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
  shortenProduct(prod){
    let text;
    if(prod.length > 25){
      text = prod.substring(0,25) ;
      text += '...' ;
      return text;
    }else {
      return prod;
    }
    
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
   //view a product details in a  modal
   async viewProduct(item) {
    const mod = await this.modal.create({
      component: CPage,
      componentProps: item
    });

    mod.onDidDismiss()
      .then((data) => {
        console.log("response from modal",data);
        if(data.data === "addToCart"){
          this.addToCart(item);
        }
    });

    await mod.present()
  }
  addToCart(item) {
    // check if cart contains product from another shop
    if(this.data.shop === item.shop){
      this.db.addCart(item);
      this.toast('Product added To cart');
      return;
    }else{
      this.toast('Product from diff shop');
    }
  }
  sendCart() {
    this.service.hiddenTabs = true;
    this.navCtrl.navigate(['tabs/cart'])
  }
   //toast message

   async toast(data) {
    const toast = await this.toastCtrl.create({
      message: data,
      duration: 1000
    });
    await toast.present();
  }
}
