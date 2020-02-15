import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AngularFirestore } from '@angular/fire/firestore';
import { AlertController, ToastController } from '@ionic/angular';
import { FirestoreService } from '../services/firestore.service';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { Contacts } from '@ionic-native/contacts/ngx';


const url = "https://gravatar.com/avatar/dba6bae8c566f9d4041fb9cd9ada7741?d=identicon&f=y";

@Component({
  selector: 'app-create-list',
  templateUrl: './create-list.page.html',
  styleUrls: ['./create-list.page.scss'],
})
export class CreateListPage implements OnInit {
  // variables

  items = [{ "item": "sugar", "image": url ,"price":"0"}, { "item": "Rice", "image": url ,"price":"0"}, { "item": "Soap", "image": url ,"price":"0"}, { "item": "honey", "image": url,"price":"0" }];
  unfilteredItems ;
  searchTerm: string ;
  title: string ;
  DueDate: string ;
  member: string ;
  suggestion = false;
  userSuggestion = false ;
  showInvite = false ;
  newListItems = [];
  users = [] ;
  unfilteredUsers = [] ;
  phone;
  name;
  // members = [{ "name": "James", "phone": "url" }, { "name": "Allan", "phone": "url" }, { "name": "Steve", "phone": "url" }];
  Listmembers = [];
  showMembers = false ;
  userID ;
  userName ;

  constructor(
    private navCtrl: Router,
    private formBuilder: FormBuilder,
    private fs: AngularFirestore,
    private alertCtrl: AlertController,
    private service: FirestoreService ,
    private toastCtrl: ToastController,
    private socialSharing: SocialSharing,
    private contacts: Contacts
  ) {
    this.unfilteredItems = this.items;
    this.userID = localStorage.getItem('userID');
    this.userName = localStorage.getItem('Name');
    // get users from db
    this.service.getUsers().valueChanges().subscribe(res => {
      this.users = res ;
      this.unfilteredUsers = res ;
      console.log(this.users);
    })

    
  }

  ngOnInit() {
  }

  back() {
    this.navCtrl.navigate(['tabs/mycontacts'])
  }
// filter products
  searchItem() {
    if (this.searchTerm != null || this.searchTerm != '') {
      this.items = this.filterItems();
      this.suggestion = true;
      console.log(this.items)
    } else {
      this.suggestion = false;

    }
  }
  filterItems() {
    return this.unfilteredItems.filter(item => {
      return item.item.toLowerCase().indexOf(this.searchTerm.toLowerCase()) > -1;
    });
  }

  // filter users
  suggestUsers() {
    if (this.member != null || this.member != '') {
      console.log(this.users) ;
      if(this.filterUser().length == 0){
        this.showInvite = true ;
        this.users = [] ;
      }else {
        this.users = this.filterUser() ;
        this.userSuggestion = true ;
        this.showInvite = false ;
      }
    }
    if(this.member === ''){
      this.userSuggestion = false ;
      this.users = [] ;
    }
  }
  filterUser() {
    return this.unfilteredUsers.filter(item => {
      return item.phone.toLowerCase().indexOf(this.member.toLowerCase()) > -1;
    }) ;
  }

  addItem(item) {
    item.count = 1;
    this.newListItems.push(item);
    this.suggestion = false;
    this.searchTerm = null;
  }
  add(index) {
    this.newListItems[index].count++;
  }
  reduce(index) {
    if(this.newListItems[index].count == 1){
    this.newListItems[index].count--;
    }
  }
  clearList() {
    this.newListItems = [];
    this.Listmembers = [] ;
  }
  removeMember(index) {
    this.Listmembers.splice(index, 1);
  }
  remove(index){
    this.newListItems.splice(index, 1);
  }
  addMembers(item) {
    if(this.Listmembers.includes(item)){
      // do not add
      this.Toasted('member already added')
    }else{
      this.Listmembers.push(item);
      // this.member = '' ;
      this.users.length = 0 ;
      this.userSuggestion = false;
    }
    
  }
  async sendInvite(){
    //share via whatsapp
    let receiver = this.member ;
    let msg = this.userName +' '+ "shared a Shopping List with you. Click the link to view it";
    let img = '../assets/images/icon.png' ;
    let url = 'https://play.google.com/store/apps/details?id=io.kwik.lipa';
    this.socialSharing.shareViaWhatsAppToReceiver(receiver, msg , img , url );
}
  closeSuggestion(){
    this.userSuggestion = false ;
  }
  contactList(){
    this.contacts.pickContact().then( det => {
      let savedNumber = det.phoneNumbers[0].value.toString() ;
      let check = savedNumber.charAt(0);
      if(check == "+"){
        let nospace = savedNumber.replace(/\s+/g,'');
        this.member = '0'+nospace.substring(4,12) ;
      }else{
        let clean = savedNumber.replace(/\s+/g,'');
        let cut = clean.substring(0,10);
        this.member = cut ;
      }
      this.name = det.name.givenName;
      this.suggestUsers();
    });
  

  }
  saveList() {
    
    if(this.title === undefined || this.title === '' ){
      this.presentAlert('Add Title to your List');
      return ;
    }
    if(this.DueDate === undefined){
      this.presentAlert('Set a shopping date for your List');
      return ;
    }
    const ref = this.fs.collection('shopping-list');
    let data = {
      "Title": this.title ,
      "DueDate": this.DueDate,
      "members":this.Listmembers,
      "Items": this.newListItems,
      "userID":this.userID,
      "createdBy": this.userName
    };
    ref.add(data).then(res => {
      console.log('saved' + res);
      // this.listForm.reset();
      this.Listmembers = [] ;
      this.newListItems = [] ;

    })
      .catch(err => {
        console.log(err);
      })
  }
  
  // alert
  async presentAlert(data){
    const alert = await this.alertCtrl.create({
      message: data,
      buttons: [
        {
          text: 'close',
          role: 'cancel'
        }
      ]
    });
    await alert.present();
  }
// toast msg
async Toasted(msg){
  const ts = await this.toastCtrl.create({
    message: msg,
    duration: 2000,
    position: 'bottom'
  });
  await ts.present();
}
}
