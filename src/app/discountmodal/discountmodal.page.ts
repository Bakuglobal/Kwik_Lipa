import { Component, OnInit, Input } from '@angular/core';
import { ModalController, AlertController, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { DatabaseService } from '../services/database.service';
import { FirestoreService } from '../services/firestore.service';
import { data } from 'jquery';


@Component({
  selector: 'app-discountmodal',
  templateUrl: './discountmodal.page.html',
  styleUrls: ['./discountmodal.page.scss'],
  
})
export class DiscountmodalPage implements OnInit {
  count = 1;
  added = false;
  shopSelected: string;

  @Input('id') id;
  @Input('barcode') barcode;
  @Input('category') category;
  @Input('description') description;
  @Input('image') image;
  @Input('product') product;
  @Input('quantity') quantity;
  @Input('shop') shop;
  @Input('status') status;
  @Input('stock') stock;
  @Input('currentprice') currentprice;
  @Input('Location') Location;

  constructor(
    private mod: ModalController,
    private navCtrl: Router,
    public service: DatabaseService,
    private fireApi: FirestoreService,
    private alert: AlertController,
    private toast: ToastController,
  ) { }

  ngOnInit() {
    this.showShop();
  }
  close() {
    this.mod.dismiss();
  }
  addToCart() {
    console.log(this.shop,this.shopSelected);
    if(this.shopSelected === 'Shopname'){
      this.fireApi.changeData(this.shop);
      this.service.addCart(this.prepareCart());
      console.log(this.prepareCart());
      this.toasted("Product added to cart");
      return;
    }
    if (this.shopSelected !== this.shop) {
       // ask to clear
       this.showAlert();
       return;
    }
    if(this.shopSelected === this.shop){
      this.service.addCart(this.prepareCart());
      console.log(this.prepareCart());
      this.toasted("Product added to cart");
      return;
    }
  }
  add() {

    this.count++;
  }
  reduce() {
    if (this.count == 1) {
      // nothing
    } else {
      this.count--;
    }
  }
  prepareCart() {
    return {
      'id': this.id,
      'barcode': this.barcode,
      'category': this.category,
      'description': this.description,
      'image': this.image,
      'product': this.product,
      'count': this.count,
      'currentprice': this.currentprice,
      'stock': this.stock,
      'status': this.status,
      'shop': this.shop,
      'quantity': this.quantity
    }
  }
  
  buyNow() {
    // cart is empty
    if(this.shopSelected === "Shopname"){
      this.fireApi.changeData(this.shop);
      this.fireApi.changeLocation(this.Location);
      this.service.addCart(this.prepareCart());
      this.mod.dismiss();
      this.toasted("Product added to cart");
      this.navCtrl.navigate(['tabs/cart']);
      return;
    }
    // cart is not empty but from same shop
    if(this.shopSelected === this.shop){
      this.fireApi.changeData(this.shop);
      this.fireApi.changeLocation(this.Location);
      this.service.addCart(this.prepareCart());
      this.mod.dismiss();
      this.toasted("Product added to cart");
      this.navCtrl.navigate(['tabs/cart']);
      return;
    }
    // cart is not empty but from a different shop
    if(this.shopSelected !== this.shop){
      // ask to clear
      this.showAlert();
    }
    console.log(this.shop,this.shopSelected);
    // if (this.shopSelected !== this.shop) {
    //   // ask to clear
    //   this.showAlert();
    // }
    // else {
    //   if (this.shopSelected === 'Shopname') {
    //     // add to cart since they from same shops/restaurant
    //     this.fireApi.changeData(this.shop);
    //     this.service.addCart(this.prepareCart());
    //     this.mod.dismiss();
    //     this.navCtrl.navigate(['tabs/cart']);
    //   }
    // }
  }
  goToCart() {
    // this.fireApi.changeData(this.shop);
    this.mod.dismiss();
    this.navCtrl.navigate(['tabs/cart']);
  }
  showShop() {
    this.fireApi.serviceData
      .subscribe(data => (this.shopSelected = data));
    console.log("sent data from home page : ", this.shopSelected);
  }
  
  async showAlert() {
    const pop = await this.alert.create({
      message: "You have an item from a different shop in your cart do you want to clear the cart and add this item?",
      buttons: [
        {
          text: 'Discard',
          role: 'cancel'
        },
        {
          text: 'Yes',
          handler: () => {
            this.service.resetCart();
            this.fireApi.changeData(this.shop);
            this.fireApi.changeLocation(this.Location);
            this.service.addCart(this.prepareCart());
            this.toasted("Product added to cart");
          }
        }
      ]
    });
    await pop.present();
  }
 async toasted(msg){
   const tst = await this.toast.create({
     message: msg,
     duration: 700
   });
   await tst.present();
  }
}

