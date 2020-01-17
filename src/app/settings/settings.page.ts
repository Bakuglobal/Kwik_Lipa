import { Component, OnInit } from "@angular/core";
import { FirestoreService } from "../services/firestore.service";
// import { User } from "../models/user";
import "rxjs/Rx";
import { Observable } from "rxjs/Rx";
import { User } from "../models/user";
import { ToastController, LoadingController, AlertController } from "@ionic/angular";
import { Router } from "@angular/router";
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: "app-settings",
  templateUrl: "./settings.page.html",
  styleUrls: ["./settings.page.scss"]
})
export class SettingsPage implements OnInit {
  

  User: User ;

  settingsPassword = {
    newPassword: ""
  };

  passsData = {
    oldpassword: ""
  };

  settingsEmail = {
    email: null
  };

  loading: any = null;

  userID: any = null;

  btn: any = "UPDATE";
  todaysdate ;

  constructor(
    public fireApi: FirestoreService,
    public loadingController: LoadingController,
    public toastController: ToastController,
    public alertCtrl: AlertController,
    public navCtrl: Router,
    public database: AngularFirestore
  ) 
  { 
    this.userID = localStorage.getItem('userID');
    this.getUser(this.userID);
  }

  ngOnInit() {
   
    this.getDate();
  }

  // get date
  getDate(){
    this.todaysdate = new Date().getTime();
  }

  getUser(id){
    this.database.collection('users').doc(id).valueChanges().subscribe(res =>{
      this.User = res ;
    })
  }
  // async getUser() {
  //   let user = await this.fireApi.getCurrentUser();
  //   await this.fireApi
  //     .getUserDetails(user.uid)
  //     .snapshotChanges()
  //     .map(changes => {
  //       return changes.map(c => ({ key: c.payload.key, ...c.payload.val() }));
  //     })
  //     .subscribe(usr => {
  //       console.log(usr);
  //       this.showData(usr);
  //     });
  // }

  // showData(user) {
  //   this.settings.phone = user[0].phone;
  //   this.settings.name = user[0].name;
  //   this.settings.email = user[0].email;
  //   this.settings.gender = user[0].gender;
  //   this.settings.country = user[0].country;
  //   this.settingsEmail.email = user[0].email;
  // }
  
 
editPersonalDetails(){
  this.navCtrl.navigate(['ipaytransmodal']);
}




  async submit(oldpassword) {

    this.presentLoading();
    let user = await this.fireApi.getCurrentUser();

    // Save user information

    // Change Email 
    // this.fireApi.updateUserEmail(this.settingsEmail.email, this.settings.email, oldpassword).then(data => {
    //   this.fireApi
    //   .getUserDetails(user.uid)
    //   .snapshotChanges()
    //   .map(changes => {
    //     return changes.map(c => ({ key: c.payload.key, ...c.payload.val() }));
    //   })
    //   .subscribe(user => {
    //     let key = user[0].key;
    //     this.settings.email = this.settingsEmail.email;
    //     this.fireApi.updateOperationUsers(key, this.settings);
    //     this.presentToast("Information updated successfully");
    //     this.loading.dismiss();
    //   }, error => {
    //     this.loading.dismiss();
    //     this.presentToast(error.message);
    //   });
    //   this.loading.dismiss();
    //   this.presentToast(data);
    // }, error => {
    //   this.loading.dismiss();
    //   this.presentToast(error.message)
    // });

    // Change password
    if (
      this.settingsPassword.newPassword != "" &&
      oldpassword != ""
    ) {
      this.fireApi.updatePassword(
        this.settingsPassword.newPassword,
        this.settingsEmail.email,
        this.passsData.oldpassword
      ).then(data => {
        this.loading.dismiss();
        this.presentToast(data);
      }, error => {
        this.loading.dismiss();
        this.presentToast(error.message)
      });
    }

    this.settingsPassword = {
      newPassword: ""
    };


  }


  async presentPrompt() {
    let alert = await this.alertCtrl.create({
      subHeader: "Your current password",
      inputs: [
        {
          name: 'password',
          placeholder: 'Password',
          type: 'password'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Continue',
          handler: data => {
            this.submit(data.password);
          }
        }
      ]
    });
    alert.present();
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
}
