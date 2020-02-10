import { Component, OnInit ,ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import {
  AlertController,
  ToastController,
  LoadingController,
  IonContent,
  ModalController
} from '@ionic/angular';
import { FirestoreService } from '../services/firestore.service';
import { DatabaseService } from '../services/database.service';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import 'rxjs/add/operator/mergeMap';
import { AngularFirestore } from '@angular/fire/firestore';
import { AppComponent } from '../app.component';
import { Location } from '@angular/common' ;
import { ViewListPage } from '../view-list/view-list.page';
import { List } from '../models/list';

@Component({
  selector: 'app-mycontacts',
  templateUrl: './mycontacts.page.html',
  styleUrls: ['./mycontacts.page.scss'],
})
export class MycontactsPage implements OnInit {

  @ViewChild('content',{static:true}) content : IonContent ;
// variables
search = false ;
myList = [];
userID ;
  
  constructor(
    public navCtrl: Router,
    public loadingController: LoadingController,
    public toastController: ToastController,
    public alertCtrl: AlertController,
    private fireApi: FirestoreService,
    private dbService: DatabaseService,
    private socialSharing: SocialSharing,
    private afs:AngularFirestore,
    public ref : AppComponent,
    private location: Location,
    private mod: ModalController

  ){
    this.fireApi.hiddenTabs = true ;
    this.userID = localStorage.getItem('userID');
    console.log(this.userID)
    this.getallLists();
  }
  back(){
    this.fireApi.hiddenTabs = false ;
    this.navCtrl.navigate(['tabs/tab1']) ;
  }
  ngOnInit() {
    
  }
  ionViewDidEnter

  showSearch(){
    if(this.search === false){
      this.search = true ;
    }else {
      this.search = false ;
    }
  }
  async viewList(item) {
    const mod = await this.mod.create({
      component: ViewListPage,
      componentProps: item
    });
    console.log(item);
    await mod.present();
  }

  createList(){
    this.navCtrl.navigate(['tabs/createList']);
  }
  getallLists(){
    this.fireApi.getLists(this.userID).subscribe(res => {
      this.myList = res ;
      console.log(this.myList);
    })

  }
  
}
