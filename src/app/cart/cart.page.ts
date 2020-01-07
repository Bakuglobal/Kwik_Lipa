import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { DatabaseService } from '../services/database.service';
import { FirestoreService } from '../services/firestore.service';
import { OffersPage} from '../offers/offers.page';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.page.html',
  styleUrls: ['./cart.page.scss'],
})
export class CartPage implements OnInit {
  cart = [] ;
  shopSelected ;
  total ;
  Ordersuccess = false ;
  constructor(
    private navCtrl: Router,
    private toast: ToastController,
    private service: DatabaseService,
    private fireApi: FirestoreService,
    private count: OffersPage
  ) { }

  ngOnInit() {
     this.cart = this.service.getData() ;
     this.showShop() ;
  }

  sendOrder(){
    this.count.count = 0 ;
    this.cart.length = 0 ;
    this.Ordersuccess = true ;
  }
  back(){
    if(this.cart.length == 0){
      this.Ordersuccess = false ;
      this.count.changeCount(0);
      this.navCtrl.navigate(['tabs/offers'])
    }else {
      let count = this.cart.reduce((a,b) => a + (b.count * 1),0)
      this.count.changeCount(count) ;
      this.navCtrl.navigate(['tabs/offers'])
    }
   
  }
 remove(index){
   if(this.cart.length > 1){
   this.cart.splice(index,1);
  //  this.service.count -- ;
  }else{
    this.cart.splice(index,1);
  }
 }
  showShop(){
    this.fireApi.serviceData
      .subscribe(data => (this.shopSelected = data));
    console.log("sent data from home page : ", this.shopSelected);
  }
  getTotalCart() {
    return this.total = this.cart.reduce((a,b) => a + (b.count * b.currentprice),0) ;
    }
  add(index){
    
    this.cart[index].count ++ ;
  }
  reduce(index){
    if(this.cart[index].count > 1){
      this.cart[index].count -- ;

    }
  }
  
}
