import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DatabaseService } from 'src/app/services/database.service';
import { ToastController } from '@ionic/angular';
import { FirestoreService } from 'src/app/services/firestore.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-details-modal',
  templateUrl: './details-modal.page.html',
  styleUrls: ['./details-modal.page.scss'],
})
export class DetailsModalPage implements OnInit {
data: any;
notes: string;
count = 1 ;
showCartIcon = false ;
quantity= 0 ;
  constructor(
    private navCtrl: Router,
    private toastCtrl: ToastController,
    public db: DatabaseService,
    private service: FirestoreService,
    private route: ActivatedRoute,
    private location: Location
  ) 
  { 
    this.route.queryParams.subscribe(params => {
      if (params) {
        console.log(params);
        this.data = params;
      }
    });
  }

  ngOnInit() {

  }

  addToCart() {
    let item = {
      product: this.data.Meal,
      currentprice: this.data.currentprice,
      count: this.count,
      quantity: "One",
      shop: this.data.Restaurant,
    }
    this.quantity =  this.quantity + this.count;
    this.showCartIcon  = true ;
    this.service.changeData(this.data.Restaurant);
    // this.service.changeLocation(shop.Location);
    this.db.addCart(item);
    this.toast('Product added To cart');
  }
   //toast message

   async toast(data) {
    const toast = await this.toastCtrl.create({
      message: data,
      duration: 1000
    });
    await toast.present();
  }
  back(){
    this.location.back();
  }
  add(){
    console.log("addding");
    this.count++ ;
  }
  reduce(){
    if(this.count !== 1){
      console.log("reducing");
      this.count-- ;
    }
  }
  getCount(){
    return this.count;
  }
  goToCart(){
    this.navCtrl.navigate(['tabs/cart']);
  }

}
