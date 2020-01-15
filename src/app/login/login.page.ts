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
    public db: DatabaseService
   
  ) {
    
    setTimeout(()=>{
      this.showSplash = false ;
    },300);
    
  }
 
  ngOnInit() {
    this.service.hiddenTabs = true ;
  }

  //Handle notification for the user

      async setUpNotfications() {
          //get token
          this.db.getToken();
          this.db.listenToNotification().pipe(
            tap(msg => {
              this.toasted(msg);
            })
          ).subscribe();

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
          this.setUpNotfications();
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
