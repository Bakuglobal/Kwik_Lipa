import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AngularFirestore } from '@angular/fire/firestore';
import { AlertController } from '@ionic/angular';


const url = "https://gravatar.com/avatar/dba6bae8c566f9d4041fb9cd9ada7741?d=identicon&f=y";

@Component({
  selector: 'app-create-list',
  templateUrl: './create-list.page.html',
  styleUrls: ['./create-list.page.scss'],
})
export class CreateListPage implements OnInit {
  // variables

  items = [{ "item": "sugar", "image": url }, { "item": "Rice", "image": url }, { "item": "Soap", "image": url }, { "item": "honey", "image": url }];
  unfilteredItems;
  searchTerm: string;
  suggestion = false;
  newListItems = [];
  members = [{ "name": "James", "phone": "url" }, { "name": "Allan", "phone": "url" }, { "name": "Steve", "phone": "url" }];
  Listmembers = [];
  showMembers = false ;
  userID ;

  listForm: FormGroup;
  constructor(
    private navCtrl: Router,
    private formBuilder: FormBuilder,
    private fs: AngularFirestore,
    private alertCtrl: AlertController
  ) {
    this.unfilteredItems = this.items;
    this.userID = localStorage.getItem('userID');
    this.listForm = formBuilder.group({
      title: ['', Validators.compose([Validators.maxLength(30), Validators.pattern('[a-zA-Z ]*'), Validators.required])],
      DueDate: ['',Validators.required],
    });
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
  searchUser() {
    if (this.searchTerm != null || this.searchTerm != '') {
      this.items = this.filterItems();
      this.suggestion = true;
      console.log(this.items)
    } else {
      this.suggestion = false;

    }
  }
  filterUser() {
    return this.unfilteredItems.filter(item => {
      return item.item.toLowerCase().indexOf(this.searchTerm.toLowerCase()) > -1;
    });
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
    this.newListItems[index].count--;
  }
  clearList() {
    this.newListItems = [];
    this.listForm.reset();
    this.Listmembers = [] ;
  }
  removeMember(index) {
    this.Listmembers.splice(index, 1);
  }
  addMembers(item) {
    this.Listmembers.push(item);
    this.showMembers = false;
  }
  saveList() {
    if (!this.listForm.valid) {
      console.log(this.listForm.value);
      return;
    }
    if(this.newListItems.length === 0 ){
      this.presentAlert('Add items to your List');
      return ;
    }
    const ref = this.fs.collection('shopping-list');
    let data = {
      "Title": this.listForm.value.title ,
      "DueDate": this.listForm.value.DueDate,
      "members":this.Listmembers,
      "Items": this.newListItems,
      "userID":this.userID
    };
    ref.add(data).then(res => {
      console.log('saved' + res);
      this.listForm.reset();
      this.Listmembers = [] ;
      this.newListItems = [] ;

    })
      .catch(err => {
        console.log(err);
      })
  }
  suggestUsers(member){

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

}
