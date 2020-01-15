import { Component, OnInit } from "@angular/core";
import { FirestoreService } from "../services/firestore.service";
import "rxjs/Rx";
import {
  AlertController,
  LoadingController,
  ToastController,
  ModalController
} from "@ionic/angular";
import { TransModalPage } from "../modal/trans-modal/trans-modal.page";
// import { AdMobFree } from "@ionic-native/admob-free/ngx";

@Component({
  selector: "app-transactions",
  templateUrl: "./transactions.page.html",
  styleUrls: ["./transactions.page.scss"]
})
export class TransactionsPage implements OnInit {
  transactions = [];
  loading: any;
  transID: any ;

  constructor(
    public fireApi: FirestoreService,
    public loadingController: LoadingController,
    public toastController: ToastController,
    public alertCtrl: AlertController,
    // private admobFree: AdMobFree,
    public modalController: ModalController
  ) {}

  ngOnInit() {
    this.getTransactions();
    // this.removeBannerAd();
    console.log(this.transactions)
  }

  // removeBannerAd(){
  //   this.admobFree.banner.remove();
  // }

  getTransactions() {
    this.fireApi.getCurrentUser().then(results => {
      this.fireApi
        .transactions(results.uid)
        .snapshotChanges()
        .map(changes => {
          return changes.map(c => ({
            key: c.payload.key,
            ...c.payload.val()
          }));
        })
        .subscribe(transactions => {
          this.showData(transactions);
        });
    });
  }

  showData(data) {
    this.transactions = data;
    this.transID = data.key ; 
    console.log('trans ---'+ this.transID);
  }

  //get shop name and date of transactions
  transactionDetails(){
    this.fireApi.getCurrentUser().then(
      res =>{
        let user = res.uid ;
      this.fireApi
      .getDeepTransactions(user, this.transID)
      .valueChanges()
      .subscribe(trans => {
        this.transactions = trans;
      });
    }
    );
    
  }
  async viewTransaction(data) {
    let user = await this.fireApi.getCurrentUser();

    const modal = await this.modalController.create({
      component: TransModalPage,
      componentProps: { userID: user.uid, transID: data.key }
    });
    return await modal.present();
  }

  clearTransaction() {
    this.fireApi.getCurrentUser().then(results => {
      this.fireApi.clearTransactions(results.uid).then(result => {
        this.presentToast("Transactions cleared");
      });
    });
  }

  getTotalCart() {
    return this.transactions.reduce(function(previous, current) {
      return previous + current.price;
    }, 0);
  }

// check for open orders
    openOrder(){
      this.change();
      
    }

//check for past orders
    pastOrder(){
      this.change();
    }
//style active tab to primary color
change(){
  var  tabbar = document.getElementById("tabbar");
  var btns = tabbar.getElementsByClassName("tab");
  for(var i = 0;i <btns.length;i++){
    btns[i].addEventListener("click", function() {
      var current = document.getElementsByClassName("active");
      current[0].className = current[0].className.replace(" active", "");
      this.className += " active";
    })
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
