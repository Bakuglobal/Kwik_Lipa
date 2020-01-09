import { Component, OnInit } from "@angular/core";
import { FirestoreService } from "../services/firestore.service";
import { Router } from "@angular/router";
import { ToastController, LoadingController, MenuController } from "@ionic/angular";

import * as firebase from 'firebase/app';
// import {GooglePlus} from '@ionic-native/google-plus/ngx';
// import { AdMobFree } from "@ionic-native/admob-free/ngx";
import { async } from "@angular/core/testing";
import { AngularFirestore } from '@angular/fire/firestore';
import { Location } from '@angular/common';


@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  shouldHeight = document.body.clientHeight + 'px'
  
  public data: { email: any; password: any ; phone: any ; firstName: any; lastName: any; confPassword: any;gender: any;residence: any;dob:Date;} = {
    email: null,
    password: null,
    phone: null ,
    firstName: null,
    lastName: null,
    confPassword: null,
    gender: null,
    residence: null,
    dob: null
  };



  loading: any;
  verify = false ;
  code = false ;
  passwordType: string = 'password';
  passwordIcon: string = 'eye-off';
   provider ;
  constructor(
    public fireApi: FirestoreService,
    public navigation: Router,
    public loadingController: LoadingController,
    public toastController: ToastController,
    public location : Location,
    // public googleplus:GooglePlus,
    // private admobFree: AdMobFree,
    public menuCtrl: MenuController,
    private fs: AngularFirestore,
  ) {
     this.provider = new firebase.auth.GoogleAuthProvider();
  }

  ngOnInit() {
// this.removeBannerAd();
// this.menuCtrl.enable(false);
    this.fireApi.hiddenTabs = true ;
  }
  
 sendCode(){
   this.code = true ;
 }
  google(){
    firebase.auth().signInWithRedirect(this.provider).then(res => {
    firebase.auth().getRedirectResult().then(function(result) {
      if (result.credential) {
        // This gives you a Google Access Token. You can use it to access the Google API.
        var token = result.credential.providerId;
        alert(token)
        // ...
      }
      // The signed-in user info.
      var user = result.user;
    }).catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      alert(errorMessage)
      // The email of the user's account used.
      var email = error.email;
      alert(email)
      // The firebase.auth.AuthCredential type that was used.
      var credential = error.credential;
      alert(credential)
      // ...
    });
    });
  }
  hideShowPassword() {
    this.passwordType = this.passwordType === 'text' ? 'password' : 'text';
    this.passwordIcon = this.passwordIcon === 'eye-off' ? 'eye' : 'eye-off';
}
  // removeBannerAd(){
  //   this.admobFree.banner.remove();
  // }

login(){
  this.navigation.navigate(['tabs/login'])
}


  async register() {
    this.presentLoading();
    
    this.fireApi.register(this.data.email, this.data.password , this.data.phone, this.data.firstName, this.data.lastName,this.data.gender,this.data.dob,this.data.residence).then(
      resp => {
        console.log( resp);
       this.updateUser();
        this.loading.dismiss();
        //clear form data
      this.data.email = null;
      this.data.password = null;
      this.data.phone = null;
      this.data.firstName = null;
      this.data.lastName = null ;
      this.data.residence = null ;
      this.data.dob = null ;
      this.data.gender = null ;
      this.fireApi.hiddenTabs = true ;
        this.navigation.navigate(["tabs/tab1"]);
      },
      error => {
        this.presentToast(error.message);
        this.loading.dismiss();
      }
    );
  }
  //create user details in relatime db
updateUser(){
  let userID = localStorage.getItem('userID')
  this.fireApi
      .getUserDetails(userID)
      .snapshotChanges()
      .map(changes => {
        return changes.map(c => ({ key: c.payload.key, ...c.payload.val() }));
      })
      .subscribe(user => {
        let key = user[0].key;
        localStorage.setItem('userPhone', this.data.phone);
        localStorage.setItem('userEmail', this.data.email);
        localStorage.setItem('userName', this.data.firstName+''+this.data.lastName);
        this.fireApi.login(this.data.email,this.data.password)
        this.saveUser(this.data);
        this.fireApi.updateOperationUsers(key, this.data);
        this.presentToast("Information updated successfully");
        this.loading.dismiss();
      }, error => {
        this.loading.dismiss();
        this.presentToast(error.message);
      });
      
      
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
saveUser(data){
  if(data.email != null && data.phone != null && data.name != null){
  this.fs.collection('users').add({
    phone: data.phone,
    email: data.email,
    name: data.name,
    photo: 'https://bit.ly/2QtkoeS',
    gender: '',
    country: ''
  })
}
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

  back(){
    this.fireApi.hiddenTabs = false;
    this.location.back();
  }
}
