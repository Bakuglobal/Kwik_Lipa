import { Component, OnInit, Input } from '@angular/core';
import { ModalController, AlertController, ToastController } from '@ionic/angular';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-view-list',
  templateUrl: './view-list.page.html',
  styleUrls: ['./view-list.page.scss'],
})
export class ViewListPage implements OnInit {
  @Input('Title') Title;
  @Input('Items') Items;
  @Input('members') members;
  @Input('DueDate') DueDate;
  @Input('userID') userID;
  @Input('createdBy') createdBy ;
  @Input('id') id ;

  edit = false;
  totaItems;
  myID ;
  searchTerm: string ;
  placeholder = '' ;
  label = ''
  userSuggestion = false ;
  users = [] ;
  newItems = [] ;

  constructor(
    private modal: ModalController,
    private fs: AngularFirestore,
    private alert: AlertController,
    private toast: ToastController
  ) {
    this.myID = localStorage.getItem('userID');
  }

  ngOnInit() {
    this.getTotalCount();
  }

  close() {
    this.modal.dismiss();
  }
  add(index) {
    this.Items[index].count++;
    this.totaItems++;

  }
  reduce(index) {
    if (this.Items[index].count == 1) { return }
    else {
      this.Items[index].count--;
      this.totaItems--;
    };

  }
  getTotalCount() {
    this.totaItems = this.Items.reduce((a, b) => a + (b.count * 1), 0);
  }
  deleteList(){
    if(this.myID == this.userID){
      this.confirm('Do you want to delete this shopping list');
    }else {
      this.NotOwner();
    }
    
  }
  removeMember(index){
    let ind = index - 1 ;
    this.members.splice(index,1);
  }
  addMembersToList(user){

  }
  addItemToList(item){

  }
  addItem(){
    this.edit = true ;
    this.placeholder = 'Enter what you want to buy';
    this.label = 'Add new Item';
    this.searchTerm = '' ;

  }
  addMember(){
    this.edit = true ;
    this.placeholder = 'Enter phone number ';
    this.label = 'Share list with' ;
    this.searchTerm = '' ;

  }
  myContacts(){

  }
  suggestList(){

  }
  async NotOwner(){
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

}
