import { Component, OnInit ,OnDestroy, AfterViewInit  } from '@angular/core';
import { FirestoreService } from '../services/firestore.service';
import { LoadingController, ToastController, Events, AlertController, MenuController, Platform,  } from '@ionic/angular';
import { Router } from '@angular/router';

import * as firebase from 'firebase/app';
// import {GooglePlus} from '@ionic-native/google-plus/ngx';
// import { AdMobFree } from '@ionic-native/admob-free/ngx';
import { tap } from 'rxjs/operators';
import { AngularFireAuth } from '@angular/fire/auth';
import { Location } from '@angular/common';
import { AppComponent } from '../app.component';
import { DatabaseService } from '../services/database.service';
import { OneSignal } from '@ionic-native/onesignal/ngx';
import { OneSignalService } from '../OneSignal/one-signal.service';
import { Tab1Page } from '../tab1/tab1.page';


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss']
})

export class LoginPage implements OnInit {

//Variables
    shouldHeight = document.body.clientHeight + 'px';
    loading: any;
    errorCode: any;
    errorMessage: any;
    user ;
    passwordType: string = 'password';
    passwordIcon: string = 'eye-off';
    backButtonSubscription ;
    showSplash = true ;

//objects

      public data: { email: any; password: any } = {
        email: null,
        password: null
      };

 
  constructor(
    public firestore: FirestoreService,
    public loadingController: LoadingController,
    public toastController: ToastController,
    public navCtrl: Router,
    private service : FirestoreService,
    // public googleplus:GooglePlus,
    public events: Events,
    // private admobFree: AdMobFree,
    private alertCtrl: AlertController,
    public menuCtrl: MenuController,
    private platform: Platform,
    public fauth: AngularFireAuth,
    public location: Location,
    public ref : AppComponent,
    public db: DatabaseService,
    private oneSignal: OneSignal,
    private notice: OneSignalService,
    private tab: Tab1Page
   
  ) {
    
    setTimeout(()=>{
      this.showSplash = false ;
    },300);
    
  }
 
  ngOnInit() {
    this.service.hiddenTabs = true ;
  }

  //  ONESIGNAL INTERGRATION

            setupPush() {
              // register the device to onesignal
              this.oneSignal.startInit('17ee3f91-dda1-43b2-836b-c747ff447e48', '587167744825');
              this.oneSignal.getIds().then(res => {
                localStorage.setItem('DeviceID',res.userId);
              })
              this.oneSignal.inFocusDisplaying(this.oneSignal.OSInFocusDisplayOption.None);

              // Notifcation was received in general
              this.oneSignal.handleNotificationReceived().subscribe(data => {
                let msg = data.payload.body;
                let title = data.payload.title;
                let additionalData = data.payload.additionalData;
                let notice = data.payload ;
                // this.showAlert(title, msg, additionalData.task);
                this.notice.setNoticeData(notice);
                this.tab.count = Number(localStorage.getItem('NoticeCount'));
              });

              // Notification was really clicked/opened
              this.oneSignal.handleNotificationOpened().subscribe(data => {
                // Just a note that the data is a different place here!
                let notice = data.notification.payload;

                //open notification in the notification page
                this.notice.setNoticeData(notice);
                this.navCtrl.navigate(['/tabs/notifications']);
                
              });

              this.oneSignal.endInit();
            }

           
 // hide password btn
      
        hideShowPassword() {
          this.passwordType = this.passwordType === 'text' ? 'password' : 'text';
          this.passwordIcon = this.passwordIcon === 'eye-off' ? 'eye' : 'eye-off';
      }
  
// redirect to home if logged in before
        redirect(){
          const id = localStorage.getItem('userID');
          if(id !== null){
            this.navCtrl.navigate(['tabs/tab1']);
          }
        }
// go to register page

        async register(){
            this.navCtrl.navigate(['tabs/register']);
            
          }
//send login credentials

        submit() {
          this.presentLoading();
          this.firestore.login(this.data.email, this.data.password).then(
            resp => {
              this.next(resp);
            },
            error => {
              this.loading.dismiss();
              this.presentToast(error.message,'bottom');
              
            }
          );
        }
        next(resp) {
          localStorage.setItem('userEmail', resp.email);
          localStorage.setItem('userName', resp.name);
          const id = this.fauth.auth.currentUser.uid ;
          localStorage.setItem('userID', id);
          this.loading.dismiss();
          // this.presentToast1(' Loign successful ' + resp.name);
          this.service.hiddenTabs = false ;
          this.ref.getDetails(id);
          this.setupPush();
          // this.navCtrl.navigate(['tabs/tab1']);
          this.location.back();
        }

// Loaders

      async presentLoading() {
        this.loading = await this.loadingController.create({
          message: 'Wait ...'
        });
        return await this.loading.present();
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
//Go back a page
        
      back(){
        this.service.hiddenTabs = false;
        localStorage.clear();
        this.location.back();
      }

  
  
  //toast
      async toasted(msg){
        const ts = await this.toastController.create({
          message: msg.body(),
          duration: 3000
        })
        ts.present();
      }
}
