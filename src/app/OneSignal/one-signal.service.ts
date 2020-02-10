import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AngularFirestore } from '@angular/fire/firestore';
// import { BehaviorSubject } from 'rxjs';
import { Firebase } from '@ionic-native/firebase/ngx';
import { Platform } from '@ionic/angular';


@Injectable({
  providedIn: 'root'
})
export class OneSignalService {
 //variables
    userID;
    token ;

  constructor(
    private http: HttpClient,
    private fs: AngularFirestore,
    private FB: Firebase,
    private platform: Platform
  ) { 
  }
// set token
setToken(token){
  this.token = token ;
}
// send token to firebase
sendTokenToFirebase(id){
  if(this.token === undefined){return ; }
    let ref = this.fs.collection('LipaDevices').doc(id);
    ref.set({
      "token": this.token,
      "userID": id
    })
  
  
}

}
