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
import { AngularFireStorage } from '@angular/fire/storage';

@Component({
  selector: 'app-shoppinglist',
  templateUrl: './shoppinglist.page.html',
  styleUrls: ['./shoppinglist.page.scss'],
})
export class MycontactsPage implements OnInit {

  @ViewChild('content',{static:true}) content : IonContent ;
// variables
search = false ;
myList ;
userID ;
totaItems ;
budget ;
myName ;
zeroList = false ;
sharedList;
phone;
  
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
    private mod: ModalController,

  ){
    this.fireApi.hiddenTabs = true ;
    this.userID = localStorage.getItem('userID');
    this.myName = localStorage.getItem('Name');
    this.phone = localStorage.getItem('Number')
    console.log(this.userID)
    
  }
  back(){
    this.fireApi.hiddenTabs = false ;
    this.navCtrl.navigate(['tabs/tab1']) ;
  }
  ngOnInit() {
    
  }
  ionViewDidEnter(){
    this.getallLists();
  }

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
    mod.onDidDismiss().then(value =>{
      if(value.data !== undefined && value.data !== null){
        console.log('budget value',value.data);
        this.fireApi.setBudget(value.data);
        this.navCtrl.navigate(['tabs/recommend'])
      }
    });
    await mod.present();
    
  }

  


  createList(){
    this.navCtrl.navigate(['tabs/createList']);
  }
  getallLists(){
    this.fireApi.getLists(this.userID).subscribe(res => {
      this.myList = res ;      
      if(res.length !== 0){
        this.zeroList = true ;
      }
      console.log(this.myList);
      this.getTotalCount();
    });
    this.fireApi.getSharedLists(this.phone).subscribe(res => {
      this.sharedList = res ;
      if(res.length !== 0){
        this.zeroList = true ;
      }
      console.log(this.sharedList);

    })
  }
  getTotalCount() {
    this.totaItems = this.myList.Items.reduce((a, b) => a + (b.count * 1), 0);
    // let count = 0;
    // this.myList.forEach(el=>{ el.Items.forEach(pr.count)})
    // this.totaItems=count;
    // console.log(this.totaItems);
  }
  totalBudget(item){
   return this.budget = item.Items.reduce((a, b) => a + (b.count * b.price), 0);
  }
  
}
