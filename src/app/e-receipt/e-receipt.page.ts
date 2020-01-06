import { Component, OnInit } from '@angular/core';
import { FirestoreService } from '../services/firestore.service';
import { Router } from '@angular/router';
// import { AdMobFree } from '@ionic-native/admob-free/ngx';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';

@Component({
  selector: 'app-e-receipt',
  templateUrl: './e-receipt.page.html',
  styleUrls: ['./e-receipt.page.scss'],
})
export class EReceiptPage implements OnInit {


  shopSelected: any ;
  cart: any;
  currentDate ;
  totalCart ;
  day ;
  daylist ;
  hour ;
  minute ;
  second ;
  prepand ;
  encodeData ;
  UserID;
  QRcodeData = null ;

    constructor(
    public fireApi: FirestoreService,
    public navCtrl: Router,
    // public admobFree: AdMobFree,
    private barcodeScanner: BarcodeScanner,
  ) { }

  ngOnInit() {
 this.showShop();
 this.getCartTotal();
 this.getcart();
 this.getDate();
//  this.removeBannerAd();
 this.getUserID();
 
  }
  home(){
    this.shopSelected.length = 0;
    this.totalCart.length = 0 ;
    this.cart.length = 0 ;
    this.navCtrl.navigate(['home']);
  }
  
  // removeBannerAd(){
  //   this.admobFree.banner.remove();
  // }


  getUserID(){
     this.fireApi.getCurrentUser().then( resp => {
      this.UserID = resp.uid ;
     });
  }

  //show the current date of purchase
  getDate(){

   this.currentDate = new Date().getTime();
  
}
  // back to shop page
backToShop(){
  this.cart = [];
  this.navCtrl.navigate(['shop']);
}
//get the shopname from service
  showShop(){
    this.fireApi.serviceData
      .subscribe(shopname => (this.shopSelected = shopname));
    console.log("sent shopname from home page : ", this.shopSelected);
  }
//get the cart from the service
  getcart(){
    this.fireApi.serviceCart
    .subscribe(details => (this.cart = details));
    console.log("cart details below");
    console.log(this.cart);
  }
//get the cart total 
getCartTotal(){
  this.fireApi.serviceTotal
  .subscribe(total => (this.totalCart = total));
  console.log("Total = " + this.totalCart);
}

get transactionID() {
  let text = '';
  const possible =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < 15; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }

  return text;
}


//-------
// generate a barcode for the transactionID
generateTransactionBarcode() {
      this.QRcodeData = this.UserID + this.transactionID ;

}

}
