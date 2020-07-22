import { Component, OnInit, ViewChild, ElementRef, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController, AlertController, LoadingController } from '@ionic/angular';
import { DatabaseService } from '../services/database.service';
import { FirestoreService } from '../services/firestore.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { MpesaService } from '../mpesa/mpesa.service';
import { Location } from '@angular/common';



declare var google;

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
    private loadCtrl: LoadingController,
   
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
    });

  
  }

  ngOnInit() {
    // load map
    
  }
 

  ionViewWillEnter() {
    this.cart = this.service.getCart();
    console.log(this.cart);
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
 

  proceed(){
    // save notes
    this.service.saveNotes(this.notes);
    this.navCtrl.navigate(['tabs/delivery']);
  }

  clearCart() {
    this.cart.length = 0;
    this.service.resetCart();
    this.delivery = '';
    this.deliveryFee = 0;
    this.pickDay = '';
    this.pickHour = '';
    this.pickMinute = '';
    this.fireApi.changeData('Shopname');
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
    this.navCtrl.navigate(['tabs/selectshop']);
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
