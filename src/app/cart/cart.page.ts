import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController, AlertController } from '@ionic/angular';
import { DatabaseService } from '../services/database.service';
import { FirestoreService } from '../services/firestore.service';
import { OffersPage} from '../offers/offers.page';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.page.html',
  styleUrls: ['./cart.page.scss'],
})
export class CartPage implements OnInit {
  //variables

      cart = [] ;
      shopSelected ;
      total ;
      Ordersuccess = false ;
      pickHour: string;
      pickMinute: string;
      pickDay: string;
      showTimeSelect = false;
      count : number;
      disableBtn = false ;
      notes = '' ;
      Today ;
      delivery : string;

  //objects and arrays
      hour =[ '08','09','10','11','12','13','14','15','16','17','18']
      minute = [ '00','15','30','45']
      Days = ['Today','Sun','Mon','Tue','Wed','Thu','Fri','sat'];

  
  constructor(
    private navCtrl: Router,
        private toast: ToastController,
        private service: DatabaseService,
        private fireApi: FirestoreService,
        private fs: AngularFirestore,
        private alert: AlertController
  ) 
  { 
        
  }

  ngOnInit() {
     this.cart = this.service.getData() ;
     console.log(this.cart)
     this.showShop() ;
     this.fireApi.hiddenTabs = true ;
     
  }
//goto orders
myorders(){
  this.fireApi.hiddenTabs = false ;
  this.navCtrl.navigate(['tabs/transactions'])
}
//Send the order to the shop
      sendOrder(){
        
        if(this.pickHour != undefined && this.pickDay != undefined && this.pickMinute != undefined && this.delivery != undefined){
              let Today = new Date() ;
              let id = this.genearteOrderID().substring(0,8).toUpperCase();
              console.log(id)
              let data = {
                "Date": Today,
                "products": this.cart,
                "shop":this.shopSelected,
                "status": "open",
                "pickHour": this.pickHour,
                "pickMins":this.pickMinute,
                "pickDay":this.pickDay,
                "username": localStorage.getItem('email'),
                "notes": this.notes,
                "OrderID":id,
                "Delivery": this.delivery,
                "userID": localStorage.getItem('userID'),
              }
            this.fs.collection('Orders').doc(id).set(data)
              this.Ordersuccess = true ;
              this.showTimeSelect = false ;
              this.cart.length = 0 ;
          }
        else{
          this.alertPop();
        }
        
      }
  // generate orderID
  genearteOrderID(){
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
      });
  }
  //back to the previous page

        back(){
          if(this.cart.length == 0){
            this.Ordersuccess = false ;
            this.fireApi.hiddenTabs = false ;
            this.navCtrl.navigate(['tabs/offers'])
          }else {
            let count = this.cart.reduce((a,b) => a + (b.count * 1),0)
            this.navCtrl.navigate(['tabs/offers'])
          }
        
        }
  //remove item from cart
        remove(index){
          this.cart.splice(index,1);
          let ct = this.items() ;
          this.fireApi.setCount(ct);
          if(this.cart.length = 0){
            
          }
        }
  //get total of items in cart
        items(){
          return this.count = this.cart.reduce((a,b) => a + (b.count ),0);
        }
  //get the shop name

      showShop(){
        this.fireApi.serviceData
          .subscribe(data => (this.shopSelected = data));
        console.log("sent data from home page : ", this.shopSelected);
      }
  //get the cart total
      
      getTotalCart() {
        return this.total = this.cart.reduce((a,b) => a + (b.count * b.currentprice),0) ;
        }
  //add quantity for an item in cart
      add(index){
        this.cart[index].count ++ ;
        let ct = this.items() ;
        this.fireApi.setCount(ct);
      }
  //reduce quantity for an item in cart
      
      reduce(index){
        if(this.cart[index].count > 1){
          this.cart[index].count -- ;
          let ct = this.items() ;
          this.fireApi.setCount(ct);
        }
      }
  //alert
  async alertPop(){
    const alert = await this.alert.create({
      message: "Please set pick up time and delivery option",
      buttons: [
        {
          text:'close',
          role: 'cancel'
        }
      ]

    })
    alert.present();
  }
      
}
