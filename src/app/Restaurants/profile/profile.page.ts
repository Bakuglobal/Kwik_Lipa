import { Component, OnInit } from '@angular/core';
import { FirestoreService } from 'src/app/services/firestore.service';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { Shops } from 'src/app/models/shops';
import { Location } from '@angular/common';
import { DatabaseService } from 'src/app/services/database.service';
import { ToastController } from '@ionic/angular';

export class Restaurant {
  Close: string;
  Contacts: string;
  Email: string;
  Location: string;
  Open: string;
  Restaurant: string;
  Website: string;
  cover:string;
  logo: string;
}

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})

export class ProfilePage implements OnInit {
  data: any ;
  meals: any;
  unfilteredMeal: any ;
  categories: any ;
  searchTerm: string ;
  constructor(
    private service: FirestoreService,
    private route: ActivatedRoute,
    private location: Location,
    private db: DatabaseService,
    private toastCtrl: ToastController,
    private navCtrl: Router
  ) 
  {
    this.service.hiddenTabs = true ;
    this.route.queryParams.subscribe(params => {
      if (params) {
        console.log(params);
        this.data = params;
      }
    });
   }

  ngOnInit() {
    this.getMeals();
    this.getCategories()
  }
  onScroll(event) {
    if (event.detail.scrollTop == 0) {
      this.service.hiddenTabs = true;
      console.log("00000000");
      this.changeBackToRelative();
    } else {
      if (event.detail.scrollTop > 380) {
        console.log(event.detail.scrollTop);
        // this.service.hiddenTabs = true;
        this.changeToFixed();
      } else {
        // this.service.hiddenTabs = false;
      }
    }
  }

  changeBackToRelative(){
    let bar = document.getElementById('meals');
    bar.style.position = 'Relative';
    bar.style.backgroundColor = 'white';
  }
  changeToFixed(){
    let bar = document.getElementById('meals');
    bar.style.position = 'Fixed';
    bar.style.top = '0px';
    bar.style.zIndex = '1000';
    bar.style.backgroundColor = 'var(--ion-color-medium)';
    bar.style.overflowX =  'scroll' ;
    bar.style.width = '100%';
  }

  back(){
    this.service.hiddenTabs = false ; 
    this.location.back();
  }
  getMeals(){
    this.service.getMeals(this.data.Restaurant).subscribe(res => {
      console.log('meals',res);
      this.meals = res ;
      this.unfilteredMeal = res ;
    })
  }
  getCategories(){
    this.service.getCategory(this.data.Restaurant).subscribe(res => {
      console.log('cats',res);
      this.categories = res.categories ;
    })
  }
  categoryBar(event) {
    if (event.detail.value === 'All') {
      // do nothing
      this.meals = this.unfilteredMeal;
    }else {
      this.searchTerm = event.detail.value ;
      this.setFilteredItems();
      
    }
  }
   // handle searchbar 
   setFilteredItems(){
    if(this.searchTerm != null || this.searchTerm != ''){
      this.meals = this.filterItems()
      console.log(this.meals)
    }
  }
  filterItems() {
    return this.unfilteredMeal.filter(item => {
      return item.category.toLowerCase().indexOf(this.searchTerm.toLowerCase()) > -1;
    });
  }
  seeDetails(item){
    let navigationExtras: NavigationExtras = {
      queryParams: item
    };
    this.service.hiddenTabs = true ;
    this.navCtrl.navigate(['tabs/details'], navigationExtras);
  }
 
}
