import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { ModalController, IonContent } from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';

@Component({
  selector: 'app-chatmodal',
  templateUrl: './chatmodal.page.html',
  styleUrls: ['./chatmodal.page.scss'],
})
export class ChatmodalPage implements OnInit {

  //passed data via inputs

      @Input() sendTo : any ;

  //variables

      text: string ;
      chatRef: any ;
      uid: string ;
      time: any ;

  //objects


  constructor(
    private fauth: AngularFireAuth,
    private fs: AngularFirestore,
    private navCtrl: Router,
    private modalController: ModalController
  ) { 
    this.uid = localStorage.getItem('userID');
    this.chatRef = this.fs.collection('chats',ref=>ref.orderBy('Time','asc')).valueChanges();

  }

  close(){
    this.modalController.dismiss();
  }
  ngOnInit() {
  }
  
  
//send message

      send(){
        if( this.text != ''){
          if(this.sendTo == ''){
            alert("Please add a recepient of this message");
          }else{
              this.time = new Date() ;
              this.fs.collection('chats').add({
                Name: this.fauth.auth.currentUser.displayName,
                Message: this.text,
                UserID: this.fauth.auth.currentUser.uid,
                Time: this.time,
                SendTo: this.sendTo
              });
              this.text = '' ;
            }
        }
      }
}
