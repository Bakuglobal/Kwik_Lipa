import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { FirestoreService } from '../services/firestore.service';
import { ToastController, LoadingController, Platform, AlertController } from '@ionic/angular';
import * as firebase from 'firebase/app';
import { AppLauncher, AppLauncherOptions } from '@ionic-native/app-launcher/ngx';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';


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
    private alertCtrl: AlertController,
    private platform: Platform,              
    private iab: InAppBrowser,
   


    ) { }

  ngOnInit() {
  }

//Go back to the prev page

      back(){
        this.location.back();
      }

//forgot password
 
      async forgotPassword(){
          this.presentLoading();
          return firebase.auth().sendPasswordResetEmail(this.email)
          .then(
                    res =>  {
                              this.presentToast('Password reset link send to '+' '+this.email,'bottom');
                              this.openGmail = true ;
                              this.loading.dismiss();
                            }
            )
          .catch( error => {
                             this.loading.dismiss();
                             this.presentToast('No user record with '+this.email,'bottom')
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
}
