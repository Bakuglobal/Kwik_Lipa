import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FirestoreService } from '../services/firestore.service';
import { DatabaseService } from '../services/database.service';
import { Shops } from '../models/shops';
import { map } from 'rxjs/operators';
import { MenuController, AlertController } from '@ionic/angular';
import { Location } from '@angular/common';

@Component({
  selector: 'app-selectshop',
  templateUrl: './selectshop.page.html',
  styleUrls: ['./selectshop.page.scss'],
})
export class SelectshopPage implements OnInit {
  shops: Shops[];
  unfilteredShops: Shops[] ;
  searchTerm: string ;
  showSearch = false ;
  
  

  constructor(
    private navCtrl: Router,
    private fireApi: FirestoreService,
    private menuCtrl: MenuController,
    private alertCtrl: AlertController,
    private location: Location
  ) { }

  ngOnInit() {
    this.getShops();
    this.menuCtrl.enable(true);
  }


  //redirect to shop page
  goToShop(shop){
    this.fireApi.changeData(shop.name);
    this.fireApi.hiddenTabs = true ;
    this.fireApi.serviceshopBy
        .subscribe(data => {
          console.log('shopBy -- ' + data)
          if(data == 'scan'){
            this.navCtrl.navigate(['tabs/shop']);
          }
          if(data == 'pick'){
              this.navCtrl.navigate(['tabs/offers']);
            }
          if(data == 'shopBy'){
            this.showAlert();
          }
        }); 

  }
  // get the list of shops

  getShops() {
    this.fireApi
      .getShops()
      .snapshotChanges()
      .pipe(map(changes => {
        return changes.map(c => ({ key: c.payload.key, ...c.payload.val() }));
      }))
      .subscribe(shops => {
        this.shops = shops;
        this.unfilteredShops = shops ;
      });
   }
   // to home page view
   back(){
    // this.navCtrl.navigate(['tabs/tab1']);
    this.location.back();
  }
  // handle searchbar 
  setFilteredItems(){
    if(this.searchTerm != null || this.searchTerm != ''){
      this.shops = this.filterItems()
      console.log(this.shops)
    }
  }
  filterItems() {
    return this.unfilteredShops.filter(item => {
      return item.name.toLowerCase().indexOf(this.searchTerm.toLowerCase()) > -1;
    });
  }
  // show searchBar
  show(){
    if(this.showSearch == false){
      this.showSearch = true;
    }else{
      this.showSearch = false ;
    }
  }
  async showAlert(){
    const alert = await this.alertCtrl.create({
      header: 'Please select mode of shopping',
      inputs: [
        {
          name: 'radio5',
          type: 'radio',
          label: 'Scan and Pay',
          value: 'scan'
        },
        {
          name: 'radio6',
          type: 'radio',
          label: 'Pick Pay and Collect',
          value: 'pick'
        }
      ],
      buttons: [
        {
          text: 'cancel',
          role: 'cancel'
        },
        {
          text:'Shop',
          handler:(data) => {
            console.log(data);
            if(data == 'scan'){
              this.navCtrl.navigate(['tabs/shop']);
            }
            if(data == 'pick'){
              this.navCtrl.navigate(['tabs/offers']);
            }
          }
        }
      ]

    });
    await alert.present();
  }

}
