import { Component, OnInit } from '@angular/core';
import { FirestoreService } from '../services/firestore.service';
import { Router } from '@angular/router';

import { HttpHeaders, HttpClient } from '@angular/common/http';
import { LoadingController, AlertController } from '@ionic/angular';
import { timer } from 'rxjs';


@Component({
  selector: 'app-payment',
  templateUrl: './payment.page.html',
  styleUrls: ['./payment.page.scss'],
})
export class PaymentPage implements OnInit {

  cart ;
  totalCart ;
  shopSelected ;
  progress = 60 ;
  phone ;
  loading: any ;
  processing = false ;
  token;
  constructor(
    public fireApi: FirestoreService,
    public navCrtl: Router,
    public httpClient: HttpClient,
    public loadingController: LoadingController,
    public alertController: AlertController
    
    
  ) {
    
   }

  ngOnInit() {
    this.getCartTotal();
    this.getcart();
    this.showShop();
    this.getPhoneNumber();
  }

  //send stk to user checkout number

  payOut(){
    this.showAutoHideLoader();
    this.sendStkRequest(this.totalCart,this.phone);
   
    this.processing = true ;
   
  }

//get token
getToken(){
  let headers = new HttpHeaders();
  headers.append('Content-Type','application/json');
  headers.append('Access-Control-Allow-Origin','*');
  headers.append('Access-Control-Allow-Headers','Origin,X-Requested-With, Content-Type,Accept')

 this.httpClient.get("https://kwik-lipa-mpesa-online.glitch.me/hooks/token",{headers : headers})
 .subscribe(data => {
   this.token = data ;
   console.log('token is :'+ this.token);
 });
}

sendStkRequest(amt,phone) {
  this.getToken();

  if(this.token == null){
    let headers = new HttpHeaders();
  headers.append('Content-Type','application/json');
  headers.append('Access-Control-Allow-Origin','*');
  headers.append('Access-Control-Allow-Headers','Origin,X-Requested-With, Content-Type,Accept')

 this.httpClient.get("https://kwik-lipa-mpesa-online.glitch.me/hooks/token",{headers : headers})
 .subscribe(data => {
   this.token = data ;
   console.log('token is :'+ this.token);
 });
  }

  let headers = new HttpHeaders();
  headers.append('Content-Type','application/json');
  headers.append('Access-Control-Allow-Origin','*');
  headers.append('Access-Control-Allow-Headers','Origin,X-Requested-With, Content-Type,Accept')
  
  let postData = {
          "phone": phone.toString(),  
          "amount": amt.toString(),
          "token": this.token
  }
   

  this.httpClient.post("https://kwik-lipa-mpesa-online.glitch.me/hooks/stk", postData, {headers : headers})
  .subscribe(data => {
    console.log(data);
    if(data == "Invalid Access Token"){
     this.getToken();
    }
    if(data == "Bad Request - Invalid PhoneNumber"){
      console.log("Invalid PhoneNumber");
      
    }

    

   }, error => {
    console.log(error);
  });

}
//get mpesa response
getMpesaResponse(){

  this.httpClient.get("https://kwik-lipa-mpesa-online.glitch.me/hooks/response", {responseType: 'text'})
    .subscribe(data => {
      if(data == "successful"){
        this.fireApi.getCurrentUser().then(results => {
          this.fireApi
            .getUserDetails(results.uid)
            .snapshotChanges()
            .map(changes => {
              return changes.map(c => ({
                key: c.payload.key, ...c.payload.val }));
            })
            .subscribe(user => {
              this.sendReceipt(user);
            })});
            this.clearLocalArrays();
        this.navCrtl.navigate(['e-receipt'])
      }else {

        //this.clearLocalArrays();
        this.errorCheckingOut();
        console.log(data);
      }
     }, error => {

      
      
      console.log(error);
    });

}
receipt(){
  this.fireApi.getCurrentUser().then(results => {
    this.fireApi
      .getUserDetails(results.uid)
      .snapshotChanges()
      .map(changes => {
        return changes.map(c => ({
          key: c.payload.key, ...c.payload.val }));
      })
      .subscribe(user => {
        this.sendReceipt(user);
        console.log(user);
        console.log('receipt send') ;
      })});
}
//send shopping receipt to db if checkout successful
sendReceipt(user){
  console.log(this.transactionID);
  console.log(this.cart);
    this.fireApi.submitProduct(
      this.cart,
      user[0].key,
      this.transactionID,
      this.shopSelected);
}
//generate transactionID
get transactionID() {
  let text = '';
  const possible =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < 15; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }

  return text;
}

  //back to shop 
  backToShop(){
    this.navCrtl.navigate(['shop']);
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
//get phone number for checkout
getPhoneNumber(){
  
  this.fireApi.servicePhone.subscribe( phone => (this.phone = phone));
  console.log("checkout with : " + this.phone);
  
 
}

showAutoHideLoader() {
  this.loadingController.create({
    message: 'Waiting for M-pesa reply...',
    duration: 20000
  }).then((res) => {
    res.present();

    res.onDidDismiss().then((dis) => {
      console.log('Loading dismissed! after 2 Seconds');
      this.getMpesaResponse();
    });
  });
}
clearLocalArrays(){
  this.cart.length = 0 ;
  this.totalCart.length = 0 ;
  this.shopSelected.length = 0 ;

}
async errorCheckingOut(){
  let popup = await this.alertController.create({
    header : ' Checkout Unsuccessful',
    message: 'Could be a conection problem ... ',
    buttons: [
      {
        text: 'Try Again',
        handler: () => {
          this.payOut();
        }
      
      }
    ]
  });
  popup.present();
}

}
