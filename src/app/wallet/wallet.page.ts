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

 

  get generateInvoice() {
    var text = "";
    var possible =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < 10; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
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
  notifications(){
    this.navCtrl.navigate(['tabs/notifications']);
  }
}
