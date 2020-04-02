import { Component, OnInit } from "@angular/core";
import { FirestoreService } from "../services/firestore.service";
import { Router } from "@angular/router";
import { ToastController, LoadingController, MenuController } from "@ionic/angular";
import { FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';
import * as firebase from 'firebase/app';
import { AngularFirestore } from '@angular/fire/firestore';
import { Location } from '@angular/common';
import { User } from '../models/user';
import { AppComponent } from '../app.component';
import { InAppBrowser, InAppBrowserOptions } from '@ionic-native/in-app-browser/ngx';
import { from } from 'rxjs';
import { OneSignalService } from '../OneSignal/one-signal.service';


@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  //variables
    loading: any;
    verify = false ;
    code = false ;
    passwordType: string = 'password';
    passwordIcon: string = 'eye-off';
    provider ;
    place: any;
    residence: Object;
    public registerForm: FormGroup;
    privacypolicy = 'https://bit.ly/38fS2dI' ;
  //objects
    data: User ;

   

  
  constructor(
    public fireApi: FirestoreService,
    public navigation: Router,
    public loadingController: LoadingController,
    public toastController: ToastController,
    public location : Location,
    public formBuilder: FormBuilder,
    public menuCtrl: MenuController,
    private fs: AngularFirestore,
    private app: AppComponent,
    private inappBrowser: InAppBrowser,
    private notice: OneSignalService

  ) 
  {
    this.registerForm = formBuilder.group({
      firstName: ['', Validators.compose([Validators.maxLength(30), Validators.pattern('[a-zA-Z ]*'), Validators.required])],
      lastName: ['', Validators.compose([Validators.maxLength(30), Validators.pattern('[a-zA-Z ]*'), Validators.required])],
      email: ['',Validators.required],
      phone:['',Validators.required],
      gender:['',Validators.required],
      residence:['',Validators.required],
      // wallet:['',Validators.required],
      password:['',Validators.required],
      confPassword:['',Validators.required],
      dob: ['',Validators.required],
      privacyPolicy:['',Validators.required]

  });
  }

  ngOnInit() {
    this.fireApi.hiddenTabs = true ;
  }
  
  
 sendCode(){
   this.code = true ;
 }
  
  hideShowPassword() {
    this.passwordType = this.passwordType === 'text' ? 'password' : 'text';
    this.passwordIcon = this.passwordIcon === 'eye-off' ? 'eye' : 'eye-off';
}
  

login(){
  this.navigation.navigate(['tabs/login'])
}
register(){
  this.presentLoading();
  this.data = this.registerForm.value;
  console.log(this.data)
  this.fireApi.register(this.data.email,this.data.password).then(res => {
    localStorage.setItem('userID',res.user.uid);
    this.fireApi.createUserProfile(this.data,res.user.uid).then(succ => {
      this.clear();
      this.app.getDetails(res.user.uid);
      this.notice.sendTokenToFirebase(res.user.uid);
      this.loading.dismiss();
      this.navigation.navigate(["tabs/tab1"]);
    }).catch(
      err => {
        this.loading.dismiss();
        console.log(err) 
      })
  }).catch(error => {
    this.loading.dismiss();
    console.error(error) 
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
  //Clear data
  clear(){
      this.data.email = null;
      this.data.password = null;
      this.data.phone = null;
      this.data.firstName = null;
      this.data.lastName = null ;
      this.data.residence = null ;
      this.data.dob = null ;
      this.data.gender = null ;
  }

  back(){
    this.fireApi.hiddenTabs = false;
    this.location.back();
  }
  getResidence(){
    let key = 'AIzaSyAcLMPO6PkIEoOuLJJ86Y_vjxqTCi7ZcvE' ;
    this.fireApi.getPlace(this.place,key)
    .subscribe(res => {
      this.residence = res ;
      alert(JSON.stringify(res));
    },err => console.log(err));
  }
  privacy(){
    const options : InAppBrowserOptions =  {
      zoom: 'no'
    }
    this.inappBrowser.create(this.privacypolicy,'_self',options);
    
  }
  
}
