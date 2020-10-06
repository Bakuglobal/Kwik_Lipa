import { Component, OnInit, ViewChild } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { ModalController, IonContent, IonTextarea, ToastController } from '@ionic/angular';
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

  @ViewChild(IonContent, { static: true }) content: IonContent;
  @ViewChild(IonInfiniteScroll, { static: true }) infiniteScroll: IonInfiniteScroll;
  @ViewChild(IonTextarea, { static: true })
  public ionTextArea: IonTextarea;
  private focusFix = false;

  text: string;
  chatRef: any;
  uid: string;
  time: any;
  sendTo: any;
  phoneNumber = '';
  recepientId = '';
  lastChat = [];
  chats = [];
  mychat = [];
  msg = [];
  myNumber;
  Msgrecepient = false;
  recepient;
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
  notfound = false;



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
    this.myNumber = localStorage.getItem('Number');


  }

  createChat(item) {
    this.Msgrecepient = true;
    this.recepient = item.phone;
    this.sendTo = item.firstName;
    this.recepientId = item.id;

    this.checkPrevChat();


  }

  ngOnInit() {
    // this.getUsersAndIDs();
    this.setFilteredItems();
  }

  ionViewWillEnter() {




  }



  setFilteredItems() {
    // this.db.getUsersAndIDs()
    this.items = this.db.filterItems(this.searchTerm);
    if (this.searchTerm != null && this.items == null) {
      this.notfound = true;
    }
  }

  getUserProfile(id) {
    this.fireApi.getUserDetails(id)
      .valueChanges()
      .subscribe(user => {
        console.log("USER--" + user[0]);
        this.showData(user)
      });

  }
  showData(user) {
    this.user.phone = user[0].phone;
    this.user.name = user[0].name;
    this.user.email = user[0].email;
    this.user.gender = user[0].gender;
    this.user.country = user[0].country;
    this.user.email = user[0].email;
  }


  close() {
    this.chats.length = 0;
    this.docID.length = 0;
    this.mychat.length = 0;
    this.Msgrecepient = false;
    this.recepientId = '';
    this.lastChat = [];
    this.modalController.dismiss();
  }

  ScrollToBottom() {
  }
  retrieveMessages() {
    // this.fs.collection('Chats', ref => ref.orderBy('Date', 'asc')).ref.where('sender', '==', localStorage.getItem('userID'))
    this.fs.collection('Chats',
      ref => ref.where('sender', '==', localStorage.getItem('userID')).orderBy('Date', 'desc')
    ).snapshotChanges().subscribe(res => {
      console.log(res)
      this.chats = res

    })
  }

  async sendMessage() {
    // check if there is a message
    if (this.text.length > 0) {
      // send message
      let msg = {
        Date: new Date(),
        text: this.text,
        sendTo: this.recepientId,
        sender: localStorage.getItem('userID'),
      }
      // a chat exists
      if (this.lastChat.length > 0) {

        this.fs.collection('Chats').doc(this.lastChat[0].id).collection('replies').add(msg).then(res => {
          // update latest chat in home
          this.fs.collection('Chats').doc(this.lastChat[0].id).update(msg).then(res => {
            console.log('message sent!')
            this.toaster('Message sent successfully')
            this.close()
          }).catch(error=>{
            console.log(error)
          })

        })
          .catch(error => {
            console.log(error)
          })
      }
      // no chats so start new
      else {
        this.fs.collection('Chats').add(msg).then(res => {
          console.log('message sent!')
          console.log('res', res)
          this.fs.collection('Chats').doc(res.id).collection('replies').add(msg).then(res => {
            this.toaster('Message sent successfully')
            this.close()
          })
        }).catch(error => {
          console.log(error)
        })

          .catch(error => {
            console.log(error)
          })
      }
    }

    else {
      alert('Enter a message to send')
    }
  }
  checkPrevChat() {
    console.log('id', this.recepientId)
    this.fireApi.prevChatSender(this.recepientId).subscribe(res => {
      console.log('res', res)
      if (res.length > 0) {
        this.lastChat.push(res[0])
      }

    }, error => {
      console.log(error)
    })

    this.fireApi.prevChatSendTo(this.recepientId).subscribe(res => {
      console.log('res', res)
      if (res.length > 0) {
        this.lastChat.push(res[0])
      }
    }, error => {
      console.log(error)
    })
  }
  async toaster(msg) {
    const showToast = await this.toast.create({
      message: msg,
      duration: 1000,
      position: 'bottom'
    })
    await showToast.present()
  }


  pickContact() {
    this.contacts.pickContact().then(det => {
      // this.sendTo = det.name.givenName ;
      // this.phoneNumber = det.phoneNumbers[0].value.toString() ;
      this.searchTerm = det.phoneNumbers[0].value.toString();
    })
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
}
