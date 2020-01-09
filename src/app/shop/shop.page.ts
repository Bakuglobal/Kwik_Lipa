import { Component, OnInit } from '@angular/core';
import { Shops } from '../models/shops';
import { FirestoreService } from '../services/firestore.service';
import {
  AlertController,ToastController,LoadingController, MenuController, ModalController,} from '@ionic/angular';
import { User } from '../models/user';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
// import { AdMobFree, AdMobFreeBannerConfig, AdMobFreeInterstitialConfig } from '@ionic-native/admob-free/ngx';
import { Router , NavigationExtras , ActivatedRoute} from '@angular/router';
import { Contacts, ContactFieldType, ContactFindOptions } from '@ionic-native/contacts';
import { HttpClient, HttpHeaders } from '@angular/common/http';
// import { RequestOptions } from '@angular/http';
import { OnDestroy } from "@angular/core";
import { DatabaseService } from '../services/database.service';
import { Observable} from 'rxjs/observable' ;
// import { settings } from 'cluster';
import { map } from 'rxjs/operators';
import { AngularFireAuth } from '@angular/fire/auth';
import { PaymentPage } from '../payment/payment.page';
import { ScannedModalPage } from '../scanned-modal/scanned-modal.page';
import { Location } from '@angular/common';


@Component({
  selector: 'app-shop',
  templateUrl: './shop.page.html',
  styleUrls: ['./shop.page.scss'],
})
export class ShopPage implements OnInit, OnDestroy {

 // navigationExtras: {} ;
  shops: Shops[];
  scannedProdcts = [];
  userShopId: any;
  loading: any ;
  shopSelected: any ;
  selectedProducts: any ;
  cart = [] ;
  encodeData: any ;
  items = [] ;
  prd: {} ;
 
    wallet: number = 0;
  
    submission: boolean = false;
  
  
    payment_channels: any[];
  
    activate: boolean = false;

user: User = new User();

text: string = "Select payment method";

myContacts ;
phone ;
name ;
myNumber ;
codes = [] ;
userprofile = {
  phone: null,
  name: null,
  email: null,
  country: null,
  gender: null
};

Qty = [0] ;
myCart = [];
total= 0 ;
shop;


product ;
scanned ;
userPay ;
userSub ;
userDetails ;
time ;
data: any ;

  constructor(
    public fireApi: FirestoreService,
    public loadingController: LoadingController,
    public toastController: ToastController,
    public alertCtrl: AlertController,
    private barcodeScanner: BarcodeScanner,
    // private admobFree: AdMobFree,
    public navCtrl: Router,
    public route: ActivatedRoute,
    public contacts: Contacts,
    public httpClient: HttpClient,
    public db: DatabaseService,
    private fauth: AngularFireAuth,
    private menuCtrl: MenuController,
    private location: Location,
    public modalCtrl: ModalController,
  ) {
   this.fireApi.hiddenTabs = true ;
   this.menuCtrl.enable(false);
   
   
  }
  ngOnInit() {

    this.showShop();
    // this.removeBannerAd();
    this.getData();
    this.scannedProdcts = [] ;
    this.getUser();
    this.time = Observable.interval(3000);
    // timer to change div ID for offers button
    this.toggleBackgroundColor();
  }
  ngOnDestroy() {
    this.menuCtrl.enable(true);
    this.clearLocalArrays();
   
  }
   toggleBackgroundColor(){
    this.time.subscribe(val => {
      if (document.getElementById("offer1")) {
        document.getElementById("offer1").setAttribute("id", "offer2");
    }
    else {
        document.getElementById("offer2").setAttribute("id", "offer1");
    }
    });
  }
 

  //go to shopping list
  gotoList(){
     this.fireApi.hiddenTabs = false ;
     this.menuCtrl.enable(true);
    this.navCtrl.navigate(['tabs/mycontacts']);
  }
  async getUser() {
    let user = await this.fireApi.getCurrentUser();
    this.userSub = this.fireApi
      .getUserDetails(user.uid)
      .snapshotChanges() 
      .pipe(map(changes => {
        return changes.map(c => ({ key: c.payload.key, ...c.payload.val() }));
      }))
      .subscribe(usr => {
        console.log(usr);
      this.showData(usr);
      });
  }

  showData(user) {
    this.userprofile.phone = user[0].phone;
    this.userprofile.name = user[0].name;
    this.userprofile.email = user[0].email;
    this.userprofile.gender = user[0].gender;
    this.userprofile.country = user[0].country;
  }

  // select contact to pay from
  async selectContact(){
    const confirm =  await this.alertCtrl.create({
      header:'PLease Confirm !!',
      message:'Do you want'+' '+ this.name + ' '+ this.phone + ' '+'to pay for this shopping?',
      buttons: [
        {
          text:'No',
          role:'cancel'
        },
        {
          text:'Yes',
          handler: () => {
            let amount = this.getTotalCart();
            let phone = this.phone;
            this.fireApi.sharePhoneNumber(phone);
            // this.ref.payOut();
           this.navCtrl.navigate(['tabs/payment']);
          }
        }
      ]
    });
    await confirm.present();
  }                                                                                                                                               

  
  //get cart count of the scanned prod
 getCount(scanned){ var count = 0;
for(var i = 0; i < this.myCart.length; ++i){
    if(this.myCart[i] == scanned){
      count++;
    }
       return count ;
}

}
//reduce  quantity
reduceQuantity(scanned){
  if(scanned.count > 1){
    this.cart.pop();
    this.myCart[scanned.count--] ;
    this.total = 0 ;
    this.total = this.myCart.reduce((a,b) => a + (b.count * b.price), 0) ;
    this.fireApi.shareCartTotal(this.getTotalCart());
  }
}

//add quantity
addQty(scanned){
  if(this.cart.length == 5){
    this.cartLimit();
  }else{
    this.cart.push(1);
    this.myCart[scanned.count++] ;
    this.total = 0 ;
    this.total = this.myCart.reduce((a,b) => a + (b.count * b.price), 0) ;
    this.fireApi.shareCartTotal(this.getTotalCart());
  }
}

getData() {

  this.userDetails = this.fireApi.getCurrentUser().then(resp => {
    this.fireApi
      .getUserDetails(resp.uid)
      .valueChanges()
      .subscribe(result => {
        this.user = result[0];
      });
  });
}
  showShop(){
    
    this.shop = this.fireApi.serviceData
      .subscribe(shopname => (this.shopSelected = shopname));
    console.log("sent shopname from home page : ", this.shopSelected);
  }

  // removeBannerAd(){
  //   this.admobFree.banner.remove();
  // }

  async back(){
    if(this.myCart.length > 0){
      const back = await this.alertCtrl.create({
        header:'Sorry',
        message:'Cart will be emptied!',
        buttons: [
          {
            text:'cancel',
            role:'cancel'
          },
          {
            text:'okay',
            handler: () => {
              this.clearLocalArrays();
              this.scannedProdcts = [] ;
              this.fireApi.shareCartDetails(this.myCart);
              this.menuCtrl.enable(true);
              this.fireApi.hiddenTabs = false ;
              this.location.back();
            }
          }
        ]
      });
      await back.present();
    }else {
      this.menuCtrl.enable(true);
      this.fireApi.hiddenTabs = false ;
      this.location.back();
    }
    
  }

  getTotalCart() {
    
  return this.total = this.myCart.reduce((a,b) => a + (b.count * b.unit_price),0) ;
  }
  removeFromCart(item) {
    if(this.myCart.length == 1){
      this.emptyCart();
      
    }
   var productCount = item.count ;
   const index = this.myCart.indexOf(item);
   this.myCart.splice(index,1)
   this.cart.length = this.cart.length - productCount;
   this.presentToast('Product removed successfully');
  }
  submitProduct() {
    this.checkNumber();
  }
//empty cart popup

async emptyCart(){
  const pop = await this.alertCtrl.create({
    header:'Your Cart is now Empty',
    message: 'Do you want to continue shopping here?',
    buttons: [
      {
        text: 'No',
        handler: () => {
          this.clearLocalArrays();
          this.fireApi.hiddenTabs = false ;
          this.navCtrl.navigate(['tabs/tab1'])
        }
      },
      {
        text: 'Yes',
        handler: () => {
          this.clearLocalArrays();
          this.navCtrl.navigate(['tabs/shop'])
        }
      }
    ]
  });

  await pop.present();
}


  // Confirm mpesa pay
async checkNumber(){
 if( this.userprofile.phone == null ) {
  const num = await this.alertCtrl.create({
    header: 'Kwik can not find your number ',
    message: 'Please update your details in order to checkout',
    buttons: [
      {
        text: 'Update',
        handler: () => {
          this.navCtrl.navigate(['tabs/settings']);
        }
      },
      {
        text: 'close',
        role: 'cancel' 
      }
    ]
  });
  await num.present();
 }else {
   this.presentAlertConfirm();
 }
}
  
  async presentAlertConfirm() {
    const alert = await this.alertCtrl.create({
      header: 'Please Confirm!',
      message:
        'Pay <strong>KES ' +
        this.getTotalCart() +
        '.00</strong>!!!'+'<br>'+' via' + ''+'<strong>'+' '+this.userprofile.phone +'</strong>' +''+ ' M-pesa',
      buttons:[
        {
          text: 'Yes',
          cssClass: 'secondary',
          handler: () => {
           this.userPay = this.fireApi.getCurrentUser().then(results => {
              this.fireApi
                .getUserDetails(results.uid)
                .snapshotChanges()
                .map(changes => {
                  return changes.map(c => ({
                    key: c.payload.key, ...c.payload.val }));
                })
                .subscribe(user => {
                  console.log(user);
                  let amount = this.getTotalCart();
                  let phone = this.userprofile.phone ;
                  let phoneNumber = "254"+phone.slice(-9);

                  this.fireApi.sharePhoneNumber(phoneNumber);
                  
                  // this.ref.payOut();
                  this.navCtrl.navigate(['tabs/payment']);
           
                 
                  
                });
            });
          }
        },
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary'
          
        },
        {
          text: 'Get a loan',
          cssClass: 'secondary',
          handler: () => {
            let phone = this.userprofile.phone ;
                  let phoneNumber = "254"+phone.slice(-9);
                  this.fireApi.sharePhoneNumber(phoneNumber);
            this.navCtrl.navigate(['tabs/mycredits']);
          }
        },
        {
          text: 'Pay using another number',
          cssClass: 'secondary',
          handler: () => {
            this.otherNumber();
          }
        }
      ]
    });

    await alert.present();
  }
  
  //other number pop up
  async otherNumber(){
    const pop = await this.alertCtrl.create({
      header:'Select from your contact list',
      message: 'Click Continue to pay from another number?',
      buttons: [
        {
          text: 'cancel',
          handler: () => {
            this.presentAlertConfirm();
          }
        },
        {
          text: 'Continue',
          handler: () => {
          this.contacts.pickContact().then( det => {
              let savedNumber = det.phoneNumbers[0].value.toString() ;
              let check = savedNumber.charAt(0);
              if(check == "+"){
                let nospace = savedNumber.replace(/\s+/g,'');
                this.phone = nospace.substring(1,12) ;
              }else{
                let clean = savedNumber.replace(/\s+/g,'');
                let cut = '254'+clean.substring(1,10);
                this.phone = cut ;
              }
              //this.phone = "254"+savedNumber.toString().slice(-9);
              this.name = det.name.givenName;
              this.selectContact();
            });
          
            
          }
        }
      ]
    });
  
    await pop.present();
  }

 


get generateInvoice() {
  var text = "";
  var possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < 10; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
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
  generateTransactionBarcode(transactionID) {
    this.barcodeScanner
      .encode(this.barcodeScanner.Encode.TEXT_TYPE, transactionID)
      .then(
        encodedData => {
          console.log(encodedData);
          this.encodeData = encodedData;
        },
        err => {
          console.log("Error occured : " + err);
        }
      );
  }




 // Loader
 async presentLoading() {
  this.loading = await this.loadingController.create({
    message: ' Please Wait ...'
  });
  return await this.loading.present();
}

// Toaster
async presentToast(data) {
  const toast = await this.toastController.create({
    message: data,
    duration: 1000
  });
  toast.present();
}

scan(){
  if(this.cart.length == 5){
    this.cartLimit();
  }else {
  this.selectedProducts = {} ;
    this.barcodeScanner.scan().then((barcodeData) => {
      this.selectedProducts =  Number(barcodeData.text) ;
      this.presentLoadingWithOptions();
      if(this.items.length == 0){
        
        this.db.getshopsproduct(this.selectedProducts,this.shopSelected).subscribe(data => {
              this.data = data ;
          if(this.data.text == "Not found"){
            this.loading.dismiss();
            this.productNotFound();
          }
          else{
            this.items.push(this.selectedProducts) ;
            this.showProduct(data);
            this.fireApi.shareCartDetails(this.myCart);
            this.fireApi.shareCartTotal(this.getTotalCart());
            this.loading.dismiss();
          }
         
        });
       
        
      }else{
       this.checkCartItems() ;
      }
      
  });
}
}
checkCartItems(){
  if(this.items.includes(this.selectedProducts)){
    
    console.log('qty added');
    //this.fireApi.addProduct(this.selectedProducts);
    this.myCart.forEach(item => {
      if(item.item_number == this.selectedProducts){
        item.count++;
        this.cart.length ++ ;
      }
      this.fireApi.shareCartDetails(this.myCart);
      return ;
    });
    
    this.loading.dismiss();
   
  }else {
    this.db.getshopsproduct(this.selectedProducts,this.shopSelected).subscribe(data => {
      this.data = data ;
      if(this.data.text == "Not found"){
        this.loading.dismiss()
        this.productNotFound();
      }
      else{
        this.addCart(data);
        this.items.push(this.selectedProducts) ;
        this.fireApi.shareCartDetails(this.myCart);
        this.fireApi.shareCartTotal(this.getTotalCart());
        this.loading.dismiss();
      }
     
    });
  }
}
//scanner browser test barcode-direct-inject
getProduct(code){
  //this.prd = 8901057300087 ;
  
  this.selectedProducts = code ;
  if(this.cart.length == 10){
    this.cartLimit();
  }else{
    if(this.items.length == 0){
      this.presentLoadingWithOptions();
      this.db.getshopsproduct(this.selectedProducts,this.shopSelected).subscribe(data => {
        this.data= data ;
        if(this.data.text == "Not found"){
          this.loading.dismiss()
          this.productNotFound();

        }else{
          this.items.push(this.selectedProducts) ;
          this.showProduct(data);
          this.fireApi.shareCartDetails(this.myCart);
          this.fireApi.shareCartTotal(this.getTotalCart());
          this.loading.dismiss()
        }
      });
  }else{
    this.checkCartItems();
  }
  }
}
//---

addCart(data){
  data.forEach(element => {
    if(element !== null) {
    this.scannedProdcts.push(element);
    this.cart.push(element);
    this.fireApi.addProduct(element);
    console.log(this.scannedProdcts);
    
    let selected = {} ;
    for (let obj of element){
        selected[obj.key] = {...obj, count:1};
    }

    let nxt = Object.keys(selected).map(key => selected[key]);
    //this.myCart.push(nxt) ;
    console.log('element-' + JSON.stringify(nxt[0]));
    this.myCart.push(element)
    this.total = this.myCart.reduce((a,b) => a + (b.count * b.price), 0) ;
    console.log('my cart'+this.myCart);
  }else {
    this.loading.dismiss();
    this.presentToast('Product is not Online');


  }
  });
}


showProduct(data) {
  data.forEach(element => {
    if(element !== null) {
    this.scannedProdcts.push(element);
    this.cart.push(element);
    this.fireApi.addProduct(element);
    console.log(this.scannedProdcts);
    
    let selected = {} ;
    for (let obj of this.scannedProdcts){
      if(selected[obj.key]){
        console.log(selected[obj.key])
        selected[obj.key].count++;
      }else {
        selected[obj.key] = {...obj, count:1};
      }
    }
    console.log(selected) ;
    this.myCart = Object.keys(selected).map(key => selected[key]);
    this.total = this.myCart.reduce((a,b) => a + (b.count * b.price), 0) ;
    console.log('my cart'+this.myCart);
    this.loading.dismiss();
  
  }else {
    this.presentToast('Product is not Online');

  }
  });
}
async previewProduct(cart){
  console.log('cart--'+ cart)
    const modal = await this.modalCtrl.create({
      component: ScannedModalPage,
      componentProps : {
        img: cart.pic_filename,
        desc: cart.description,
        name: cart.name,
        price: cart.unit_price
      }
    })
    await modal.present();
}
clearLocalArrays(){
  this.scannedProdcts.length = 0;
  this.scannedProdcts = [] ;
  this.cart.length = 0;
  this.cart = [] ;
  this.items.length = 0;
  this.myCart.length = 0;
  this.total = 0 ;
}
async productNotFound(){
  let alert = await this.alertCtrl.create({
    header: "We are Sorry !",
    
    message: "The product you scanned can not be found. Please confirm that you are in right shop or ask for assistance from the shop " ,
    
    buttons: [
      {
        text: 'Close',
        role: 'cancel',
      
      }
    ]
  });
  alert.present();
}
async cartLimit(){
  let alert = await this.alertCtrl.create({
    header: "We are Sorry !",
    
    message: "You have reached the cart limit of Five items " ,
    
    buttons: [
      {
        text: 'Checkout',
        role: 'cancel',
      
      }
    ]
  });
  alert.present();
}
async presentLoadingWithOptions() {
  this.loading = await this.loadingController.create({
    spinner: null,
    message: 'Fetching product...',
    translucent: true,
    cssClass: 'custom-class custom-loading'
  });
  return await this.loading.present();
}

}