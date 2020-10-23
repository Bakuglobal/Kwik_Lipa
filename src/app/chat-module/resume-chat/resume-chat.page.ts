import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { ModalController, IonContent } from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { FirestoreService } from 'src/app/services/firestore.service';
import { Chat } from 'src/app/models/chat';
import { DatabaseService } from 'src/app/services/database.service';

@Component({
  selector: 'app-resume-chat',
  templateUrl: './resume-chat.page.html',
  styleUrls: ['./resume-chat.page.scss'],
})
export class ResumeChatPage implements OnInit {

  //passed data via inputs

  @Input() sendTo: any;
  @Input() id: any;
  @Input() text: any;
  @Input() Date: any;
  @Input() sender: any;

  //variables

  inputText: string;
  chats = [];
  uid: string;
  time: any;
  recepient:any;

  //objects


  constructor(
    private fauth: AngularFireAuth,
    private fs: AngularFirestore,
    private navCtrl: Router,
    private modalController: ModalController,
    private fireApi: FirestoreService,
    private db: DatabaseService,

  ) {
    this.uid = localStorage.getItem('userID');


  }

  close() {
    this.modalController.dismiss();
  }
  ngOnInit() {
    this.getReplies();
    // this.send()
    this.fireApi.getUserProfile(this.sendTo).valueChanges().subscribe(res => {
      this.recepient = res
    })
  }

  getReplies() {
    this.db.getReplies(this.id).subscribe(res => {
      console.log(res)
      this.chats = res
    })
  }
  //send message
  send() {
    if (this.text != '') {
      if (this.sendTo == '') {
        alert("Please add a recepient of this message");
      } else {
        this.time = new Date();
        let msg = {
          text: this.inputText,
          sender: this.fauth.auth.currentUser.uid,
          Date: new Date(),
          SendTo: this.sendTo
        }
        this.fs.collection('Chats').doc(this.id).collection('replies').add(msg).then(res => {
          this.inputText = '';
          this.fs.collection('Chats').doc(this.id).update(msg).then(res => {
            console.log('message sent!')
          }).catch(error => {
            console.log(error)
          })
        });

      }
    }
  }
  // generate profile image with initials
  AvatarImage(letters, size) {
    var canvas = document.createElement('canvas');
    var context = canvas.getContext("2d");
    var size = size || 60;

    // Generate a random color every time function is called
    var color = "#" + (Math.random() * 0xFFFFFF << 0).toString(16);

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
