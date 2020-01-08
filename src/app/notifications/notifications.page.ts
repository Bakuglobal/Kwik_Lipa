import { Component, OnInit } from '@angular/core';
import { FirestoreService } from '../services/firestore.service';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { Location } from '@angular/common' ;

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.page.html',
  styleUrls: ['./notifications.page.scss'],
})
export class NotificationsPage implements OnInit {

  header: boolean;
  constructor(
    private service: FirestoreService,
    private navCtrl: Router,
    private fauth: AngularFireAuth,
    private location: Location
  ) { 
    if(this.fauth.auth.currentUser){
      //logged in
    }else {
      this.navCtrl.navigate(['tabs/login'])
    }
  }
  back(){
    this.location.back() ;
  }
   onScroll(event) {
    // used a couple of "guards" to prevent unnecessary assignments if scrolling in a direction and the var is set already:
    if (event.detail.deltaY > 0 && this.header && this.service.hiddenTabs) return;
    if (event.detail.deltaY < 0 && !this.header && this.service.hiddenTabs) return;
    if (event.detail.deltaY > 0) {
      console.log("scrolling down, hiding footer...");
      this.header = true;
      this.service.hiddenTabs = false ;
    } else {
      console.log("scrolling up, revealing footer...");
      this.header = false;
      this.service.hiddenTabs = true ;
    };
  };
  ngOnInit() {
  }

}
