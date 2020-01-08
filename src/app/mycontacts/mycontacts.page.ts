import { Component, OnInit ,ViewChild, ElementRef } from '@angular/core';
// import { Contacts, ContactFieldType, ContactFindOptions } from '@ionic-native/contacts';
import { Router } from '@angular/router';
import {
  AlertController,
  ToastController,
  LoadingController,
  NavController,
  IonContent
} from '@ionic/angular';
// import { AdMobFree } from '@ionic-native/admob-free/ngx';

import { FirestoreService } from '../services/firestore.service';
import { DatabaseService, ShoppingList } from '../services/database.service';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { error } from 'util';
import { map } from'rxjs/operators' ;
import 'rxjs/add/operator/mergeMap';
// import { mapChildrenIntoArray } from '@angular/router/src/url_tree';
import { AngularFirestore } from '@angular/fire/firestore';
import { AppComponent } from '../app.component';
import { Location } from '@angular/common' ;


@Component({
  selector: 'app-mycontacts',
  templateUrl: './mycontacts.page.html',
  styleUrls: ['./mycontacts.page.scss'],
})
export class MycontactsPage implements OnInit {

  @ViewChild('content',{static:true}) content : IonContent ;

  myList = [ ] ;
  createdList = [];
  snaps = [] ;
  docID = [] ;
  item ;
  dt = [] ;
  activate: boolean = false;
  edit: boolean = false ;
  show: boolean = false ;
  share: boolean = false ;
  theme: boolean = false ;
  currentDate ;
  shopSelected ;
  //shoppingListTitle: string ;
  todo = {
    Title: "",
    First: "",
    Second: "",
    Third: "",
    Fourth: "",
    Fifth: "",
    Date:""
  } ;
  shoppingDate ;
  userID ;
  head ;
  index ;
  toshare = [];
  modID ;
  prevList = [];
  constructor(
    // public contacts: Contacts,
    public navCtrl: Router,
    public loadingController: LoadingController,
    public toastController: ToastController,
    public alertCtrl: AlertController,
    // private admobFree: AdMobFree,
    private fireApi: FirestoreService,
    private dbService: DatabaseService,
    private socialSharing: SocialSharing,
    private afs:AngularFirestore,
    public ref : AppComponent,
    private location: Location

  ){

  }
  back(){
    this.location.back() ;
  }
  ngOnInit() {
    // this.removeBannerAd();
    this.getDate();
    this.userID = localStorage.getItem('userID');
  
   this.changes();
   this.openList();
   

  }
  //share 
  shareList(ind){
    this.share = true ;
    this.toshare = this.createdList[ind];
    console.log(this.toshare);
  }
  //modify list
  editedList(list){
    this.todo = list ;
    console.log('todo :'+list)
  }
  modify(list,rowId){
    this.modID = rowId ;
    let docID = this.docID[rowId];
    let shoppingList = {};
    shoppingList['Title'] =  this.todo.Title ;
    shoppingList['First'] = this.todo.First ;
    shoppingList['Second'] = this.todo.Second ;
  shoppingList['Third'] = this.todo.Third ;
  shoppingList['Fourth'] = this.todo.Fourth ;
  shoppingList['Fifth'] = this.todo.Fifth;
  shoppingList['Date'] = this.getDate();
  shoppingList['user-id'] = this.userID ;
  this.dbService.updateList(shoppingList,docID);
  list.theme = !list.theme ;
  }
  
  //scrolls to bottom whenever the page has loaded
ionViewDidEnter(){
      this.content.scrollToBottom(100);//300ms animation speed
    }
    //change theme of shopping list
onChange(value,index) {
  console.log(index);
      this.createdList[index].disco = value;
     
    }
changes(){
  this.afs.collection('shopping-list').ref.where('user-id', '==', this.userID)
  .onSnapshot(querySnapshot => {
    querySnapshot.docChanges().forEach(change => {
      if (change.type === 'added') {
        console.log('New city: ', change.doc.data());
        if(this.snaps.includes(change.doc.data())){
        
         return ;
        }else{
          
        this.docID.push(change.doc.id);
        this.snaps.push(change.doc.data());
      }
      } 
      if (change.type === 'modified') {
        console.log('Modified city: ', change.doc.data());
        this.docID[this.modID] = change.doc.id;
        this.snaps[this.modID] = change.doc.data();
      } 
      if (change.type === 'removed'){
        console.log('Removed city: ', change.doc.data());
        this.createdList.splice(this.index,1);
      }
    });
    this.createdList = this.snaps ;
    console.log(this.createdList);
    if(this.createdList.length !== 0 ){
      this.edit = true ;
      this.ionViewDidEnter();
    }
  });
 
 }
cancel(){
    this.activate = false ;
  }
  async emailShare(){
    // Check if sharing via email is supported
    this.socialSharing.canShareViaEmail().then(() => {
      // Sharing via email is possible

    }).catch(() => {
      // Sharing via email is not possible
      this.presentToast('sign in to your email account first')
    });


    // Share via email
       let email =  this.ref.email ;
    this.socialSharing.shareViaEmail('This is my shopping List', 'Shopping List', [email]).then(() => {
      // Success!
    }).catch(error => {
      console.log(error);
    });
    this.share = false ;
  }
  async whatsappshare(){


      //share via whatsapp
      let msg = "Kwik Shopping List ";
      let img = '../assets/images/icon.png' ;
      let url = 'https://weza-prosoft.com';
      this.socialSharing.shareViaWhatsApp(msg , null ,url )
          .then(()=>{
            console.log("WhatsApp share successful");
          }).catch((err)=> {
          console.log("An error occurred ", err);
        });
      this.share = false ;
  }
  openList(){
    this.fireApi.serviceData
    .subscribe(shopname => (this.shopSelected = shopname));
  console.log("sent shopname from home page : ", this.shopSelected);
  if(this.shopSelected !== "Shopname"){
    this.show = true ;
  }
  }



  addItem(){
    this.myList.push("Item  ...");
  }

  createList(){
    this. todo = {
      Title: "",
      First: "",
      Second: "",
      Third: "",
      Fourth: "",
      Fifth: "",
      Date:""
    } ;
    this.activate = true ;
  }
  saveList(){
    //this.addTitle();
    let shoppingList = {};
    shoppingList['Title'] =  this.todo.Title ;
    shoppingList['First'] = this.todo.First ;
    shoppingList['Second'] = this.todo.Second ;
  shoppingList['Third'] = this.todo.Third ;
  shoppingList['Fourth'] = this.todo.Fourth ;
  shoppingList['Fifth'] = this.todo.Fifth;
  shoppingList['Date'] = this.getDate();
  shoppingList['user-id'] = this.userID ;
  this.dbService.createList(shoppingList).then(resp => {

    console.log(resp);
    console.log(this.todo);
  });
  this.activate = false ;
  this.edit = true ;
  //this.searchList();
}
removeList(rowId){
  this.index = rowId ;
  let docID = this.docID[rowId]
  console.log(docID)
  this.dbService.deleteList(docID);
  //this.activate = false ;
  //this.edit = false ;

}
editList(shoppingList){
  shoppingList.isEdit = true ;
  shoppingList.EditItems = shoppingList.First ;
  shoppingList.EditItems = shoppingList.Second ;
  shoppingList.EditItems = shoppingList.Third ;
  shoppingList.EditItems = shoppingList.Fourth ;
  shoppingList.EditItems = shoppingList.Fifth ;
  shoppingList.EditDate = shoppingList.Date ;
  shoppingList.EditTitle = shoppingList.Title ;
}
updateList(listRow){
  let shoppingList = {};
  shoppingList['Title'] = listRow.EditTitle ;
  shoppingList['First'] = listRow.EditItems ;
  shoppingList['Second'] = listRow.EditItems ;
  shoppingList['Third'] = listRow.EditItems ;
  shoppingList['Fourth'] = listRow.EditItems ;
  shoppingList['Fifth'] = listRow.EditItems ;
  shoppingList['Date'] = listRow.EditDate ;
  this.dbService.updateList(listRow.id,shoppingList);
  listRow.isEdit = false ;
}

getDate(){
  var today = new Date();
  var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
  return date ;
}
// removeBannerAd(){
//   this.admobFree.banner.remove();
// }

backtoCart(){
  this.fireApi.serviceData
    .subscribe(shopname => (this.shopSelected = shopname));
  console.log("sent shopname from home page : ", this.shopSelected);
  if(this.shopSelected === "Shopname"){
    this.noShop();
  }else{
    this.navCtrl.navigate(['tabs/shop']);
  }
}

async noShop(){
  let warn = await this.alertCtrl.create({
    header: 'You need to first select a Shop',
    message: 'Click continue to select a shop ',
    buttons: [
      {
        text: 'cancel',
        role: 'cancel'
      },
      {
        text: 'Continue',
        handler: () => {
          this.navCtrl.navigate(['tabs/tab1']);
        }
      }
    ]
  });
  await warn.present();
}
// Toaster
async presentToast(data) {
const toast = await this.toastController.create({
  message: data,
  duration: 1000
});
toast.present();
}
}
