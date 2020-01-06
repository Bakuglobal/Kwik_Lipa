import { Component, OnInit } from '@angular/core';
import { ModalController, ActionSheetController } from '@ionic/angular';
import { SokomodalPage } from '../sokomodal/sokomodal.page';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';

@Component({
  selector: 'app-infomodal',
  templateUrl: './infomodal.page.html',
  styleUrls: ['./infomodal.page.scss'],
})
export class InfomodalPage implements OnInit {
  likes = {"count":0}
  liked = false ;
  h     = false ;
  Addcomment = false ;
  constructor(
    private modalCtrl: ModalController,
    private iab: InAppBrowser,
    private asC: ActionSheetController

  ) { }

  ngOnInit() {
  }

  async share(){
    const asc = await this.asC.create({
      animated: true ,
      backdropDismiss: true ,
      cssClass: './home.page.scss',
      buttons: [{
        icon: 'logo-whatsapp',
        text: 'Whatsapp',
        
        handler: () => {
          
        }
      },
      
      {
        text: 'Cancel',
        role: 'cancel'
      }
    ]
    });
    await asc.present();
    
  }
  AddComment(){
    if(this.Addcomment == true){
      this.Addcomment = false;
    }else {
    this.Addcomment = true;
  }
  }
  like(){
    if(this.liked == false){
      this.likes.count++ ;
      this.liked = true ;
    }else {
      this.likes.count--;
      this.liked = false ;
    }
   if(this.h == false){
     this.h = true ;
   }else{
    this.h = false ;
   }
    
  }
  close(){
    this.modalCtrl.dismiss()
  }
  async maps(){
    const map = await this.modalCtrl.create({
      component: SokomodalPage,
      componentProps: {} 
    })
    await map.present();
  }
  inbrowser(link){
    console.log("Opens link in the app");
    const target = '_blank';
    // const options = { location : 'no' } ;
    const refLink = this.iab.create(link,target);
  }
 
}
