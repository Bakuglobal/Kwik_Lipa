import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { ModalController, IonContent } from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';

@Component({
  selector: 'app-resume-chat',
  templateUrl: './resume-chat.page.html',
  styleUrls: ['./resume-chat.page.scss'],
})
export class ResumeChatPage implements OnInit {

   //passed data via inputs

  @Input() sendTo : any ;
  @Input() id: any;
  @Input() text: any;
  @Input() Date: any;
  @Input() sender: any;

  //variables

      inputText: string ;
      chats = [];
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
    // this.chats = this.fs.collection('chats',ref=>ref.orderBy('Time','asc')).valueChanges();

  }

  close(){
    this.modalController.dismiss();
  }
  ngOnInit() {
    this.getReplies();
    this.send()
  }
  
  getReplies(){
    this.fs.collection('Chats').doc(this.id).collection('replies')
    .valueChanges().subscribe(res=>{
      console.log(res)
      this.chats = res
    })
  }
//send message

      send(){
        if( this.text != ''){
          if(this.sendTo == ''){
            alert("Please add a recepient of this message");
          }else{
              this.time = new Date() ;
              this.fs.collection('Chats').doc(this.id).collection('replies').add({
                Name: this.fauth.auth.currentUser.displayName,
                text: this.inputText,
                sender: this.fauth.auth.currentUser.uid,
                Date: new Date(),
                SendTo: this.sendTo
              });
              this.inputText = '' ;
            }
        }
      }
}
