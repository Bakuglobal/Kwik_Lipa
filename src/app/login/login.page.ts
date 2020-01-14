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


  shouldHeight = document.body.clientHeight + 'px';

  public data: { email: any; password: any } = {
    email: null,
    password: null
  };

  loading: any;

  errorCode: any;

  errorMessage: any;
  user ;

  passwordType: string = 'password';
 passwordIcon: string = 'eye-off';
 backButtonSubscription ;
 showSplash = true ;
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
 async setUpNotfications() {
    //get token
    this.db.getToken();
    this.db.lisetnToNotification().pipe(
      tap(msg => {
        this.toasted(msg);
      })
    ).subscribe();

   }
 
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
 async register(){
    this.navCtrl.navigate(['tabs/register']);
     
  }
 
  submit() {
    this.presentLoading();
    this.firestore.login(this.data.email, this.data.password).then(
      resp => {
        this.next(resp);
      },
      error => {
        this.loading.dismiss();
        this.presentToast(error.message);
        
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
    this.navCtrl.navigate(['tabs/tab1']);
  }

  // Loader
  async presentLoading() {
    this.loading = await this.loadingController.create({
      message: 'Wait ...'
    });
    return await this.loading.present();
  }

  // Toaster error
  async presentToast(data) {
    const toast = await this.toastController.create({
      message: data,
      duration: 3000,
      position: 'bottom',
    });
    toast.present();
  }
  // Toaster success
  async presentToast1(data) {
    const toast = await this.toastController.create({
      message: data,
      duration: 3000,
      position: 'top',
    });
    toast.present();
  }
  back(){
    this.service.hiddenTabs = false;
    localStorage.clear();
    this.location.back();
  }

  // Google sign in

  // login(){
  //   this.googleplus.login({
  //     'webClientId':'587167744825-38lfevsqb2h7o3jave51237cteov4vd2.apps.googleusercontent.com',
  //     'offline':true
  //   }).then(res=>{
  //     firebase.auth().signInWithCredential(firebase.auth.GoogleAuthProvider.credential(res.IdToken))
  //     .then(suc=>{
  //       alert("login successful")
  //     }).catch(ns=>{
  //       alert("login not successful")
  //     })
  //   })
  // }

  //forgot password
  reset(){
    this.password();
    
  }
 async forgotPassword(email){
     return firebase.auth().sendPasswordResetEmail(email)
     .then(res =>  this.presentToast('Password reset link send to '+' '+email))
     .catch(error => this.presentToast('No user record with '+email))
     
  }
  async password(){
    let pop = await this.alertCtrl.create({
      header: 'Enter Email',
      message: 'Enter email address to receive password reset link',
      inputs: [
        {
          name: 'email',
          placeholder: 'you@example.com'
        }
      ],
      buttons: [
        {
          text: 'cancel',
          role: 'cansel'
        },
        {
          text: 'Send',
          handler: data => {
            let email = data.email ;
            console.log(email);
            this.forgotPassword(email);
            //send pass reset link to email
          }
        }
      ]
    });
    pop.present();
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
