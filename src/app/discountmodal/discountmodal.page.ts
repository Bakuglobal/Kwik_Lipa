import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Router } from '@angular/router';
import { DatabaseService } from '../services/database.service';
import { FirestoreService } from '../services/firestore.service';

@Component({
  selector: 'app-discountmodal',
  templateUrl: './discountmodal.page.html',
  styleUrls: ['./discountmodal.page.scss'],
})
export class DiscountmodalPage implements OnInit {
  count = 1;
  // cart = 0;
  added = false;
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
  @Input('cart') cart ;



  constructor(
    private mod: ModalController,
    private navCtrl: Router,
    private service: DatabaseService,
    private fireApi: FirestoreService
  ) { }

  ngOnInit() {
  }


  close() {
    if(this.cart > 0){
      this.service.setData(this.prepareCart());
      this.fireApi.setCount(this.cart);
    }
    this.mod.dismiss();
  }

  addToCart() {
    this.added = true;
    if (this.cart !== 0) {
      // this.count++;
      this.cart += this.count;
    }
    if(this.cart == 0){
      this.cart = this.count;
    }
    this.fireApi.setCount(this.cart);
    this.service.setData(this.prepareCart());
    console.log(this.prepareCart());
  }
  add() {
    this.count++;
    if (this.added == true) {
        this.cart++ ;
    }
  }
  reduce() {
    if (this.count !== 1) {
      this.count--;
      if (this.added == true) {
          // this.cart += this.count;
          this.cart-- ;
      }
    }
  }
  prepareCart(){
    return {
      id: this.id,
      barcode: this.barcode,
      category: this.category,
      description: this.description,
      image: this.image,
      product: this.product,
      count: this.count,
      currentprice: this.currentprice,
      stock: this.stock,
      status: this.status,
      shop: this.shop,
      quantity: this.quantity
    }
  }
  buyNow(){
    this.fireApi.changeData(this.shop);
    this.service.setData(this.prepareCart());
    this.fireApi.setCount(this.cart);
    this.navCtrl.navigate(['tabs/cart']);
    this.mod.dismiss();
  }
 goToCart(){
  this.fireApi.changeData(this.shop);
  // this.service.setData(this.prepareCart());
  this.fireApi.setCount(this.cart);
  this.navCtrl.navigate(['tabs/cart']);
  this.mod.dismiss();
 }
}

