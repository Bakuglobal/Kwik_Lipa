import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router'
import { FirestoreService } from "../../services/firestore.service";

import "rxjs/Rx";
import { ToastController, LoadingController, AlertController } from "@ionic/angular";
import { DatabaseService } from 'src/app/services/database.service';
import { FormBuilder, Validators , FormGroup} from '@angular/forms';
import { AngularFirestore } from '@angular/fire/firestore';


@Component({
  selector: 'app-ipaytransmodal',
  templateUrl: './ipaytransmodal.page.html',
  styleUrls: ['./ipaytransmodal.page.scss'],
})
export class IpaytransmodalPage implements OnInit {

//variables
      user ;
      loading: any = null;
       userID: any = null;
       userForm : FormGroup;

  constructor(public navCtrl: Router,
          public fireApi: FirestoreService,
          public loadingController: LoadingController,
          public toastController: ToastController,
          public alertCtrl: AlertController,
          private db: DatabaseService,
          public formBuilder: FormBuilder,
          private fs: AngularFirestore
          ) 
          { 
            this.userForm = formBuilder.group({
              firstName: ['', Validators.compose([Validators.maxLength(30), Validators.pattern('[a-zA-Z ]*'), Validators.required])],
              // lastName: ['', Validators.compose([Validators.maxLength(30), Validators.pattern('[a-zA-Z ]*'), Validators.required])],
              email: ['',Validators.required],
              phone:['',Validators.required],
              gender:['',Validators.required],
              residence:['',Validators.required],
              // wallet:['',Validators.required],
              // password:['',Validators.required],
              // confPassword:['',Validators.required],
              dob: ['',Validators.required],
        
          });
          }

    ngOnInit() {
      this.user = this.db.getUser();
      console.log(this.user)
      this.userID = localStorage.getItem('UserID');
    }

 
  // 
    update(){
      this.presentLoading();
      let data = this.userForm.value ;
      this.fs.collection('users').doc(this.userID).update(data).then(
        res => {
          this.loading.dismiss();
          //toast update success
          this.presentToast('Update successful')
        }
      ).catch(err => {console.log(err)})
    }
  
  toMyAccount(){
    this.navCtrl.navigate(['tabs/settings']);
  }
   // Loader
   async presentLoading() {
    this.loading = await this.loadingController.create({
      message: "Wait ..."
    });
    return await this.loading.present();
  }

  // Toaster message
  async presentToast(data) {
    const toast = await this.toastController.create({
      message: data,
      duration: 3000,
      position: 'bottom',
    });
    toast.present();
  }
}
