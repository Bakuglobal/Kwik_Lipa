import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
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
      pickTime;
      btn = "Proceed";
      showTimeSelect = false;

  //objects
      OpenTime= [
        '8AM','8:30AM','9AM','9:30PM','10AM','10:30PM','11AM','11:30PM','12PM','12:30PM','1PM','1:30PM','2PM','2:30PM','3PM','3:30PM','4PM','4:30PM','5PM','5:30PM','6PM','6:30PM'
      ]

  
  constructor(
    private navCtrl: Router,
    private toast: ToastController,
    private service: DatabaseService,
    private fireApi: FirestoreService,
    private count: OffersPage,
    private fs: AngularFirestore
  ) { }

  ngOnInit() {
     this.cart = this.service.getData() ;
     this.showShop() ;
     this.fireApi.hiddenTabs = true ;
  }
//Send the order to the shop
      sendOrder(){
        if(this.btn == "Place Order"){
              let Today = new Date() ;
            
              let data = {
                "Date": Today,
                "products": this.cart,
                "shop":this.shopSelected,
                "status": "open",
                "pickuptime": this.pickTime,
                "userID": localStorage.getItem('userID'),
              }
            this.fs.collection('Orders').add(data)
              this.Ordersuccess = true ;
              this.showTimeSelect = false ;
              this.count.count = 0 ;
              this.cart.length = 0 ;
          }
        if(this.btn == "Proceed"){
            this.btn = "Place Order";
            this.showTimeSelect = true ;
        }
        
      }
  //back to the previous page

        back(){
          if(this.cart.length == 0){
            this.Ordersuccess = false ;
            this.count.changeCount(0);
            this.fireApi.hiddenTabs = false ;
            this.navCtrl.navigate(['tabs/offers'])
          }else {
            let count = this.cart.reduce((a,b) => a + (b.count * 1),0)
            this.count.changeCount(count) ;
            this.navCtrl.navigate(['tabs/offers'])
          }
        
        }
  //remove item from cart
        remove(index){
          if(this.cart.length > 1){
          this.cart.splice(index,1);
          //  this.service.count -- ;
          }else{
            this.cart.splice(index,1);
          }
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
      add(index){
        
        this.cart[index].count ++ ;
      }
  //reduce quantity for an item in cart
      
      reduce(index){
        if(this.cart[index].count > 1){
          this.cart[index].count -- ;

        }
      }
      
}
