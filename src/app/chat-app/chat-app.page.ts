import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';
import { Chat } from 'src/app/models/chat';
import { ChatService } from 'src/app/services/chat.service';
import { UtilService } from 'src/app/services/util.service';
import { User } from 'src/app/models/user';


@Component({
  selector: 'app-chat-app',
  templateUrl: './chat-app.page.html',
  styleUrls: ['./chat-app.page.scss'],
})
export class ChatAppPage implements OnInit {
  message: string;
  uid: string = '';
  interlocutorUID: string = '';
  chats: Array<Chat>;
  chatsRef: AngularFireList<Chat>;

  uidData: User;
  interlocutorUIDData: User; 


  constructor(private chatsService: ChatService, private db: AngularFireDatabase, private utilService: UtilService) {
    this.utilService.doLoading('Please Wait...');
    // get uids 
    this.uid = this.chatsService.chatter.uid
    this.interlocutorUID = this.chatsService.chatter.interlocutorUID;

    // get chat Reference 
    chatsService.getChatRef(this.uid, this.interlocutorUID).then((chatRefPath: string) => {
      console.log('chatRef: uid, interlocutorUID', chatRefPath);
      this.chatsRef = this.db.list(chatRefPath);
      this.db.list(chatRefPath).valueChanges().subscribe((chats: Chat[]) => { console.log('chats', chats); this.chats = chats });

    });
    this.db.object(`/users/${this.uid}`).valueChanges().subscribe((user: User) => { console.log('loged user', user); this.uidData = user });
    this.db.object(`/users/${this.interlocutorUID}`).valueChanges().subscribe((user: User) => { console.log('interlo', user); this.interlocutorUIDData = user });
  }

  sendMessage(): void {
    if (this.message) {
      let chat: Chat = {
        from: this.uid,
        message: this.message,
        type: 'message',
        to: this.interlocutorUID,
        picture: null
      };
      this.chatsRef.push(chat);
      this.message = "";
    }
  };

  // sendPicture(): void {

  //   this.camera.getPicture().then(imageData => {
  //     let chat: Chat = {
  //       from: this.uid,
  //       message: '',
  //       type: 'picture',
  //       picture: 'data:image/jpeg;base64,' + imageData,
  //       to: this.interlocutorUID,
  //     };
  //     this.chatsRef.push(chat);
  //   }).catch(err => this.utilService.doAlert(`Error`, `This feature only works on Mobiles.`, 'OK'));
  // }
  ngOnInit() {

  }

}
