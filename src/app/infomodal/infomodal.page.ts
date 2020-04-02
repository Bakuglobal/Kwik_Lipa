import { Component, OnInit, Input } from '@angular/core';
import { ModalController, ActionSheetController } from '@ionic/angular';
import { SokomodalPage } from '../sokomodal/sokomodal.page';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import {  AngularFirestore } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';
import { Shops } from '../models/shops';
import { Post } from '../models/post';
import { Router } from '@angular/router';
import { ThrowStmt } from '@angular/compiler';
@Component({
  selector: 'app-infomodal',
  templateUrl: './infomodal.page.html',
  styleUrls: ['./infomodal.page.scss'],
})
export class InfomodalPage implements OnInit {
  @Input('shopname')shopname:string ;
  @Input('logo')logo:string;
  shop: Shops;
  Posts;
    //variables
      liked = false ;
      h     = false ;
      Addcomment = false ;
      showSearch = false ;
  //objects
      likes = {"count":0}

  
  constructor(
    private modalCtrl: ModalController,
    private iab: InAppBrowser,
    private asC: ActionSheetController,
    private fs: AngularFirestore,
    private navCtrl: Router

  ) { 
    console.log(this.logo);
  }

  ngOnInit() {
    this.getShop();
  }
  scanAndPay() {
    this.modalCtrl.dismiss(["scan",this.shopname]);
    this.navCtrl.navigate(['tabs/shop']);
  }
  pickPayCollect() {
    this.modalCtrl.dismiss(["pick",this.shopname]);
    this.navCtrl.navigate(['tabs/offers']);
  }
  // goto shoppinglist page
  Delivery() {
    this.modalCtrl.dismiss(["delivery",this.shopname]);
    this.navCtrl.navigate(['tabs/offers']);
  }
//share via whatsapp
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
//add a comment
      AddComment(){
        if(this.Addcomment == true){
          this.Addcomment = false;
        }else {
        this.Addcomment = true;
      }
      }
// like posts
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
//close the modal

      close(){
        this.modalCtrl.dismiss()
      }
//go to maps to see location of the shop

      async maps(){
        const map = await this.modalCtrl.create({
          component: SokomodalPage,
          componentProps: {'shoplocation':this.shop.Location} 
        });
        console.log('location',this.shop.Location);
        await map.present();
      }
//open a link in a browser inside the app

      inbrowser(link){
        console.log("Opens link in the app");
        const target = '_blank';
        // const options = { location : 'no' } ;
        this.iab.create(link,target);
      }
      show(){

      }
      infoModal(shop,logo){

      }
      showImage(){

      }
      comments(){

      }
      // get shop details
      getShop(){
       let data = this.fs.collection<Shops>('shops',ref => {
         return  ref.where('shop','==',this.shopname)
        });
         let snap = data.snapshotChanges().pipe(
          map(actions => {
            return actions.map(a => {
              const data = a.payload.doc.data();
              const id = a.payload.doc.id ;
              return { id, ... data};
            });
          })
        );
        snap.subscribe(res => {
          this.shop = res[0];
          console.log('shop details', this.shop);
        });
        this.getPosts();
      }
      getPosts(){
        let posts = this.fs.collection<Post>('posts',ref => {
          return ref.where('shop','==',this.shopname).orderBy('time','desc')
        })
        let fd = posts.snapshotChanges().pipe(
          map(actions => {
            return actions.map(a => {
              const id = a.payload.doc.id ;
              const data = a.payload.doc.data();
              return {id, ... data}
            });
          })
        );
        fd.subscribe(res => {
          this.Posts = res ;
          console.log(this.Posts);
        })
      }
     
    
}
