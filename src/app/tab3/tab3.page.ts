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
import { DatabaseService } from '../services/database.service';
import { Location } from '@angular/common';
import { Timestamp } from 'rxjs/Rx';



@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {
  videoPath = [];
  imagePath = [];
  likes = { "count": 0 };
  liked = false;
  h = false;
  Addcomment = false;
  text: string;
  hiddenHeader = false;
  searchTerm: string;


  //Status check 
  isUploading: boolean;
  isUploaded: boolean;

  // SHOW SEARCHBAR
  showSearch = false;
  Posts = [];
  UnfilteredPosts = [];
  count = '';
  currentTime: any;

  constructor(
    private navCtrl: Router,
    private modalCtrl: ModalController,
    private asC: ActionSheetController,
    private storage: AngularFireStorage,
    private database: AngularFirestore,
    private service: FirestoreService,
    private socialSharing: SocialSharing,
    private db: DatabaseService,
    private location: Location


  ) {
    this.isUploading = false;
    this.isUploaded = false;
    this.service.serviceNotice.subscribe(res => {
      this.count = res;
      console.log(this.count)
    });

  }
  back() {
    this.service.hiddenTabs = false;
    this.location.back();
  }
  onScroll(event) {
    if (event.detail.scrollTop == 0) {
      // this.service.hiddenTabs = true ;
      this.hiddenHeader = false;
      console.log("00000000")
    } else {
      if (event.detail.scrollTop > 30) {
        console.log(">>>> 30");
        // this.service.hiddenTabs = true ;
        this.hiddenHeader = true;
      } else {
        this.service.hiddenTabs = true;
      }
    }
  }

  ngOnInit(): void {
    this.db.getPosts().subscribe(res => {
      this.Posts = res;
      this.UnfilteredPosts = res;
      console.log('POSTS :', res)
    });

  }
  AddComment() {
    if (this.Addcomment == true) {
      this.Addcomment = false;
    } else {
      this.Addcomment = true;
    }
  }
  async whatsappshare() {


    //share via whatsapp
    let msg = "Kwik Shopping List ";
    let img = '../assets/images/icon.png';
    let url = 'https://weza-prosoft.com';
    this.socialSharing.shareViaWhatsApp(msg, null, url).then(() => {
      console.log("whatsapp share successful")
    }).catch(err => { console.log(err) });
  }


  async share() {
    const asc = await this.asC.create({
      animated: true,
      backdropDismiss: true,
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
  async comments() {
    const com = await this.modalCtrl.create({
      component: CommentsPage,
      componentProps: {}

    })
    await com.present();
  }
  like() {
    if (this.liked == false) {
      this.likes.count++;
      this.liked = true;
    } else {
      this.likes.count--;
      this.liked = false;
    }
    if (this.h == false) {
      this.h = true;
    } else {
      this.h = false;
    }

  }
  async infoModal(shop, logo) {
    const modal = await this.modalCtrl.create({
      component: InfomodalPage,
      componentProps: {
        'shopname': shop,
        'logo': logo
      }
    });
    modal.onDidDismiss().then(data => {
      console.log(data.data);
      this.service.shareShopBy(data.data[0]);
      this.service.changeData(data.data[1]);
    })

    //  modal.onDidDismiss((data)  => {
    //     
    //   }); 

    await modal.present();

  }
  async openPostModal() {
    const modal = await this.modalCtrl.create({
      component: PostmodalPage,
      componentProps: {}
    })
    await modal.present();
  }
  async postFile(url) {
    const modal = await this.modalCtrl.create({
      component: PostmodalPage,
      componentProps: { url }
    })
    await modal.present();
  }
  notifications() {
    this.navCtrl.navigate(['tabs/notifications']);
  }

  Post() {
    this.text = null;
  }
  searchShops() {
    this.Posts = this.filterShopPosts(this.searchTerm);
  }
  filterShopPosts(term) {
    return this.UnfilteredPosts.filter(item => {
      return item.shop.toLowerCase().indexOf(term.toLowerCase()) > -1;
    });
  }
  getTimePosted(timestamp: any) {
    this.currentTime = new Date();
    // console.log('today', this.currentTime);
    // console.log('timeposted', timestamp.toDate());
    const diffTime = Math.abs(this.currentTime - timestamp.toDate());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    console.log(diffTime + " milliseconds");
    console.log(diffDays + " days");
    // seconds
    if(diffTime/1000 > 60){
      let min = (diffTime/1000)/60
      if(min > 60){
        let hr = min/60 ;
        if(hr > 24){
          let days = hr/24 ;
          if(days > 30){
            let month = days/30;
            return this.float2int(month)+' '+'months'
          }else{
            return this.float2int(days)+' '+'days';
          }
        }else{
          return this.float2int(hr)+' '+'hours';
        }
      }else{
        return this.float2int(min)+' '+'Mins'
      }
    }else{
      return this.float2int(diffTime)+' '+'Secs'
    }
  }
float2int (value) {
    return value | 0;
}
  show() {
    if (this.showSearch == false) {
      this.showSearch = true;
    } else {
      this.showSearch = false;
    }
  }

  // DISPLAY IMAGE IN A MODEL
  showImage(image) {
    this.modalCtrl.create({
      component: ImageDisplayPage,
      componentProps: {
        url: image
      }
    }).then(modal => modal.present());

  }
}
