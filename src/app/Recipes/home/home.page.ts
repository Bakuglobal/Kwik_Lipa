import { Component, OnInit } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import { FirestoreService } from 'src/app/services/firestore.service';
import { MenuController, AlertController } from '@ionic/angular';
import { AngularFirestore } from '@angular/fire/firestore';
import  { Location } from '@angular/common' ;

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  recipe: any []; 
  unfilteredShops: any[] ;
  searchTerm: string ;
  showSearch = false ;
  skeleton = [1,2,3,4];
  
  

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


  goToProfile(rest){
    console.log(rest);
      let navigationExtras: NavigationExtras = {
        queryParams: rest
      };
      this.fireApi.hiddenTabs = true ;
      this.navCtrl.navigate(['tabs/Recipeprofile'], navigationExtras);
  }
  // get the list of shops

  getShops() {
    console.log('==========')
    this.fireApi.getRecipe().valueChanges()
    .subscribe(res => {
      this.recipe = res ;
      this.unfilteredShops = res ;
      console.log('shops',this.recipe);
    });
   }
   // to home page view
   back(){
    // 
    this.fireApi.shareShopBy('shopBy');
    this.location.back();
  }
  // handle searchbar 
  setFilteredItems(){
    if(this.searchTerm != null || this.searchTerm != ''){
      this.recipe = this.filterItems()
      console.log(this.recipe)
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
  
  

}
