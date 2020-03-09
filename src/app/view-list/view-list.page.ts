import { Component, OnInit, Input } from '@angular/core';
import { ModalController, AlertController, ToastController } from '@ionic/angular';
import { AngularFirestore } from '@angular/fire/firestore';
import { Contacts } from '@ionic-native/contacts/ngx';
import { FirestoreService } from '../services/firestore.service';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { Router } from '@angular/router';

@Component({
  selector: 'app-view-list',
  templateUrl: './view-list.page.html',
  styleUrls: ['./view-list.page.scss'],
})
export class ViewListPage implements OnInit {
  @Input('Title') Title;
  @Input('Items') Items:any[];
  @Input('members') members:any[];
  @Input('DueDate') DueDate;
  @Input('userID') userID;
  @Input('createdBy') createdBy;
  @Input('id') id;

  edit = false;
  totaItems;
  myID;
  searchTerm: string;
  placeholder = '';
  icon = '';
  label = ''
  userSuggestion = false;
  users = [];
  newItems = [];
  ListRef = [] ;
  AllUsers;
  showInvite = false ;
  userName ;
  shared = [];
  budget: number ;

  constructor(
    private modal: ModalController,
    private fs: AngularFirestore,
    private alert: AlertController,
    private toast: ToastController,
    private contact: Contacts,
    private service : FirestoreService,
    private socialSharing: SocialSharing,
    private navCtrl: Router
  ) {
    this.myID = localStorage.getItem('userID');
    
    this.userName = localStorage.getItem('Name');
    this.service.getUsers().valueChanges().subscribe(res => {
      this.users = res;
      this.AllUsers = res;
      console.log(this.users);
    });
  }
  ionViewWillEnter(){
    this.Items.forEach(item => {
      this.ListRef.push(item) ;
    });
    this.members.forEach(item => {
      this.shared.push(item) ;
    });
  }
  shopNow(){

    if(this.budget == 0){
      this.setBudget();
    }else{
      // this.navCtrl.navigate(['tabs/recommend']);
      this.modal.dismiss(this.budget);
    }
  }
  ngOnInit() {
    this.getTotalCount();
  }
  priceUpdate(item){
    console.log('price update',item);
    this.update();
  }
  // filter users
  suggestion() {
    if(this.icon === 'add'){
      return ;
    }
    if (this.searchTerm != null || this.searchTerm != '') {
      console.log(this.users);
      if (this.filterUser().length == 0) {
        this.showInvite = true;
        this.users = [];
      } else {
        this.users = this.filterUser();
        this.userSuggestion = true;
        this.showInvite = false;
      }
    }
    if (this.searchTerm === '') {
      this.userSuggestion = false;
      this.users = [];
    }
  }
  filterUser() {
    return this.AllUsers.filter(item => {
      return item.phone.toLowerCase().indexOf(this.searchTerm.toLowerCase()) > -1;
    });
  }

  close() {
      this.modal.dismiss();
  }
  add(index) {
    this.Items[index].count++;
    this.totaItems++;
    this.update();

  }
  reduce(index) {
    if (this.Items[index].count == 1) { return }
    else {
      this.Items[index].count--;
      this.totaItems--;
      this.update();
    };

  }
  getTotalCount() {
    this.totaItems = this.Items.reduce((a, b) => a + (b.count * 1), 0);
  }
  deleteList() {
    if (this.myID == this.userID) {
      this.confirm('Do you want to delete this shopping list');
    } else {
      this.NotOwner();
    }

  }
  removeMember(index) {
    let ind = index - 1;
    this.members.splice(index, 1);
    this.update();
  }
  addMembersToList(user) {
    this.members.push(user);
    this.edit = false ;
    this.update();
  }
  remove(index,item){
    console.log(item);
    this.totaItems = this.totaItems - item.count ;
    this.Items.splice(index,1);
    this.update();
  }
  addNewItem() {
    if (this.icon == 'add') {
      let item ={
        "count":1,
        "price":0,
        "item":this.searchTerm
      }
      this.Items.push(item);
      this.totaItems ++; 
      this.searchTerm = '';
      this.edit = false ;
      this.update();
    } else {
      this.myContacts();
    }
  }
  addItem() {
    this.edit = true;
    this.placeholder = 'Enter what you want to buy';
    this.label = 'Add new Item';
    this.searchTerm = '';
    this.icon = 'add';

  }
  addMember() {
    this.edit = true;
    this.placeholder = 'Enter phone number or pick from your contact --> ';
    this.label = 'Share list with';
    this.searchTerm = '';
    this.icon = 'person';

  }
  myContacts() {
    this.contact.pickContact().then(det => {
      let savedNumber = det.phoneNumbers[0].value.toString();
      let check = savedNumber.charAt(0);
      if (check == "+") {
        let nospace = savedNumber.replace(/\s+/g, '');
        this.searchTerm = '0' + nospace.substring(4, 12);
      } else {
        let clean = savedNumber.replace(/\s+/g, '');
        let cut = clean.substring(0, 10);
        this.searchTerm = cut;
      }
      // this.name = det.name.givenName;
      // this.suggestUsers();
    });
  }
  async sendInvite() {
    let sub = this.searchTerm.substring(0, 1);
    if (sub == '0' || sub == '+' || sub == '2') {
      switch (this.searchTerm.length) {
        case 10:
          this.share();
          break;
        case 11:
          this.share();
          break;
        case 12:
          this.share();
          break;
        default:
          this.Toasted(this.searchTerm + ' ' + ' ' + 'is not a valid phone number');
      }
    } else {
      this.Toasted(this.searchTerm + ' ' + ' ' + 'is not a valid phone number');
    }
  }
  share() {
    //share via whatsapp
    let receiver = this.searchTerm;
    let msg = this.userName + ' ' + "shared a Shopping List with you. Click the link to view it";
    let img = '../assets/images/icon.png';
    let url = 'https://play.google.com/store/apps/details?id=io.kwik.lipa';
    this.socialSharing.shareViaWhatsAppToReceiver(receiver, msg, img, url);
    this.edit = false ;
  }
  
  async NotOwner() {
    const ts = await this.toast.create({
      message: 'Cant delete this list because you are not the owner',
      duration: 2000,
      position: 'bottom'
    });
    await ts.present();
  }
  async confirm(msg) {
    const pop = await this.alert.create({
      message: msg,
      buttons: [
        {
          text: 'No',
          role: 'cancel'
        },
        {
          text: 'Yes',
          handler: () => {
            this.fs.collection('shopping-list').doc(this.id).delete();
            this.close();
          }
        }
      ]
    });
    await pop.present();
  }
  async setBudget(){
    const bud = await this.alert.create({
      message: 'Please set a budget for the Items in your list to get recommendation for the Cheapest Shops to buy from',
      buttons: [
        {
          text:'Not now',
          handler: () => {
            this.modal.dismiss(this.budget);
            // this.navCtrl.navigate(['tabs/recommend']);
            
          }
        },
        {
          text:'Okay',
          role: 'cancel'
        }
      ]
    });
    await bud.present();
  }
  update(){
            this.fs.collection('shopping-list').doc(this.id).update({
              "Items":this.Items,
              "members":this.members
            }).catch(err => {
              console.log(err);
            });
  }
  // toast msg
  async Toasted(msg) {
    const ts = await this.toast.create({
      message: msg,
      duration: 2000,
      position: 'bottom'
    });
    await ts.present();
  }
  // get total budget
  getBudget (){
    this.budget = this.Items.reduce((a, b) => a + (b.count * b.price), 0);
    return this.budget ;
  }

}
