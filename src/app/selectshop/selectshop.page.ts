import { Component, OnInit } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import { FirestoreService } from '../services/firestore.service';
import { DatabaseService } from '../services/database.service';
import { Shop } from '../models/shops';
import { map } from 'rxjs/operators';
import { MenuController, AlertController } from '@ionic/angular';
import { Location } from '@angular/common';
import { AngularFirestore } from '@angular/fire/firestore';
import { Post } from '../models/post';

@Component({
  selector: 'app-selectshop',
  templateUrl: './selectshop.page.html',
  styleUrls: ['./selectshop.page.scss'],
})
export class SelectshopPage implements OnInit {
  shops: any []; 
  unfilteredShops: any[] ;
  searchTerm: string ;
  showSearch = false ;
  
  
  

  constructor(
    private navCtrl: Router,
    private fireApi: FirestoreService,
    private menuCtrl: MenuController,
    private alertCtrl: AlertController,
    private location: Location,
    private fs: AngularFirestore
  ) { }

  ngOnInit() {
    this.getShops();
    this.menuCtrl.enable(true);
  }


  //redirect to shop page
  goToShop(shop){
    this.fireApi.changeData(shop.shop);
    this.fireApi.hiddenTabs = true ;
    this.fireApi.serviceshopBy
        .subscribe(data => {
          console.log('shopBy -- ' + data)
          if(data == 'scan'){
            this.navCtrl.navigate(['tabs/shop']);
          }
          if(data == 'pick' || data == 'delivery'){
              this.navCtrl.navigate(['tabs/offers']);
            }
          if(data == 'shopBy'){
            // this.showAlert();
            let navigationExtras: NavigationExtras = {
              queryParams: shop
            };
            this.fireApi.hiddenTabs = true ;
            this.navCtrl.navigate(['tabs/shopprofile'], navigationExtras);
          }
          
        }); 
  }
  // get the list of shops

  getShops() {
    console.log('==========')
    this.fireApi.getShops().valueChanges()
    .subscribe(res => {
      this.shops = res ;
      this.unfilteredShops = res ;
      console.log('shops',this.shops);
      // this.domything();

    });
    // this.fireApi
    //   .getShops()
    //   .snapshotChanges()
    //   .pipe(map(changes => {
    //     return changes.map(c => ({ key: c.payload.key, ...c.payload.val() }));
    //   }))
    //   .subscribe(shops => {
    //     this.shops = shops;
    //     this.unfilteredShops = shops ;
    //   });
   }
   // to home page view
   back(){
    // 
    this.fireApi.shareShopBy('shopBy');
    this.fireApi.hiddenTabs = false ;
    this.navCtrl.navigate(['tabs/tab1']);
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
      return item.shop.toLowerCase().indexOf(this.searchTerm.toLowerCase()) > -1;
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


  // crazy product shuffle --- :-)
  // domything(){
  //   const ref = this.fs.collection("Kipusa Beauty",ref => {
  //     return ref.limitToLast(10).orderBy('currentprice');
  //   });
  //   ref.valueChanges().subscribe(res => {
  //     console.log('==-===')
  //     console.table(res);
  //     res.forEach(item => {
  //       console.log(item);
  //       this.fs.collection('Featured').add(item).catch(err => console.log(err));
  //     })
  //   },error => { console.log('get-err',error)});
    
  // }


  

}
