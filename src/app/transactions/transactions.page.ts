import { Component, OnInit, ɵConsole } from "@angular/core";
import { FirestoreService } from "../services/firestore.service";
import "rxjs/Rx";
import {
  AlertController,
  LoadingController,
  ToastController,
  ModalController
} from "@ionic/angular";
import { TransModalPage } from "../modal/trans-modal/trans-modal.page";
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Order } from '../models/order';
import { AndroidFullScreen } from '@ionic-native/android-full-screen/ngx';
import { ViewOrderPage } from '../view-order/view-order.page';
import { Router } from '@angular/router';
import { DatabaseService } from '../services/database.service';
// import { AdMobFree } from "@ionic-native/admob-free/ngx";

@Component({
  selector: "app-transactions",
  templateUrl: "./transactions.page.html",
  styleUrls: ["./transactions.page.scss"]
})
export class TransactionsPage implements OnInit {

  // varaibles
  transactions = [];
  loading: any;
  transID: any;
  userID;
  myOpenOrders = [];
  myPastOrders = [];
  paidOrders = [];
  docID = [];
  past = false;
  open = true;
  full = false;
  count = '' ;

  constructor(
    public fireApi: FirestoreService,
    public loadingController: LoadingController,
    public toastController: ToastController,
    public alertCtrl: AlertController,
    public fs: AngularFirestore,
    public modalController: ModalController,
    private androidfullscreen: AndroidFullScreen,
    private navCtrl: Router,
    private db: DatabaseService
  ) {
    this.userID = localStorage.getItem('userID');
    console.log(this.userID);
    this.fireApi.serviceNotice.subscribe(res => {
      this.count = res ;
      console.log(this.count)
    });
  }

  ngOnInit() {
    // this.getTransactions();
    console.log(this.transactions);
    this.getOpenOrders();
    this.getPastOrders();

  }
  
  async viewOrder(item) {
      const mod = await this.modalController.create({
        component: ViewOrderPage,
        componentProps: item
      });
      console.log(item);
      await mod.present();
  }
   getShopNumber(item){
     this.db.getShopPhoneNumber(item.shop).subscribe(res => {
     console.log(res[0].Contacts);
     item.phone =  res[0].Contacts ;
     this.viewOrder(item) ;
    });
  }
   // notifications page
   notifications(){
    this.navCtrl.navigate(['tabs/notifications']);
  }


  showMore(item) {
    item.show = true;
  }
  showLess(item) {
    item.show = false;
    console.log('less');
  }
  orderChange(event) {
    if (event.detail.value === 'past') {
      this.pastOrder()
      console.log('past')
    }
    if (event.detail.value === 'open') {
      this.openOrder()
      console.log('open')
    }
  }
  // get open orders
  getOpenOrders() {
    this.fireApi.openOrders(this.userID).subscribe(res => {
      this.myOpenOrders = res;
      console.log(res)
    });

  }
  // get past orders
  getPastOrders() {
    this.fireApi.pastOrders(this.userID).subscribe(res => {
      this.myPastOrders = res;
      console.log('canceled =>' + res)
    });
    this.fireApi.pastOrders(this.userID).subscribe(res => {
      this.paidOrders = res;
      console.log('paid' + res)
    });

  }

  // get scan and pay history

  // getTransactions() {
  //   this.fireApi.getCurrentUser().then(results => {
  //     this.fireApi
  //       .transactions(results.uid)
  //       .snapshotChanges()
  //       .map(changes => {
  //         return changes.map(c => ({
  //           key: c.payload.key,
  //           ...c.payload.val()
  //         }));
  //       })
  //       .subscribe(transactions => {
  //         this.showData(transactions);
  //       });
  //   });
  // }

  showData(data) {
    this.transactions = data;
    this.transID = data.key;
    console.log('trans ---' + this.transID);
  }

  //get shop name and date of transactions
  transactionDetails() {
    this.fireApi.getCurrentUser().then(
      res => {
        let user = res.uid;
        this.fireApi
          .getDeepTransactions(user, this.transID)
          .valueChanges()
          .subscribe(trans => {
            this.transactions = trans;
          });
      }
    );

  }
  // view single transaction
  async viewTransaction(data) {
    let user = await this.fireApi.getCurrentUser();

    const modal = await this.modalController.create({
      component: TransModalPage,
      componentProps: { userID: user.uid, transID: data.key }
    });
    return await modal.present();
  }
  //clear transactions
  clearTransaction() {
    this.fireApi.getCurrentUser().then(results => {
      this.fireApi.clearTransactions(results.uid).then(result => {
        this.presentToast("Transactions cleared");
      });
    });
  }
  // get total
  getTotalCart() {
    return this.transactions.reduce(function (previous, current) {
      return previous + current.price;
    }, 0);
  }

  // check for open orders
  openOrder() {
    if (this.open == false) {
      this.open = true;
      this.past = false;
      this.getOpenOrders();
    }
  }

  //check for past orders
  pastOrder() {
    if (this.past == false) {
      this.past = true;
      this.open = false;
      this.getPastOrders();
    }
  }


  // Loader
  async presentLoading() {
    this.loading = await this.loadingController.create({
      message: "Wait ..."
    });
    return await this.loading.present();
  }

  // Toaster
  async presentToast(data) {
    const toast = await this.toastController.create({
      message: data,
      duration: 3000
    });
    toast.present();
  }
}
