import { Component, OnInit } from "@angular/core";
import { FirestoreService } from "../services/firestore.service";
import {
  AlertController,
  ToastController,
  LoadingController,
  ModalController
} from "@ionic/angular";
import { User } from "../models/user";
import { map } from'rxjs/operators' ;
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';



@Component({
  selector: "app-wallet",
  templateUrl: "./wallet.page.html",
  styleUrls: ["./wallet.page.scss"]
})
export class WalletPage implements OnInit {
  

  wallet: number = 0;

  submission: boolean = false;

  loading: any = null;


  payment_channels: any[];

  activate: boolean = false;

  user: User = new User();

  text: string = "Select payment method";

  shops ;
  header: boolean ;
  shopSelected: any ;
  constructor(
    public fireApi: FirestoreService,
    public alertCtrl: AlertController,
    public loadingController: LoadingController,
    public toastController: ToastController,
    public modalController: ModalController,
    public navCtrl: Router,
    private service: FirestoreService,
    private fauth: AngularFireAuth

  ) {
      if(this.fauth.auth.currentUser){
        //logged in
      }else {
        this.navCtrl.navigate(['tabs/login'])
      }         

  }

  onScroll(event) {
    // used a couple of "guards" to prevent unnecessary assignments if scrolling in a direction and the var is set already:
    if (event.detail.deltaY > 0 && this.header && this.service.hiddenTabs) return;
    if (event.detail.deltaY < 0 && !this.header && this.service.hiddenTabs) return;
    if (event.detail.deltaY > 0) {
      console.log("scrolling down, hiding footer...");
      this.header = true;
      this.service.hiddenTabs = false ;
    } else {
      console.log("scrolling up, revealing footer...");
      this.header = false;
      this.service.hiddenTabs = true ;
    };
  };

  ngOnInit() {
    this.getData();
    this.getShops();
  }

  getShops() {
    this.fireApi
      .getShops()
      .snapshotChanges()
      .pipe(map(changes => {
        return changes.map(c => ({ key: c.payload.key, ...c.payload.val() }));
      }))
      .subscribe(shops => {
        this.shops = shops;
        console.log(this.shops);
      });

  }

  async presentAlert() {
    const alert = await this.alertCtrl.create({
      
      header: 'Sorry!',
      subHeader: '',
      message: 'This Payment Method is not yet intergrated.',
      buttons: ['OK']
    });

    await alert.present();
  }
  getData() {
    this.fireApi.getCurrentUser().then(resp => {
      this.fireApi
        .getUserDetails(resp.uid)
        .valueChanges()
        .subscribe(result => {
          this.user = result[0];
          this.wallet = this.user.wallet;
        });
    });
  }

  // submit() {
  //   this.presentLoading();

  //   this.fireApi.getCurrentUser().then(resp => {
  //     this.fireApi
  //       .getUserDetails(resp.uid)
  //       .valueChanges()
  //       .subscribe(result => {
  //         this.user = result[0];

  //         this.data.eml = this.user.email;
  //         this.data.tel = this.user.phone;
  //         this.data.p1 = Number(this.data.amount) + Number(this.user.wallet);
  //         this.data.p2 = this.user.name;
  //         this.data.p4 = resp.uid;
  //         this.data.inv = this.generateInvoice;
  //         this.data.vid = IPAY_VENDORID;

  //         let compressedData =
  //           this.data.live +
  //           this.data.oid +
  //           this.data.inv +
  //           this.data.amount +
  //           this.data.tel +
  //           this.data.eml +
  //           this.data.vid +
  //           this.data.curr +
  //           this.data.p1 +
  //           this.data.p2 +
  //           this.data.p4 +
  //           this.data.cst +
  //           this.data.cbk;

  //         this.fireApi.makeIpayTransCall(compressedData, this.data).subscribe(
  //           results => {
  //             this.response = results;
  //             this.submission = true;
  //             this.activate = true;
  //             this.loading.dismiss();
  //           },
  //           error => {
  //             console.log(error);
  //             this.loading.dismiss();
  //           }
  //         );
  //       });
  //   });
  // }

  get generateInvoice() {
    var text = "";
    var possible =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < 10; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
  }

  // cancelPayment() {
  //   this.activate = false;
  //   this.submission = false;
  //   this.response = new IpayTrans();
  // }

  // selected(resp) {
   

  //   if (resp.name == "MPESA") {
  //     this.presentLoading();
  //     this.fireApi.getCurrentUser().then(resp => {
  //       this.fireApi
  //         .getUserDetails(resp.uid)
  //         .valueChanges()
  //         .subscribe(result => {
  //           this.user = result[0];

  //           this.mpesaData.phone = this.user.phone;
  //           this.mpesaData.sid = this.response.data.sid;
  //           console.log( this.response.data.sid);
  //           this.mpesaData.vid = IPAY_VENDORID;

  //           let compressedData =
  //             this.user.phone + IPAY_VENDORID + this.response.data.sid;

  //           this.fireApi.mpesaPush(compressedData, this.mpesaData).subscribe(
  //             resp => {
  //               this.loading.dismiss();
  //               this.presentToast(resp.text);
  //             },
  //             error => {
  //               this.loading.dismiss();
  //               this.presentToast(error.message);
  //             }
  //           );
  //         });
  //     });
  //   } else {
      
  //     this.presentAlert();
  //   }
  // }

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
  notifications(){
    this.navCtrl.navigate(['tabs/notifications']);
  }
}
