import { Component, OnInit } from "@angular/core";
import { FirestoreService } from "../services/firestore.service";
import { Router } from "@angular/router";
import { ToastController, LoadingController, MenuController } from "@ionic/angular";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as firebase from 'firebase/app';
import { AngularFirestore } from '@angular/fire/firestore';
import { Location } from '@angular/common';
import { User } from '../models/user';
import { AppComponent } from '../app.component';


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
    public registerForm: FormGroup;
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
    private app: AppComponent
  ) 
  {
    this.registerForm = formBuilder.group({
      firstName: ['', Validators.compose([Validators.maxLength(30), Validators.pattern('[a-zA-Z ]*'), Validators.required])],
      lastName: ['', Validators.compose([Validators.maxLength(30), Validators.pattern('[a-zA-Z ]*'), Validators.required])],
      email: ['',Validators.required],
      phone:['',Validators.required],
      gender:['',Validators.required],
      residence:['',Validators.required],
      wallet:['',Validators.required],
      password:['',Validators.required],
      confPassword:['',Validators.required],
      dob: ['',Validators.required],

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

//   async register() {
//     this.presentLoading();
//     this.fireApi.register(this.data.email, this.data.password , this.data.phone, this.data.firstName, this.data.lastName,this.data.gender,this.data.dob,this.data.residence)
//     .then(
//       resp => {
//         console.log( resp);
//         this.loading.dismiss();
//         //clear form data
//       // this.clear();
//         this.fireApi.hiddenTabs = true ;
//         this.navigation.navigate(["tabs/tab1"]);
//       },
//       error => {
//         this.presentToast(error.message);
//         this.loading.dismiss();
//       }
//     );
//   }
//   //create user details in relatime db
// updateUser(){
//   let userID = localStorage.getItem('userID')
//   this.fireApi
//       .getUserDetails(userID)
//       .snapshotChanges()
//       .map(changes => {
//         return changes.map(c => ({ key: c.payload.key, ...c.payload.val() }));
//       })
//       .subscribe(user => {
//         let key = user[0].key;
//         localStorage.setItem('userPhone', this.data.phone);
//         localStorage.setItem('userEmail', this.data.email);
//         localStorage.setItem('userName', this.data.firstName+''+this.data.lastName);
//         this.fireApi.login(this.data.email,this.data.password)
//         // this.saveUser(this.data);
//         this.fireApi.updateOperationUsers(key, this.data);
//         this.presentToast("Information updated successfully");
//         this.loading.dismiss();
//       }, error => {
//         this.loading.dismiss();
//         this.presentToast(error.message);
//       });
      
      
// }
 
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
}
