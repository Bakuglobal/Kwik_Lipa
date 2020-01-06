import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController} from '@ionic/angular'
import { ChatmodalPage} from '../chatmodal/chatmodal.page';
import { NewChatPage } from '../new-chat/new-chat.page';
import { AngularFirestore } from '@angular/fire/firestore';
import { FirestoreService } from '../services/firestore.service';
import { AngularFireAuth } from '@angular/fire/auth';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page implements OnInit{
  myChat= [] ;
  msg ;
  receivedMsg ;
  userID ;
  userPhone ;
  recepients = [] ;
  sender = [] ;
  header: boolean ;
  chats = [];
  load = true ;
  docID = [];
  user = {
    phone: null,
    name: null,
    email: null,
    country: null,
    gender: null
  };

    showLogin = false ;

    constructor(
      private navCtrl: Router ,
      private modalCtrl: ModalController,
      private fs: AngularFirestore,
      private service: FirestoreService,
      private fauth: AngularFireAuth
    ) {
            this.userID = localStorage.getItem('userID');
            
      }
      ngOnInit() {
        if(this.fauth.auth.currentUser ){
          //logged in
          this.showLogin = false;
        }else {
          this.showLogin = true;
        }
        this.userPhone = localStorage.getItem('userPhone')
        this.firstChatByMe();   
       
      }
      login(){
        this.navCtrl.navigate(['tabs/login']);
      }
      getUserProfile(id){
        this.service.getUserDetails(id)
        .snapshotChanges()
        .map(changes => {
          return changes.map(c => ({ key: c.payload.key, ...c.payload.val() }));
        })
        .subscribe(user => {
          console.log("USER--"+ user[0]);
          this.showData(user)
        });
       
      }
       showData(user){
          this.user.phone = user[0].phone;
          this.user.name = user[0].name;
          this.user.email = user[0].email;
          this.user.gender = user[0].gender;
          this.user.country = user[0].country;
          this.user.email = user[0].email;
        }
      
      
  
   
    //GET CHATS
    async firstChatByMe(){
      // gets the initial chat by me
      console.log(this.user.phone);
      await this.fs.collection('chats',ref=>ref.orderBy('Time','asc')).ref.where('Recepient_Number', '==','0795710540')
       .onSnapshot(querySnapshot => {
         querySnapshot.docChanges().forEach(change => {
           if (change.type === 'added') {
             console.log('New chat: ', change.doc.data());
              this.docID.push(change.doc.id)
              this.chats.push(change.doc.data())
              console.log(this.chats)
             
           } 
           if (change.type === 'modified') {
             console.log('Modified chat: ', change.doc.data());
            
           } 
           if (change.type === 'removed'){
             console.log('Removed chat: ', change.doc.data());
            //  this.chats.push(change.doc.data())
           }
         })
       });
       if(this.chats.length != 0)
       { 
        this.firstChatByHim()
       }
      }
     async  firstChatByHim(){
        // gets he initial chat by him
         this.fs.collection('chats',ref=>ref.orderBy('Time','asc')).ref.where('sender', '==', '0795710540')
         .onSnapshot(querySnapshot => {
           querySnapshot.docChanges().forEach(change => {
             if (change.type === 'added') {
               console.log('New chat: ', change.doc.data());
               this.docID.push(change.doc.id)
               this.chats.push(change.doc.data())
               console.log("mychat--"+this.chats)
               
             } 
             if (change.type === 'modified') {
               console.log('Modified chat: ', change.doc.data());
              
             } 
             if (change.type === 'removed'){
               console.log('Removed chat: ', change.doc.data());
               return change
             }
           })
         });
        }
    
   
  
   async chatModal(chat){
    const modal = await this.modalCtrl.create({
      component: ChatmodalPage,
      componentProps: {
        sendTo: chat.SendTo 
      }
    })
    await modal.present();
   }
   async newChatModal(){
    const modal = await this.modalCtrl.create({
      component: NewChatPage,
      componentProps: {}
    })
    await modal.present();
   }

   notifications(){
     this.navCtrl.navigate(['tabs/notifications']);
   }
  }
  

