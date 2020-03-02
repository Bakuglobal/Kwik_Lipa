import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController, AlertController } from '@ionic/angular';
import { DatabaseService } from '../services/database.service';
import { FirestoreService } from '../services/firestore.service';
import { OffersPage } from '../offers/offers.page';
import { AngularFirestore } from '@angular/fire/firestore';
import { MpesaService } from '../mpesa/mpesa.service';
import { Location } from '@angular/common';

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
  CurrentTime ;

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
  ) {
    this.fireApi.getAreas().subscribe(res => {
      this.areas = res;
      console.log(this.areas);
    });
    this.CurrentTime = new Date().getHours();
    console.log(this.CurrentTime);
    if(this.CurrentTime < 8){
      for(var i = 8;i < 19;i++){
        this.hour.push(i);
      }
    }
    if(this.CurrentTime > 8){
      let start = this.CurrentTime + 1 ;
      for(var i: number = start;i < 19;i++){
        this.hour.push(i);
      }
    }

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
      let id = this.genearteOrderID().substring(0, 8).toUpperCase();
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
        "pickDay": "Today"
      }
      this.fs.collection('Orders').doc(id).set(data).catch(err => {console.log(err)})
      this.Ordersuccess = true;
      this.showTimeSelect = false;
      this.cart.length = 0;
      this.service.resetCart();
      this.delivery = '';
      this.deliveryFee = 0;
      this.pickDay = '';
      this.pickHour = '';
      this.pickMinute = '';
    } else {
      // pick time and online payment
      if (this.pickHour != undefined && this.pickDay != undefined && this.pickMinute != undefined && this.delivery != undefined) {
        let Today = new Date();
        let id = this.genearteOrderID().substring(0, 8).toUpperCase();
        console.log(id)
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
        }

        this.fs.collection('Orders').doc(id).set(data).catch(err => {console.log(err)})
        this.Ordersuccess = true;
        this.showTimeSelect = false;
        this.cart.length = 0;
        this.service.resetCart();
        this.delivery = '';
        this.deliveryFee = 0;
        this.pickDay = '';
        this.pickHour = '';
        this.pickMinute = '';
      } else {
        this.alertPop("Please set pick up time and delivery option");
      }
    }

  }
  // pay for order
  payForOrder() {
    this.mpesa.sendStkRequest(this.total, this.Number);
  }
  // generate orderID
  genearteOrderID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }
  //back to the previous page

  back() {
    this.location.back();
  }
  //remove item from cart
  remove(item) {
    this.service.removeFromCart(item);
    this.cart = this.service.getCart();
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
    if(item.count > 1){
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
