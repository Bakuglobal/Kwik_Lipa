import { Component, OnInit } from '@angular/core';
import { Router , NavigationExtras , ActivatedRoute} from '@angular/router';
import { FirestoreService } from '../services/firestore.service';
import { AlertController } from '@ionic/angular';
// import { AdMobFree } from '@ionic-native/admob-free/ngx';

@Component({
  selector: 'app-offers',
  templateUrl: './offers.page.html',
  styleUrls: ['./offers.page.scss'],
})
export class OffersPage implements OnInit {


  shopSelected: any ;

  constructor(
    public fireApi: FirestoreService,
    public navCtrl: Router,
    public alertCtrl: AlertController,
    // private admobFree: AdMobFree
  ) {}

  ngOnInit() {
    this.showShop();
    //this.removeBannerAd();
  }

  // removeBannerAd(){
  //   this.admobFree.banner.remove();
  // }


async openPrompt(){
  let prompt = await this.alertCtrl.create({
    header:'********HURRY********',
    message:'Visit the Shop Today and buy at this price',
    buttons: [
      {
        text:'Close',
        role:'cancel'
      }
    ]
  });
  await prompt.present();

}
  shop(){
    this.navCtrl.navigate(['tabs/shop']);
  }

  showShop(){
    this.fireApi.serviceData
      .subscribe(data => (this.shopSelected = data));
    console.log("sent data from home page : ", this.shopSelected);
  }
}
