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

 
  //Status check 
  isUploading:boolean;
  isUploaded:boolean;
 
  
  constructor(
    private navCtrl: Router,
    private modalCtrl: ModalController,
    // private fileChooser: FileChooser,
    // private filePath: FilePath,
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
      console.log("00000000")
    }else{
    if (event.detail.scrollTop > 30) {
      console.log(">>>> 30");
      this.service.hiddenTabs = true ;
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
    // document.post.text.focus();
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
    // this.share = false ;
}
  // uploadFile(event: FileList) {
    
 
  //   // The File object
  //   const file = event.item(0)
 
  //   // Validation for Images Only
  //   if (file.type.split('/')[0] !== 'image') { 
  //    console.error('unsupported file type :( ')
  //    return;
  //   }
 
  //   this.isUploading = true;
  //   this.isUploaded = false;
 
 
  //   this.fileName = file.name;
 
  //   // The storage path
  //   const path = `posts/${new Date().getTime()}_${file.name}`;
 
  //   // Totally optional metadata
  //   const customMetadata = { app: 'Image Upload ' };
 
  //   //File reference
  //   const fileRef = this.storage.ref(path);
 
  //   // The main task
  //   this.task = this.storage.upload(path, file, { customMetadata });
 
  //   // Get file progress percentage
  //   this.percentage = this.task.percentageChanges();
  //   this.snapshot = this.task.snapshotChanges().pipe(
      
  //     finalize(() => {
  //       // Get uploaded file storage path
  //       this.UploadedFileURL = fileRef.getDownloadURL();
        
  //       this.UploadedFileURL.subscribe(resp=>{
  //         // this.addImagetoDB({
  //         //   name: file.name,
  //         //   filepath: resp,
  //         //   size: this.fileSize
  //         // });
  //         this.isUploading = false;
  //         this.isUploaded = true;
  //       },error=>{
  //         console.error(error);
  //       })
  //     }),
  //     tap(snap => {
  //         this.fileSize = snap.totalBytes;
  //     })
  //   )
  // }
  // addImagetoDB(image: MyData) {
  //   //Create an ID for document
  //   const id = this.database.createId();
 
  //   //Set document id with value in database
  //   this.imageCollection.doc(id).set(image).then(resp => {
  //     console.log(resp);
  //   }).catch(error => {
  //     console.log("error " + error);
  //   });
  // }

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
  //  pickFile(){
  //   this.fileChooser.open().then(uri => {
  //     this.filePath.resolveNativePath(uri).then(resolvedURI => {
  //       let ext = resolvedURI.slice(-3)
  //       let ext2 = resolvedURI.slice(-4)
  //       if(ext == 'mkv' || ext == 'flv'||ext == 'vob'||ext == 'mp4'||ext == 'svi'||ext == '3gp'||ext == '3g2' )
  //       {
  //         this.videoPath.push(resolvedURI)
  //       }
  //       if(ext2 == 'webm' || ext == 'M2TS'|| ext == 'gif2'||ext == 'rmvb')
  //       {
  //         this.videoPath.push(resolvedURI)
  //       }
  //       if(ext == 'png' || ext == 'jpg'|| ext == 'gif'||ext == 'tif' )
  //       {
  //         this.imagePath.push(resolvedURI)
  //       }
  //       if(ext2 == 'jpeg' )
  //       {
  //         this.imagePath.push(resolvedURI)
  //       }
  //       this.postFile(resolvedURI);
        
  //     }).catch(err =>{console.log(err)});
  //   }).catch(err =>{console.log(err)});
  // }
  Post(){
    this.text = null ;
  }
}
