import { Component, OnInit } from '@angular/core';
import { FirestoreService } from '../services/firestore.service';
import { map } from 'rxjs/operators';
import { DatabaseService } from '../services/database.service';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { DiscountmodalPage } from '../discountmodal/discountmodal.page';

@Component({
  selector: 'app-recommend',
  templateUrl: './recommend.page.html',
  styleUrls: ['./recommend.page.scss'],
})
export class RecommendPage implements OnInit {
  date: number;
  shops = [];
  discontedProducts = [];
  budget;
  name;
  greeting = '';

  slideme = {
    initialSlide: 0,
    speed: 500,
    autoplay: false,
    slidesPerView: 1.7
  }

  constructor(
    private fireApi: FirestoreService,
    private database: DatabaseService,
    private location: Location,
    private navCtrl: Router,
    private modal: ModalController


  ) {
    // get discounted products
    this.database.getdiscountedProducts().subscribe(res => {
      this.discontedProducts = res;
      console.log(res);
    });
    this.date = new Date().getHours();
    this.name = localStorage.getItem('Name');
    this.fireApi.hiddenTabs = true;
    this.budget = this.fireApi.getBudget();
    console.log('your budget', this.budget);
    this.getGreeting();
    console.log(this.greeting);

  }

  ngOnInit() {
    this.getShops();
  }
  viewAll() {

  }
  getGreeting() {
    if (this.date >= 1 && this.date <= 12) {
      // say morning
      this.greeting = 'Morning';
      return;
    }
    if (this.date >= 13 && this.date <= 15) {
      // say morning
      this.greeting = 'Afternoon';
      return;
    }
    if (this.date >= 6 && this.date <= 12) {
      // say morning
      this.greeting = 'Evening';
      return;
    }
  }
  async gotoDiscountModal(item) {
    const md = await this.modal.create({
      component: DiscountmodalPage,
      componentProps: item
    });
    await md.present();
  }
  getShops() {
    this.fireApi.getShops().subscribe(res => {
      this.shops = res ;
    });
    // this.fireApi
    //   .getShops()
    //   .snapshotChanges()
    //   .pipe(map(changes => {
    //     return changes.map(c => ({ key: c.payload.key, ...c.payload.val() }));
    //   }))
    //   .subscribe(shops => {
    //     this.shops = shops;
    //     console.log(this.shops);
    //   });

  }
  selectShop(shop) {

  }
  back() {
    this.location.back();
  }
  goToShop() {
    this.navCtrl.navigate(['tabs/selectshop']);
  }


}
