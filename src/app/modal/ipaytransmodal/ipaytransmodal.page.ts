import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router'
import { FirestoreService } from "../../services/firestore.service";

import "rxjs/Rx";
import { Observable } from "rxjs/Rx";
import { User } from "../../models/user";
import { ToastController, LoadingController, AlertController } from "@ionic/angular";
// import { AdMobFree } from '@ionic-native/admob-free/ngx';


@Component({
  selector: 'app-ipaytransmodal',
  templateUrl: './ipaytransmodal.page.html',
  styleUrls: ['./ipaytransmodal.page.scss'],
})
export class IpaytransmodalPage implements OnInit {

  settings = {
    phone: null,
    name: null,
    email: null,
    country: null,
    gender: null
  };

  user: Observable<User[]>;

  loading: any = null;
  settingsEmail = {
    email: null
  };

  userID: any = null;

  constructor(public navCtrl: Router,
    public fireApi: FirestoreService,
    public loadingController: LoadingController,
    // public admobFree: AdMobFree,
    public toastController: ToastController,
    public alertCtrl: AlertController,) { }

  ngOnInit() {
    this.getUser();
    // this.removeBannerAd();
  }

  // removeBannerAd(){
  //   this.admobFree.banner.remove();
  // }
  async getUser() {
    let user = await this.fireApi.getCurrentUser();
    await this.fireApi
      .getUserDetails(user.uid)
      .snapshotChanges()
      .map(changes => {
        return changes.map(c => ({ key: c.payload.key, ...c.payload.val() }));
      })
      .subscribe(usr => {
        console.log(usr);
        this.showData(usr);
      });
  }
  showData(user) {
    this.settings.phone = user[0].phone;
    this.settings.name = user[0].name;
    this.settings.email = user[0].email;
    this.settings.gender = user[0].gender;
    this.settings.country = user[0].country;
    this.settingsEmail.email = user[0].email;
  }
  async presentPrompt() {
    let alert = await this.alertCtrl.create({
      subHeader: "Enter your password to make changes",
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
  async submit(oldpassword) {

    this.presentLoading();
    let user = await this.fireApi.getCurrentUser();

    // Save user information

    // Change Email 
    this.fireApi.updateUserEmail(this.settingsEmail.email, this.settings.email, oldpassword).then(data => {
      this.fireApi
      .getUserDetails(user.uid)
      .snapshotChanges()
      .map(changes => {
        return changes.map(c => ({ key: c.payload.key, ...c.payload.val() }));
      })
      .subscribe(user => {
        let key = user[0].key;
        this.settings.email = this.settingsEmail.email;
        this.fireApi.updateOperationUsers(key, this.settings);
        this.presentToast("Information updated successfully");
        this.loading.dismiss();
      }, error => {
        this.loading.dismiss();
        this.presentToast(error.message);
      });
      this.loading.dismiss();
      this.presentToast1(data);
    }, error => {
      this.loading.dismiss();
      this.presentToast(error.message)
    });
  }

  

  toMyAccount(){
    this.navCtrl.navigate(['tabs/settings']);
  }
   // Loader
   async presentLoading() {
    this.loading = await this.loadingController.create({
      message: "Wait ..."
    });
    return await this.loading.present();
  }

  // Toaster error
  async presentToast(data) {
    const toast = await this.toastController.create({
      message: data,
      duration: 3000,
      position: 'bottom',
      // cssClass: 'toast-error'
    });
    toast.present();
  }
   // Toaster success
   async presentToast1(data) {
    const toast = await this.toastController.create({
      message: data,
      duration: 3000,
      position: 'top',
      // cssClass: 'toast-success'
    });
    toast.present();
  }
}
