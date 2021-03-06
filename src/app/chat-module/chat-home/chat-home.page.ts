import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController} from '@ionic/angular';
import { ResumeChatPage} from 'src/app/chat-module/resume-chat/resume-chat.page';
import { NewChatPage } from 'src/app/chat-module/new-chat/new-chat.page';
import { AngularFirestore } from '@angular/fire/firestore';
import { FirestoreService } from 'src/app/services/firestore.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { DatabaseService } from 'src/app/services/database.service';
import { AvatarService } from 'src/app/services/avatar.service';

@Component({
  selector: 'app-chat-home',
  templateUrl: './chat-home.page.html',
  styleUrls: ['./chat-home.page.scss'],
})
export class ChatHomePage implements OnInit {

  mychat= [] ;
  chatTome  = [];
  msg ;
  receivedMsg ;
  loader = true ;
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
      private fauth: AngularFireAuth,
      private db: DatabaseService,
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
        // this.newChatModal(); 
       
      }

      login(){
        this.navCtrl.navigate(['tabs/login']);
      }

  ionViewWillEnter() {
    if (this.fauth.auth.currentUser) {
      //logged in
      this.showLogin = false;
    } else {
      this.showLogin = true;
    }
    this.userPhone = localStorage.getItem('userPhone')
    this.retrieveMessages();
    // this.newChatModal();

  }
  
      
       showData(user){
          this.user.phone = user[0].phone;
          this.user.name = user[0].name;
          this.user.email = user[0].email;
          this.user.gender = user[0].gender;
          this.user.country = user[0].country;
          this.user.email = user[0].email;
        }
      
      
  
retrieveMessages() {
   
  this.service.retrieveMessages().subscribe(res => {
      this.chats = res ;
      console.log(this.chats);
      if(this.chats.length === 0){
        this.loader = false ;
      }
        this.chats.forEach(user=>{
          this.getUserName(user)
         })
    })
    this.service.retrieveMessagesToMe().subscribe(res => {
      console.log('res', res);
      this.chatTome = res ;
      if(this.chatTome.length === 0){
        this.loader = false ;
      }
      this.chatTome.forEach(user=>{
        this.getSenderName(user)
      })

    })
  }

  getUserName(user){
    console.log('user',user);
    this.db.getName(user.sendTo).valueChanges().subscribe(res=>{
      let name = res.firstName
      console.log('name', name)
      let index = this.chats.indexOf(user);
      console.log(index);
      console.log(this.chats[index]);
      if(index < 0){
        index  = index * -1 ;
        console.log(index);
        this.chats[index].firstName=name ;
        this.loader = false;
      }else{
        this.loader = false;
        this.chats[index].firstName=name ;
      }
    })
  }

  getSenderName(user){
    let id = user.id ;
    console.log('id =>',id);
    this.db.getName(user.sender).valueChanges().subscribe(res=>{
      let name = res.firstName
      console.log('name', name);
      let index = this.chatTome.indexOf(user) ;
      if(index < 0){
        index  = index * -1 ;
        this.chatTome[index].firstName=name ;
        // check if a chat with same id exists
        let chatCheck = this.filterChats(id);
        if(chatCheck.length > 0){
          let index2 = this.chats.indexOf(chatCheck[0]);
          this.chats[index2]=this.chatTome[index];
        }
        
        // this.chats.push(this.chatTome[index]);
        this.loader = false;
      }else{
        this.loader = false;
         // check if a chat with same id exists
         let chatCheck = this.filterChats(id);
         if(chatCheck.length > 0){
           let index2 = this.chats.indexOf(chatCheck[0]);
           this.chats[index2]=this.chatTome[index];
         }
        // this.chatTome[index].firstName=name;
        this.chats.push(this.chatTome[index]);
      }
    })
  }
  filterChats(id){
    return this.chats.filter(item => {
      return item.id.toLowerCase().indexOf(id.toLowerCase()) > -1;
    })
  }


  //GET CHATS
  async firstChatByMe() {
    // gets the initial chat by me
    console.log(this.user.phone);
    await this.fs.collection('chats', ref => ref.orderBy('Date', 'asc')).ref.where('sendTo', '==', this.userPhone)
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
          if (change.type === 'removed') {
            console.log('Removed chat: ', change.doc.data());
            //  this.chats.push(change.doc.data())
          }
        })
      });
    if (this.chats.length != 0) {
      this.firstChatByHim()
    }
  }
  async firstChatByHim() {
    // gets the initial chat by him
    this.fs.collection('chats', ref => ref.orderBy('Date', 'asc')).ref.where('sender', '==', localStorage.getItem('userID'))
      .onSnapshot(querySnapshot => {
        querySnapshot.docChanges().forEach(change => {
          if (change.type === 'added') {
            console.log('New chat: ', change.doc.data());
            this.docID.push(change.doc.id)
            this.chats.push(change.doc.data())
            console.log("mychat--" + this.chats)

          }
          if (change.type === 'modified') {
            console.log('Modified chat: ', change.doc.data());

          }
          if (change.type === 'removed') {
            console.log('Removed chat: ', change.doc.data());
            return change
          }
        })
      });
  }
    
   // generate profile image with initials
   AvatarImage(letters, size) {
    var canvas = document.createElement('canvas');
    var context = canvas.getContext("2d");
    var size = size || 60;
 
    // Generate a random color every time function is called
    var color =  "#" + (Math.random() * 0xFFFFFF << 0).toString(16);
 
    // Set canvas with & height
    canvas.width = size;
    canvas.height = size;
 
    // Select a font family to support different language characters
    // like Arial
    context.font = Math.round(canvas.width / 2) + "px Arial";
    context.textAlign = "center";
 
    // Setup background and front color
    context.fillStyle = color;
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = "#FFF";
    context.fillText(letters, size / 2, size / 1.5);
 
    // Set image representation in default format (png)
    const dataURI = canvas.toDataURL();
 
    // Dispose canvas element
    canvas = null;
 
    return dataURI;
  }
   
  
   async chatModal(chat){
    const modal = await this.modalCtrl.create({
      component: ResumeChatPage,
      componentProps: chat
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