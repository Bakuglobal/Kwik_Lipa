import { Component, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController, ActionSheetController } from '@ionic/angular';
import { PostmodalPage } from '../postmodal/postmodal.page';
// import { FilePath } from '@ionic-native/file-path/ngx';
// import { FileChooser } from '@ionic-native/file-chooser/ngx';
import { InfomodalPage } from '../infomodal/infomodal.page';
import { CommentsPage } from '../comments/comments.page';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
// import { MyData } from '../models/myData';
import { Observable } from 'rxjs';
import { finalize, tap } from 'rxjs/operators';
import { FirestoreService } from '../services/firestore.service';
// import { FileSizeFormatPipe } from './file-size-format.pipe';
import { SocialSharing } from '@ionic-native/social-sharing/ngx'
import { ImageDisplayPage } from '../image-display/image-display.page';



@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {
  videoPath = [];
  imagePath = [];
  likes = {"count": 0} ;
  liked = false ;
  h = false ;
  Addcomment = false ;
  text: string ;
  hiddenHeader = false ;

 
  //Status check 
  isUploading:boolean;
  isUploaded:boolean;
 
  // SHOW SEARCHBAR
  showSearch = false;


  constructor(
    private navCtrl: Router,
    private modalCtrl: ModalController,
    private asC: ActionSheetController,
    private storage: AngularFireStorage, 
    private database: AngularFirestore,
    private service: FirestoreService,
    private socialSharing: SocialSharing


  ) {
    this.isUploading = false;
    this.isUploaded = false;
    
  }

  onScroll(event){
    if(event.detail.scrollTop == 0){
      this.service.hiddenTabs = false ;
      this.hiddenHeader = false ;
      console.log("00000000")
    }else{
    if (event.detail.scrollTop > 30) {
      console.log(">>>> 30");
      this.service.hiddenTabs = true ;
      this.hiddenHeader = true ;
    } else {
      this.service.hiddenTabs = false ;
    }
  }
  }
  
  ngOnInit(): void {
    
  }
  AddComment(){
    if(this.Addcomment == true){
      this.Addcomment = false;
    }else {
    this.Addcomment = true;
  }
  }
  async whatsappshare(){


    //share via whatsapp
    let msg = "Kwik Shopping List ";
    let img = '../assets/images/icon.png' ;
    let url = 'https://weza-prosoft.com';
    this.socialSharing.shareViaWhatsApp(msg, null, url).then(()=>{
      console.log("whatsapp share successful")
    }).catch(err => {console.log(err)});
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
          this.whatsappshare()
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
  async comments(){
    const com = await this.modalCtrl.create({
      component: CommentsPage,
      componentProps: {}

    })
    await com.present();
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
  async infoModal(url){
    const modal = await this.modalCtrl.create({
      component: InfomodalPage,
      componentProps: {
        shopname: url
      }
    })
    await modal.present();
   }
  async openPostModal(){
    const modal = await this.modalCtrl.create({
      component: PostmodalPage,
      componentProps: {}
    })
    await modal.present();
   }
   async postFile(url){
    const modal = await this.modalCtrl.create({
      component: PostmodalPage,
      componentProps: {url}
    })
    await modal.present();
   }
   notifications(){
    this.navCtrl.navigate(['tabs/notifications']);
  }
 
  Post(){
    this.text = null ;
  }



  show(){
    if(this.showSearch == false){
      this.showSearch = true;
    }else{
      this.showSearch = false ;
    }
  }

// DISPLAY IMAGE IN A MODEL
  showImage(){
    this.modalCtrl.create({
        component: ImageDisplayPage,
        componentProps: {
            img: "maxwell"
        }
    }).then(modal => modal.present());

   }
}
