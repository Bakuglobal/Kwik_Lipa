import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController, AlertController, LoadingController } from '@ionic/angular';
import { DatabaseService } from '../services/database.service';
import { FirestoreService } from '../services/firestore.service';
import { OffersPage } from '../offers/offers.page';
import { AngularFirestore } from '@angular/fire/firestore';
import { MpesaService } from '../mpesa/mpesa.service';
import { Location } from '@angular/common';
import { userInfo } from 'os';
import { access } from 'fs';

export class mpesaRes {
  CheckoutRequestID?: any;
  CustomerMessage?: any;
  MerchantRequestID?: any;
  ResponseCode?: any;
  ResponseDescription?: any;
  errorMessage?:any;
}
@Component({
  selector: 'app-cart',
  templateUrl: './cart.page.html',
  styleUrls: ['./cart.page.scss'],
})
export class CartPage implements OnInit {
  //variables

  cart = [];
  shopSelected;
  total = 0;
  Ordersuccess = false;
  pickHour: string;
  pickMinute: string;
  pickDay: string;
  showTimeSelect = false;
  count: number;
  disableBtn = false;
  notes = '';
  delivery: string;
  areas;
  deliveryFee = 0;
  selectedarea;
  noPickUpTime = false;
  Number;
  paid = false;
  CurrentTime;
  loader: any;
  paymentMethod: string;

  //objects and arrays
  hour = []
  minute = ['00', '15', '30', '45']
  Days = ['Today', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'sat'];


  constructor(
    private navCtrl: Router,
    private toast: ToastController,
    private service: DatabaseService,
    private fireApi: FirestoreService,
    private fs: AngularFirestore,
    private alert: AlertController,
    private mpesa: MpesaService,
    private location: Location,
    private loadCtrl: LoadingController
  ) {
    this.fireApi.getAreas().subscribe(res => {
      this.areas = res;
      console.log(this.areas);
    });
    this.CurrentTime = new Date().getHours();
    console.log(this.CurrentTime);
    if (this.CurrentTime < 8) {
      for (var i = 8; i < 19; i++) {
        this.hour.push(i);
      }
    }
    if (this.CurrentTime > 8) {
      let start = this.CurrentTime + 1;
      for (var i: number = start; i < 19; i++) {
        this.hour.push(i);
      }
    }
    if (this.CurrentTime == 8) {
      for (var i = 9; i < 19; i++) {
        this.hour.push(i);
      }
    }
    this.fireApi.serviceshopBy.subscribe(data => {
      if (data == 'delivery') {
        this.delivery = 'Deliver it to me';
        this.noPickUpTime = true;
      }
    })

  }

  ngOnInit() {
    this.cart = this.service.getCart();
    console.log(this.cart);
  }
  ionViewWillEnter() {
    this.showShop();
    this.fireApi.hiddenTabs = true;
    this.Number = localStorage.getItem('Number');
    this.formatNumber();

  }

  formatNumber() {
    let num = this.Number;
    let check = num.charAt(0);
    if (check == "+") {
      let nospace = num.replace(/\s+/g, '');
      this.Number = nospace.substring(1, 12);
    } else {
      let clean = num.replace(/\s+/g, '');
      let cut = '254' + clean.substring(1, 10);
      this.Number = cut;
    }
  }
  changeDay() {
    if (this.pickDay == 'Today') {
      // pick time remains
    } else {
      // show all pick time period 
      for (var i = 9; i < 19; i++) {
        this.hour.push(i);
      }
    }
  }
  //goto orders
  myorders() {
    this.fireApi.hiddenTabs = false;
    this.Ordersuccess = false;
    this.navCtrl.navigate(['tabs/transactions'])
  }
  // calculate delivery fee
  getDeliveryFee(area) {
    let obj = this.getAreaInfo(area);
    this.deliveryFee = obj[0].charge;
    console.log(this.deliveryFee);
    // this.total = this.getTotalCart() + this.deliveryFee ;
  }
  getAreaInfo(area) {
    return this.areas.filter(item => {
      return item.Area.toLowerCase().indexOf(area.toLowerCase()) > -1;
    });
  }
  noDeliveryFee(delivery) {
    if (delivery === 'I will pick it') {
      this.deliveryFee = 0;
      this.noPickUpTime = false;
      // this.paid = false ;
    } else {
      this.noPickUpTime = true;
      // this.paid = true ;
      if (this.selectedarea != undefined) {
        this.getDeliveryFee(this.selectedarea);
      }
    }
  }
  async changeNumber() {
    const pop = await this.alert.create({
      message: 'Enter the Mpesa number to pay with',
      inputs: [
        {
          placeholder: 'Enter number eg. 07xx xxx xxx',
          name: 'number'
        }
      ],
      buttons: [
        {
          text: 'MyContacts',
          handler: () => {
            console.log('Pick from contacts');
          }
        },
        {
          text: 'Ok',
          handler: (data) => {
            console.log(data);
            this.Number = data.number;
            this.formatNumber();
          }
        }
      ]
    });
    await pop.present();
  }
  //Send the order to the shop
  sendOrder() {

    if (this.delivery === 'Deliver it to me') {
      // no pick up time and no online payment
      if (this.selectedarea == undefined || this.selectedarea == null) {
        this.alertPop("Please select a delivery location near you");
        return;
      }
      let Today = new Date();
      let id = this.generateOrderID().substring(0, 8).toUpperCase();
      console.log(id)
      let data = {
        "Date": Today,
        "products": this.cart,
        "shop": this.shopSelected,
        "status": "open",
        "username": localStorage.getItem('Name'),
        "notes": this.notes,
        "OrderID": id,
        "Delivery": this.delivery,
        "DeliveryFee": this.deliveryFee,
        "Location": this.selectedarea,
        "userID": localStorage.getItem('userID'),
        "pickDay": "Today",
        "payment": ""
      }
      console.log('data', data);
      if (this.paymentMethod === "mpesa") {
        data.payment = "mpesa";
        this.payForOrder(id);


      } else {
        if (this.paymentMethod === "cash") {
          data.payment = "cash";
          this.fs.collection('Orders').doc(id).set(data).then(res => {
            this.Ordersuccess = true;
            this.showTimeSelect = false;
            this.clearCart();
            this.loader.dismiss();
          })
            .catch(err => { console.log('error msg', err); this.loader.dismiss(); });
        }
      }
      // this.fs.collection('Orders').doc(id).set(data).catch(err => {console.log('error msg',err)})

    } else {
      // pick time and online payment
      if (this.pickHour !== undefined && this.pickDay !== undefined && this.pickMinute !== undefined && this.delivery !== undefined) {
        let Today = new Date();
        let id = this.generateOrderID().substring(0, 8).toUpperCase();
        console.log(id);
        let data = {
          "Date": Today,
          "products": this.cart,
          "shop": this.shopSelected,
          "status": "open",
          "pickHour": this.pickHour,
          "pickMins": this.pickMinute,
          "pickDay": this.pickDay,
          "username": localStorage.getItem('email'),
          "notes": this.notes,
          "OrderID": id,
          "Delivery": this.delivery,
          "DeliveryFee": this.deliveryFee,
          "userID": localStorage.getItem('userID'),
          "payment": ""
        }
        console.log('data', data);
        if (this.paymentMethod === "mpesa") {
          data.payment = "mpesa";
          this.payForOrder(id);


        } else {
          if (this.paymentMethod === "cash") {
            data.payment = "cash";
            this.fs.collection('Orders').doc(id).set(data).then(res => {
              this.Ordersuccess = true;
              this.showTimeSelect = false;
              this.clearCart();
              this.loader.dismiss();
            })
              .catch(err => { console.log('error msg', err); this.loader.dismiss(); });
          }
        }
      } else {
        this.alertPop("Please set pick up time and delivery option");
      }
    }
  }
  clearCart() {
    this.cart.length = 0;
    this.service.resetCart();
    this.delivery = '';
    this.deliveryFee = 0;
    this.pickDay = '';
    this.pickHour = '';
    this.pickMinute = '';
  }
  checkDeliveryDetails() {
    if (this.delivery === 'Deliver it to me') {
      if (this.selectedarea == undefined || this.selectedarea == null) {
        this.alertPop("Please select a delivery location near you");
        this.loader.dismiss();
        return "quit";
      }
    } else {
      if (this.pickHour === undefined && this.pickDay === undefined && this.pickMinute === undefined && this.delivery === undefined) {
        this.alertPop("Please set pick up time and delivery option");
        this.loader.dismiss();
        return "quit";
      }
    }
    return "proceed";
  }
  // method of payment
  async payment() {
    const pop = await this.alert.create({
      header: "Select method of payment",
      inputs: [
        {
          type: 'radio',
          label: 'Cash',
          value: 'cash'
        },
        {
          type: 'radio',
          label: 'M-pesa',
          value: 'mpesa'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: (data: string) => {
            console.log('clicked', data);
            // if(data === undefined)
          }
        },
        {
          text: 'Proceed',
          handler: (data: string) => {
            console.log('clicked', data);
            this.paymentMethod = data;
            // this.loading();
            this.sendOrder();
          }
        }
      ]
    });
    await pop.present();
  }
  // pay for order
  payForOrder(id) {
    if (this.checkDeliveryDetails() !== "proceed") {
      this.loader.dismiss();
      return;
    }
    this.loading();
    let desc = localStorage.getItem('userID');
    this.mpesa.getToken().subscribe(res => {
      let token = res;
      if (token === null) {
        console.log('TOKEN NULL');
        this.toaster("Something went wrong try again");
        this.loader.dismiss();
        return;
      } else {
        this.sendSTK(desc, token);
      }
    })
  }
  sendSTK(desc, token) {
    this.mpesa.sendStkRequest(this.total, this.Number, desc, token).subscribe(data => {
      let dt:mpesaRes = data;
      console.log(dt.ResponseCode);
      if (dt.errorMessage === "Invalid Access Token") {
        //  this.getToken();
        this.loader.dismiss();
        this.toaster('Network issues try again');
        return;
      }
      if (dt.errorMessage === "Bad Request - Invalid PhoneNumber") {
        console.log("Invalid PhoneNumber");
        this.toaster('The phone number in your account is incorrect')
        this.loader.dismiss();
        return;
      }
      if (dt.errorMessage === "Invalid grant type passed") {
        this.toaster('something went wrong try checking out again');
        this.loader.dismiss();
        return;
      }
      if (dt.ResponseCode === 0) {
        console.log("checking response");
        setTimeout(() => {
          this.mpesa.getMpesaResponse().subscribe(data => {
            console.log(data);
            const id = this.generateOrderID();
            console.log(id);
            if (data === "paid") {
              this.fs.collection('Orders').doc(id).set(data).then(res => {
                this.Ordersuccess = true;
                this.showTimeSelect = false;
                this.clearCart();
                this.loader.dismiss();
              })
                .catch(err => { console.log('error msg', err); this.loader.dismiss(); });
            } else {
              if (data === 'canceled') {
                this.toaster('the payment was canceled')
              }
              //this.clearLocalArrays();
              // this.errorCheckingOut();
              console.log(data);
            }
          }, error => {
            console.log(error);
          });
        }, 6000)
      }
      setTimeout(()=>{
        this.Ordersuccess = true;
                this.showTimeSelect = false;
                this.clearCart();
                this.loader.dismiss();
      },7000);
      
      console.log(dt.ResponseCode);
      // this.fs.collection('Orders').doc(id).set(data).then(res =>{
      //   this.Ordersuccess = true;
      //   this.showTimeSelect = false;
      //   this.clearCart();
      //   this.loader.dismiss();
      // })
      // .catch(err => {console.log('error msg',err);this.loader.dismiss();});

    }, error => {
      console.log(error);
      this.loader.dismiss();
    });
  }

  // generate orderID
  generateOrderID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }
  // loader
  async loading() {
    this.loader = await this.loadCtrl.create({
      message: 'Preparing payment ...'
    });
    await this.loader.present();
  }
  //  toaster
  async toaster(msg) {
    const ts = await this.toast.create({
      message: msg,
      position: "bottom",
      duration: 2000
    });
    await ts.present();
  }
  //back to the previous page

  back() {
    this.fireApi.shareShopBy('shopBy');
    this.location.back();
  }
  //remove item from cart
  remove(item) {
    this.service.removeFromCart(item);
    this.cart = this.service.getCart();
    if (this.cart.length === 0) {
      this.clearCart();
    }
  }
  //get total of items in cart
  items() {
    return this.count = this.cart.reduce((a, b) => a + (b.count), 0);
  }
  //get the shop name

  showShop() {
    this.fireApi.serviceData
      .subscribe(data => (this.shopSelected = data));
    console.log("sent data from home page : ", this.shopSelected);
  }
  //get the cart total

  getTotalCart() {
    this.total = this.cart.reduce((a, b) => a + (b.count * b.currentprice), 0);
    return (Number(this.total) + Number(this.deliveryFee));
  }
  //add quantity for an item in cart
  add(item) {
    this.service.addCount(item);
    this.cart = this.service.getCart();
  }
  //reduce quantity for an item in cart
  reduce(item) {
    if (item.count > 1) {
      this.service.reduceCount(item);
      this.cart = this.service.getCart();
    }
  }
  //alert
  async alertPop(msg) {
    const alert = await this.alert.create({
      message: msg,
      buttons: [
        {
          text: 'close',
          role: 'cancel',
        },
      ]
    })
    alert.present();
  }


}
