import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { FirestoreService } from '../services/firestore.service';
import { ToastController, LoadingController, Platform, AlertController } from '@ionic/angular';
import * as firebase from 'firebase/app';
import { AppLauncher, AppLauncherOptions } from '@ionic-native/app-launcher/ngx';


@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.page.html',
  styleUrls: ['./forgot-password.page.scss'],
})
export class ForgotPasswordPage implements OnInit {
  //variables
      email ;
      loading ;

  //booleans
      openGmail = false ;

  //constants
       

  constructor(
    public location: Location,
    public firestore: FirestoreService,
    public toastController: ToastController,
    public loadingController: LoadingController,
    private appLauncher: AppLauncher, 
    private platform: Platform,
    private alertCtrl: AlertController,
   


    ) { }

  ngOnInit() {
  }

//Go back to the prev page

      back(){
        this.location.back();
      }

//forgot password
 
      async forgotPassword(email){
          this.presentLoading();
          return firebase.auth().sendPasswordResetEmail(email)
          .then(
                    res =>  {
                              this.presentToast('Password reset link send to '+' '+email,'bottom');
                              this.openGmail = true ;
                              this.loading.dismiss();
                            }
            )
          .catch( error => {
                             this.loading.dismiss();
                             this.presentToast('No user record with '+email,'bottom')
                           }
          )
          
        }
   
// Toaster error
      async presentToast(data,position) {
        const toast = await this.toastController.create({
          message: data,
          duration: 3000,
          position: position,
        });
        toast.present();
      }
// Loaders

async presentLoading() {
  this.loading = await this.loadingController.create({
    message: 'Wait ...'
  });
  return await this.loading.present();
}
//open gmail
goToGmail(){

  const options: AppLauncherOptions = {
  }
  
  if(this.platform.is('android')) {
    options.uri = 'googlegmail://'
  } else {
    options.packageName = 'com.google.android.gm'
  }
  
  this.appLauncher.canLaunch(options)
    .then(
            (canLaunch: boolean) => {
            this.appLauncher.launch(options)
          }
      )
    .catch(
            (error: any) => 
            // console.error('Facebook is not available')
            this.alertCtrl.create({
              message:'Sorry we cant find a Gmail Application on your phone',
              buttons: [
                {
                  text:'close',
                  role: 'cancel'
                }
              ]
            })
      );

}
}
