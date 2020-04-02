import { Component, OnInit } from "@angular/core";
import { FirestoreService } from "../services/firestore.service";
// import { User } from "../models/user";
import "rxjs/Rx";
import { Observable } from "rxjs/Rx";
import { User } from "../models/user";
import { ToastController, LoadingController, AlertController } from "@ionic/angular";
import { Router } from "@angular/router";
import { AngularFirestore } from '@angular/fire/firestore';
import { DatabaseService } from '../services/database.service';
import { map } from 'rxjs/operators';

@Component({
  selector: "app-settings",
  templateUrl: "./settings.page.html",
  styleUrls: ["./settings.page.scss"]
})
export class SettingsPage implements OnInit {


  User: User;
  settingsPassword = {
    newPassword: ""
  };

  passsData = {
    oldpassword: ""
  };

  settingsEmail = {
    email: null
  };

  loading: any = null;

  userID: any = null;

  btn: any = "UPDATE";
  todaysdate;
  wallet: number = 0;
  shops;
  dob;
  toggleOn = false;
  shopSelected;
  count = '';

  constructor(
    public fireApi: FirestoreService,
    public loadingController: LoadingController,
    public toastController: ToastController,
    public alertCtrl: AlertController,
    public navCtrl: Router,
    public database: AngularFirestore,
    private db: DatabaseService
  ) {
    // this.fireApi.hiddenTabs = true ;
    this.fireApi.serviceNotice.subscribe(res => {
      this.count = res ;
      console.log(this.count)
    });

  }

  ngOnInit() {

    this.getDate();
    this.getShops();
  }
  ionViewWillEnter() {
    this.userID = localStorage.getItem('userID');
    this.getUser(this.userID);
  }
  getShops() {
    this.fireApi.getShops().valueChanges().subscribe(res => {
      this.shops = res ;
    });
    // this.fireApi
    //   .getShops()
    //   .snapshotChanges()
    //   .pipe(map(changes => {
    //     return changes.map(c => ({ key: c.payload.key, ...c.payload.val() }));
    //   }))
    //   .subscribe(shops => {
    //     this.shops = shops;
    //     console.log(this.shops);
    //   });

  }
  // get date
  getDate() {
    this.todaysdate = new Date().getTime();
  }

  getUser(id) {
    this.database.collection('users').doc(id).valueChanges().subscribe(res => {
      this.User = res;
      this.dob = new Date(this.User.dob);
      console.log(this.User)
    })
  }
  // notifications page
  notifications() {
    this.navCtrl.navigate(['tabs/notifications']);
  }


  editPersonalDetails() {
    this.db.setUser(this.User);
    this.navCtrl.navigate(['tabs/ipaytransmodal']);
  }


  async submit(oldpassword) {

    this.presentLoading();
    let user = await this.fireApi.getCurrentUser();


    // Change password
    if (
      this.settingsPassword.newPassword != "" &&
      oldpassword != ""
    ) {
      this.fireApi.updatePassword(
        this.settingsPassword.newPassword,
        this.settingsEmail.email,
        this.passsData.oldpassword
      ).then(data => {
        this.loading.dismiss();
        this.presentToast(data);
      }, error => {
        this.loading.dismiss();
        this.presentToast(error.message)
      });
    }

    this.settingsPassword = {
      newPassword: ""
    };


  }


  async presentPrompt() {
    let alert = await this.alertCtrl.create({
      subHeader: "Your current password",
      inputs: [
        {
          name: 'password',
          placeholder: 'Password',
          type: 'password'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Continue',
          handler: data => {
            this.submit(data.password);
          }
        }
      ]
    });
    alert.present();
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
