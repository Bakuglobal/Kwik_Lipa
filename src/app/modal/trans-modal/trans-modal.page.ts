import { Component, OnInit } from "@angular/core";
import { FirestoreService } from "../../services/firestore.service";
import { NavParams, ModalController } from "@ionic/angular";


@Component({
  selector: "app-trans-modal",
  templateUrl: "./trans-modal.page.html",
  styleUrls: ["./trans-modal.page.scss"]
})

export class TransModalPage implements OnInit {
  transactions = [];

  userID: any;
  transID: any;

  constructor(public fireApi: FirestoreService, public navParams: NavParams, public modalCtrl: ModalController) {
    this.userID = this.navParams.get("userID");
    this.transID = this.navParams.get("transID");
  }

  ngOnInit() {
    this.getData();
  }

  getData() {
    console.log(this.transID);
    this.fireApi
      .getDeepTransactions(this.userID, this.transID)
      .valueChanges()
      .subscribe(trans => {
        this.transactions = trans;
        console.log('transaction here :' +JSON.parse(JSON.stringify(this.transactions)));
      });
  }

  close() {
    this.modalCtrl.dismiss();
  }

  getTotalCart() {
    return this.transactions.reduce(function (previous, current) {
      return previous + current.price;
    }, 0);
  }
}
