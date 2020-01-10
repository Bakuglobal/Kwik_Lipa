import { Component, AfterViewInit, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Shops } from '../models/shops';
import { FirestoreService } from '../services/firestore.service';
import 'rxjs/add/operator/map';
import 'rxjs/Rx';
import { map } from 'rxjs/operators';
import { User } from '../models/user';
// import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
// import { AdMobFree, AdMobFreeBannerConfig, AdMobFreeInterstitialConfig } from '@ionic-native/admob-free/ngx';
import { Router } from '@angular/router';        
import { DatabaseService } from '../services/database.service' ;
import { Platform, IonContent } from '@ionic/angular';                                      
import {
  AlertController,
  ToastController,
  LoadingController,
  MenuController
} from '@ionic/angular';
// import { Products } from '../models/products';
import { Network } from '@ionic-native/network/ngx';
import { AngularFireAuth } from '@angular/fire/auth';
import { IonSlides } from '@ionic/angular';


@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page  implements OnInit{
  @ViewChild('picSlider',  {static: false}) viewer: IonSlides;
  @ViewChild(IonContent, {static: false}) content: IonContent;
  showSearch = false;

  shops: Shops[];
  unfilteredShops: Shops[] ;
  searchTerm: string ;

  scannedProdcts = [];

  users: User = new User();

  loading: any;

  userShopId: any;

  pid: any ;

  Disconnected = false ;
  backButtonSubscription ;
  header: boolean;
  tabbar: boolean;
  selectShop = false ;
  constructor(
    private platform: Platform,
    public fireApi: FirestoreService,
    public loadingController: LoadingController,
    public toastController: ToastController,
    public alertCtrl: AlertController,
    // private barcodeScanner: BarcodeScanner,
    // private admobFree: AdMobFree,
    public navCtrl: Router,
    public database: DatabaseService,
    private network :Network,
    public menuCtrl: MenuController,
    public service: FirestoreService,
    public fauth: AngularFireAuth
    
  ) {

    
    this.network.onDisconnect().subscribe(()=>{
      this.Disconnected = true ;

    });
    this.network.onConnect().subscribe(()=>{
        setTimeout(()=>
        {
          //this.msgNetwork();
          this.Disconnected = false ;
        },2000);
    }); 
    this.service.hiddenTabs = false ;
  }
  
  onScroll(event){
    if(event.detail.scrollTop == 0){
      this.service.hiddenTabs = false ;
      console.log("00000000")
    }else{
    if (event.detail.scrollTop > 30) {
      console.log(">>>> 30");
      this.service.hiddenTabs = true ;
    } else {
      this.service.hiddenTabs = false ;
    }
  }
  }
  onIonViewDidLoad(){
    this.selectShop = false ;
  }

  slideOpts = {
    initialSlide: 1,
    speed: 500,
    autoplay:true
  };

  back(){
    this.selectShop = false ;
  }

  onSlideMoved(event) {
    /** isEnd true when slides reach at end slide */
    event.target.isEnd().then(isEnd => {
      console.log('End of slide', isEnd);
    });

    event.target.isBeginning().then((istrue) => {
      console.log('End of slide', istrue);
    });
  }
  
  ngOnInit() {
    this.getShops();
    this.menuCtrl.enable(true);
  }
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

 
  scanAndPay(){
    this.fireApi.shareShopBy('scan');
    this.selectShop = true ;
    
  }
  pickPayCollect(){
    this.fireApi.shareShopBy('pick');
    this.selectShop = true ;
    
  }
  shoppingList(){
    this.navCtrl.navigate(['mycontacts'])
  }

async msgNetwork(){
  let msg = await this.alertCtrl.create({
    header: 'Network check',
    message: 'You are connected via'+' ' +this.network.type +' '+'Network',
    buttons: [
      {
        text: 'close',
        role: 'cancel'
      }
    ]
  });
  await msg.present();
}



//redirect to shop page
goToShop(shop){
  this.fireApi.changeData(shop.name);
  this.service.hiddenTabs = true ;
  this.fireApi.serviceshopBy
      .subscribe(data => {
        console.log('shopBy -- ' + data)
        if(data == 'scan'){
          this.navCtrl.navigate(['tabs/shop']);
        }else {
          if(data == 'pick'){
            this.navCtrl.navigate(['tabs/offers']);
          }
        }
      }); 
}

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

    this.fireApi.getCurrentUser().then(results => {
      this.fireApi
        .getUserDetails(results.uid)
        .snapshotChanges()
        .pipe(map(changes => {
          return changes.map(c => ({ key: c.payload.key, ...c.payload.val() }));
        }))
        .subscribe(user => {
          this.showData(user);
        });
    });

    
  }

  showData2(products) {
    products.forEach(element => {
      this.scannedProdcts.push(element);
    });
    console.log(this.scannedProdcts)
  }

  showData(data) {
    this.userShopId = data[0].shop;
  }

  // Loader
  async presentLoading() {
    this.loading = await this.loadingController.create({
      message: 'Wait ...'
    });
    return await this.loading.present();
  }

  // Toaster
  async presentToast(data) {
    const toast = await this.toastController.create({
      message: data,
      position: 'middle',
      duration: 1000
    });
    toast.present();
  }
  //  notifications page


  notifications(){
    this.navCtrl.navigate(['tabs/notifications']);
  }


  show(){
    if(this.showSearch == false){
      this.showSearch = true;
    }else{
      this.showSearch = false ;
    }
  }
}


