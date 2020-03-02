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



  constructor(
    private mod: ModalController,
    private navCtrl: Router,
    public service: DatabaseService,
    private fireApi: FirestoreService
  ) { }

  ngOnInit() {
  }
  close() {
    this.mod.dismiss();
  }
  addToCart() {
    this.service.addCart(this.prepareCart());
    console.log(this.prepareCart());
  }
  add() {
    this.count++;
  }
  reduce() {
      this.count--;
  }
  prepareCart(){
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
  buyNow(){
    this.fireApi.changeData(this.shop);
    this.service.addCart(this.prepareCart());
    this.mod.dismiss();
    this.navCtrl.navigate(['tabs/cart']);
  }
 goToCart(){
  this.fireApi.changeData(this.shop);
  this.mod.dismiss();
  this.navCtrl.navigate(['tabs/cart']);
 }
}

