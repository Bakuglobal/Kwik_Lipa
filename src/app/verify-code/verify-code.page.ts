import { Component, OnInit } from '@angular/core';
import { DatabaseService } from '../services/database.service';
import { FirestoreService } from '../services/firestore.service';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { ToastController, LoadingController } from '@ionic/angular';
import { AppComponent } from '../app.component';
import { OneSignalService } from '../OneSignal/one-signal.service';

@Component({
  selector: 'app-verify-code',
  templateUrl: './verify-code.page.html',
  styleUrls: ['./verify-code.page.scss'],
})
export class VerifyCodePage implements OnInit {
  data: any;
  loader: any;
  constructor(
    private service: FirestoreService,
    private db: DatabaseService,
    private navCtrl: Router,
    private location: Location,
    private toastController: ToastController,
    private spin: LoadingController,
    private app: AppComponent,
    private notice: OneSignalService,
  ) { 
    this.service.hiddenTabs = true ;
    this.data =  this.db.sharedata();
    console.log(this.data);
  }

  ngOnInit() {
  }


  otpController(event,next,prev){
    if(event.target.value.length < 1 && prev){
      prev.setFocus()
    }
    else if(next && event.target.value.length>0){
      next.setFocus();
    }
    else {
     return 0;
    } 
 }
 back(){
   this.location.back();
 }
 register(){
  this.loading();
  console.log('verifying code ....');
  if(this.data.type === "signup"){
    
    this.createUserProfile();

  }else{
    // login
    this.loader.dismiss();
    this.navCtrl.navigate(["tabs/tab1"]);
  }
 }
 resendCode(){
  console.log('resend code ....');
  this.presentToast('code resend to'+' '+this.data.phone);
 }

 async presentToast(data) {
  const toast = await this.toastController.create({
    message: data,
    duration: 3000,
    position: 'bottom',
  });
  toast.present();
}
async loading(){
  this.loader = await this.spin.create({
    message: "verifying code ...",
  });
  await this.loader.present();
}
createUserProfile(){
  this.service.register(this.data.email,this.data.password).then(res => {
      localStorage.setItem('userID',res.user.uid);
      this.service.createUserProfile(this.data,res.user.uid).then(succ => {
        this.clear();
        this.app.getDetails(res.user.uid);
        this.notice.sendTokenToFirebase(res.user.uid);
        this.loader.dismiss();
        this.navCtrl.navigate(["tabs/tab1"]);
      }).catch(
        err => {
          this.loader.dismiss();
          console.log(err) 
        })
    }).catch(error => {
      this.loader.dismiss();
      console.error(error) 
    });
}
clear(){
  this.db.holddata({});
}
}
