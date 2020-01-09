import { Component, OnInit } from "@angular/core";
import { FirestoreService } from "../services/firestore.service";
import { Support } from "../models/support";

import "rxjs/Rx";
import { Observable } from "rxjs/Rx";
import { LoadingController, ToastController } from "@ionic/angular";
// import { AdMobFree } from "@ionic-native/admob-free/ngx";

@Component({
  selector: "app-support",
  templateUrl: "./support.page.html",
  styleUrls: ["./support.page.scss"]
})
export class SupportPage implements OnInit {
  data: { message: string; userID: string } = {
    message: null,
    userID: null
  };
  message: any ;
  loading: any;
  msg = false ;
 

  constructor(
    public fireApi: FirestoreService,
    public loadingController: LoadingController,
    public toastController: ToastController,
    // private admobFree: AdMobFree
  ) {}

  ngOnInit() {
    this.fireApi.getCurrentUser().then(resp => {
      this.data.userID = resp.uid;
      this.data.message = resp.message ;
    });
    // this.removeBannerAd();
    this.checkmsg();
  }
  // removeBannerAd(){
  //   this.admobFree.banner.remove();
  // }
//check if no msg
checkmsg(){
  console.log(this.message);
  if(this.message !== undefined){
    this.msg = true ;
  }
}

  submit() {
    //this.presentLoading();
    this.fireApi.sendSupport(this.data).then(
      resp => {
       // this.loading.dismiss();
       this.message = this.data.message ;
       this.checkmsg();
        this.data.message = null;
        this.presentToast("Message sent successfully");
      },
      error => {
        //this.loading.dismiss();
        this.presentToast(error.message);
      }
    );
  }

  getMessages() {
    this.fireApi
      .viewMessage() ;
      this.message = this.fireApi.viewMessage() ;
      
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
      position: 'top',
      duration: 3000,
      cssClass: 'success'
    });
    toast.present();
  }

  
}
