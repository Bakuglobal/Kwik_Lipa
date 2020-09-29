import { Component, OnInit, ViewChild } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { ModalController , IonContent, IonTextarea, ToastController} from '@ionic/angular';
import { Contacts, ContactFieldType, ContactFindOptions } from '@ionic-native/contacts/ngx';
import { IonInfiniteScroll } from '@ionic/angular';
import { AngularFireDatabase } from '@angular/fire/database';
import { DatabaseService } from 'src/app/services/database.service';
import { FormControl } from "@angular/forms";
import { FirestoreService } from 'src/app/services/firestore.service';
import { User } from 'src/app/models/user';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-new-chat',
  templateUrl: './new-chat.page.html',
  styleUrls: ['./new-chat.page.scss'],
})
export class NewChatPage implements OnInit {

  @ViewChild(IonContent, {static:true}) content: IonContent;
  @ViewChild(IonInfiniteScroll , {static:true}) infiniteScroll: IonInfiniteScroll;
  @ViewChild(IonTextarea , {static:true})
  public ionTextArea: IonTextarea;
  private focusFix = false;
  
  text: string ;
  chatRef: any ;
  uid: string ;
  time: any ;
  sendTo: any ;
  phoneNumber = '' ;
  chats = [];
  mychat = [];
  msg=[];
  myNumber ;
  Msgrecepient = false;
  recepient ;
  user = {
    phone: null,
    name: null,
    email: null,
    country: null,
    gender: null
  };


  searchTerm: string = '';
  items = [];
  searching: any = false;
  docID = []
  notfound = false ;


  
  constructor(
    private fauth: AngularFireAuth,
    private fs: AngularFirestore,
    private navCtrl: Router,
    private modalController: ModalController,
    public contacts: Contacts,
    public fb: AngularFireDatabase,
    public db: DatabaseService,
    public fireApi: FirestoreService,
    private toast: ToastController
  ) {
    this.uid = localStorage.getItem('userID');
    // this.chatRef = this.fs.collection('chats',ref=>ref.orderBy('Date','asc')).valueChanges();
    // get my phone number from local storage
     this.myNumber = localStorage.getItem('userPhone');
     

   }

 createChat(item){
   this.Msgrecepient = true ;
   this.recepient = item.phone ;
   this.sendTo = item.name
   this.phoneNumber = item.phone ;
  
   
  
   
 }

ngOnInit() {
  // this.getUsersAndIDs();
  this.setFilteredItems();
}

  ionViewWillEnter() {

    // this.getUsersAndIDs()

  }

  

setFilteredItems() {
  // this.db.getUsersAndIDs()
  this.items = this.db.filterItems(this.searchTerm);
  if(this.searchTerm != null && this.items == null){
    this.notfound = true ;
  }
}

getUserProfile(id){
  this.fireApi.getUserDetails(id)
  .valueChanges()
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
      // async firstChatByMe(){
      //   // gets the initial chat by me
      //    this.fs.collection('chats',ref=>ref.orderBy('Date','asc')).ref.where('sendTo', '==',this.phoneNumber)
      //    .onSnapshot(querySnapshot => {
      //      querySnapshot.docChanges().forEach(change => {
      //        if (change.type === 'added') {
      //          console.log('New chat: ', change.doc.data());
      //           this.docID.push(change.doc.id)
      //           this.chats.push(change.doc.data())
      //           console.log(this.chats)
               
      //        } 
      //        if (change.type === 'modified') {
      //          console.log('Modified chat: ', change.doc.data());
              
      //        } 
      //        if (change.type === 'removed'){
      //          console.log('Removed chat: ', change.doc.data());
      //         //  this.chats.push(change.doc.data())
      //        }
      //      })
      //    });
      //    if(this.chats.length != 0)
      //    { 
      //     this.firstChatByHim()
      //    }
      //   }
      //  async  firstChatByHim(){
      //     // gets the initial chat by him
      //    this.fs.collection('chats', ref => ref.orderBy('Date', 'asc')).ref.where('sender', '==', localStorage.getItem('userID'))
      //      .onSnapshot(querySnapshot => {
      //        querySnapshot.docChanges().forEach(change => {
      //          if (change.type === 'added') {
      //            console.log('New chat: ', change.doc.data());
      //            this.docID.push(change.doc.id)
      //            this.mychat.push(change.doc.data())
      //            console.log("mychat--"+this.mychat)
                 
      //          } 
      //          if (change.type === 'modified') {
      //            console.log('Modified chat: ', change.doc.data());
                
      //          } 
      //          if (change.type === 'removed'){
      //            console.log('Removed chat: ', change.doc.data());
      //            return change
      //          }
      //        })
      //      });
      //     }
      //     //get replies
      //    async getMyReplies(){
      //       let id =  this.docID[0];
      //       this.fs.collection('replies',ref=>ref.orderBy('Date','desc')).ref.where('chatID', '==', id)
      //     .onSnapshot(querySnapshot => {
      //       querySnapshot.docChanges().forEach(change => {
      //         if (change.type === 'added') {
      //           console.log('New chat: ', change.doc.data());
      //           if(change.doc.data().sendTo != this.phoneNumber){
      //             this.mychat.push(change.doc.data())
      //           }else{
      //             this.chats.push(change.doc.data())
      //           }
                            
      //         } 
      //         if (change.type === 'modified') {
      //           console.log('Modified chat: ', change.doc.data());
              
      //         } 
      //         if (change.type === 'removed'){
      //           console.log('Removed chat: ', change.doc.data());
      //           return change ;
      //         }
      //       })
      //     });
      //     }
        
  
  close(){
    this.chats.length = 0;
    this.docID.length = 0;
    this.mychat.length = 0;
    this.Msgrecepient = false ;
    this.modalController.dismiss();
  }
 
  ScrollToBottom(){
  }
  retrieveMessages(){
    // this.fs.collection('Chats', ref => ref.orderBy('Date', 'asc')).ref.where('sender', '==', localStorage.getItem('userID'))
      this.fs.collection('Chats', 
      ref=>ref.where('sender','==', localStorage.getItem('userID')).orderBy('Date', 'desc')
      ).snapshotChanges().subscribe(res=>{
        console.log(res)
        this.chats=res
        
      })
  }

  sendMessage(){
    // check if there is a message
    if (this.text.length > 0){
      // send message
      let msg = {
        Date: new Date(),
        text: this.text,
        sendTo:this.phoneNumber ,
        sender: localStorage.getItem('userID'),
      }

      this.fs.collection('Chats').add(msg).then(res=>
        {console.log('message sent!')
        this.toaster('Message sent successfully')
        this.close()})
        .catch(error=>{
        console.log(error)
      })
      
    }

    else{
      alert('Enter a message to send')
    }
  }

async toaster(msg){
 const showToast=await this.toast.create({
   message: msg, 
   duration: 1000,
   position: 'bottom'
 })
 await showToast.present()
}

// send(){
//   this.getUserProfile(this.fauth.auth.currentUser.uid);
//   if( this.text != undefined && this.text != '' && this.user.phone != null){
//     this.time = new Date() ;
//     if(this.docID.length == 0){
//         this.fs.collection('chats').add({
//           sender: this.user.phone ,
//           senderName: this.user.name,
//           text: this.text,
//           Recepient_Number: this.phoneNumber,
//           Recepient_Name: this.sendTo,
//           Time: new Date(),
          
//         });
//     this.text = '';
//     if(this.chats.length > 0){ this.getMyReplies();}
    
//   }else{
//     let id = this.docID[0]
//     this.fs.collection('replies').add({
//       chatID: id,
//       sender: this.user.phone,
//       senderName: this.user.name,
//       text: this.text,
//       Recepient_Number: this.phoneNumber,
//       Recepient_Name: this.sendTo,
//       Time: this.time,
//     })
//     this.text = '';
//     if(this.chats.length > 0){ this.getMyReplies();}
//   }
  
    // this.getChats();
  // }
  
//   else{
//     alert("Please enter message")
// }
// }

  pickContact(){
    this.contacts.pickContact().then( det => {
      // this.sendTo = det.name.givenName ;
      // this.phoneNumber = det.phoneNumbers[0].value.toString() ;
      this.searchTerm = det.phoneNumbers[0].value.toString() ;
    })
  }
}
