import { Component, AfterViewInit, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Shops } from '../models/shops';
import { FirestoreService } from '../services/firestore.service';
import 'rxjs/add/operator/map';
import 'rxjs/Rx';
import { map } from 'rxjs/operators';
import { User } from '../models/user';
import { Router } from '@angular/router';
import { DatabaseService } from '../services/database.service';
import { Platform, IonContent, ModalController } from '@ionic/angular';
import { AlertController, ToastController, LoadingController, MenuController } from '@ionic/angular';
import { Network } from '@ionic-native/network/ngx';
import { AngularFireAuth } from '@angular/fire/auth';
import { IonSlides } from '@ionic/angular';
import { DiscountmodalPage } from '../discountmodal/discountmodal.page';


@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit {
  // Views

  @ViewChild('picSlider', { static: false }) viewer: IonSlides;
  @ViewChild(IonContent, { static: false }) content: IonContent;

  // Variables
  count = false;
  shops: Shops[];
  unfilteredShops: Shops[];

  scannedProdcts = [];
  users: User = new User();
  loading: any;
  userShopId: any;
  pid: any;
  Disconnected = false;
  backButtonSubscription;
  header: boolean;
  tabbar: boolean;
  selectShop = false;
  discontedProducts = [] ;
  heading = false ;
  Name = '' ;
  featuredProducts = [] ;


  constructor(
    private platform: Platform,
    public fireApi: FirestoreService,
    public loadingController: LoadingController,
    public toastController: ToastController,
    public alertCtrl: AlertController,
    public navCtrl: Router,
    public database: DatabaseService,
    private network: Network,
    public menuCtrl: MenuController,
    public service: FirestoreService,
    public fauth: AngularFireAuth,
    public modal: ModalController

  ) {

    this.Name = localStorage.getItem('Name');
    //check if offline
    this.network.onDisconnect().subscribe(() => {
      this.Disconnected = true;

    });

    //check if online
    this.network.onConnect().subscribe(() => {
      setTimeout(() => {
        //this.msgNetwork();
        this.Disconnected = false;
      }, 2000);
    });
    // hide bottom tabs
    this.service.hiddenTabs = false;

  }
  onScroll(event){
    if(event.detail.scrollTop == 0){
      this.service.hiddenTabs = false ;
      this.heading = false ;
      console.log("00000000")
    }else{
    if (event.detail.scrollTop > 30) {
      console.log(">>>> 30");
      this.service.hiddenTabs = true ;
      this.heading = true ;
    } else {
      this.service.hiddenTabs = false ;
    }
  }
  }
  ionViewWillEnter(){
    // get discounted products
    this.database.getdiscountedProducts().subscribe(res => {
      this.discontedProducts = res ;
      console.log(res);
    });
    // get featured products 
    this.database.getFeaturedProducts().subscribe(res => {
      this.featuredProducts = res ;
      console.log(res);
    })
  }

  onIonViewDidLoad() {
    this.selectShop = false;
  }
  gotoShop(shop){
    this.fireApi.changeData(shop);
    this.navCtrl.navigate(['tabs/offers']);
  }
  AdvertslideOpts = {
    initialSlide: 1,
    speed: 500,
    autoplay: true,
    slidesPerView: 1
  };
  DiscountslideOpts = {
    initialSlide: 0,
    speed: 500,
    autoplay: false,
    slidesPerView: 1
  };

  // handle slide swipe

  onSlideMoved(event) {
    /** isEnd true when slides reach at end slide */
    event.target.isEnd().then(isEnd => {
      console.log('End of slide', isEnd);
    });

    event.target.isBeginning().then((istrue) => {
      console.log('End of slide', istrue);
    });
  }
  // oninit function                
  ngOnInit() {
    this.menuCtrl.enable(true);
    // this.count = Number(localStorage.getItem('NoticeCount'));
  }



  //scan and pay     
  scanAndPay() {
    this.fireApi.shareShopBy('scan');
    this.navCtrl.navigate(['tabs/selectshop']);
  }
  // pickpay and collect
  pickPayCollect() {
    this.fireApi.shareShopBy('pick');
    this.navCtrl.navigate(['tabs/selectshop']);
  }
  // goto shoppinglist page
  shoppingList() {
    this.fireApi.hiddenTabs = true;
    this.navCtrl.navigate(['tabs/mycontacts'])
  }
  // an alert for network info
  async msgNetwork() {
    let msg = await this.alertCtrl.create({
      header: 'Network check',
      message: 'You are connected via' + ' ' + this.network.type + ' ' + 'Network',
      buttons: [
        {
          text: 'close',
          role: 'cancel'
        }
      ]
    });
    await msg.present();
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

  // notifications page
  notifications() {
    this.navCtrl.navigate(['tabs/notifications']);
  }

  async  gotoDiscountModal(item) {
    const mod = await this.modal.create({
      component: DiscountmodalPage,
      componentProps: item
    });
    console.log(item);
    await mod.present();
  }
}


