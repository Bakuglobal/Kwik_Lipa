import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class OneSignalService {
  //variables
      Orders = [];
      KwikLipa  = [];
      userID;



  constructor(
    private http: HttpClient,
    private fs: AngularFirestore
  ) 

  { 
    this.userID = localStorage.getItem('userID');
  }

//save the notification data to array

  setNoticeData(data){
    let append = data ;
    append.status = "unread";
    this.fs.collection('notifications').doc('userID').collection(data.title).add(data).then(res => {

      //Increase Notification count in local storage
      let count = Number(localStorage.getItem('NoticeCount'));
      count ++ ;
      localStorage.setItem('NoticeCount',count.toString());
    });
  }

}
