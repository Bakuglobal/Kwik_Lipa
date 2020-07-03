import { Component, AfterViewInit, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Shops, Shop } from '../models/shops';
import { FirestoreService } from '../services/firestore.service';
import 'rxjs/add/operator/map';
import 'rxjs/Rx';
import { User } from '../models/user';
import { Router, NavigationExtras } from '@angular/router';
import { DatabaseService } from '../services/database.service';
import { Platform, IonContent, ModalController, IonSearchbar } from '@ionic/angular';
import { AlertController, ToastController, LoadingController, MenuController } from '@ionic/angular';
import { Network } from '@ionic-native/network/ngx';
import { AngularFireAuth } from '@angular/fire/auth';
import { IonSlides } from '@ionic/angular';
import { DiscountmodalPage } from '../discountmodal/discountmodal.page';
import { Badge } from '@ionic-native/badge/ngx';
import { ADs } from '../models/ads';
import { ShuffleService } from '../services/shuffle.service';
import { YoutubeVideoPlayer } from '@ionic-native/youtube-video-player/ngx';



@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  encapsulation: ViewEncapsulation.None
})
export class Tab1Page implements OnInit {
  // Views

  @ViewChild('picSlider', { static: false }) viewer: IonSlides;
  @ViewChild(IonContent, { static: false }) content: IonContent;
  @ViewChild('IonSearchbar', { static: false }) myInput: IonSearchbar;
  // Variables
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
  discontedProducts = [];
  heading = false;
  Name = '';
  featuredProducts = [];
  skeleton = [1, 2, 3, 4, 5];
  slideme = {
    initialSlide: 0,
    speed: 500,
    autoplay: true,
    slidesPerView: 1.7,
  }
  resultSliders = {
    initialSlide: 0,
    speed: 500,
    autoplay: true,
    slidesPerView: 3,
  }
  ads: ADs[];
  poster: any;
  searchBar = false;
  restAd: any[];
  Restaurants: any[];
  searchTerm: string;
  FoodResults = [];
  ShopResults = [];
  VideoResults = [];
  ProductsResults = [];
  RestaurantsResults = []
  hideGuide = false;
  stopSpinner = true;

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
    public modal: ModalController,
    public badge: Badge,
    private searchFn: ShuffleService,
    private youtube: YoutubeVideoPlayer,

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
    // this.playVideoHosted();

    this.searchFn.getShops();
    // this.searchFn.createProductPool();
    this.searchFn.getRestaurants();
    this.searchFn.getAllvideos();
  }
  onScroll(event) {
    if (event.detail.scrollTop == 0) {
      this.service.hiddenTabs = false;
      this.heading = false;
      console.log("00000000")
    } else {
      if (event.detail.scrollTop > 30) {
        console.log(">>>> 30");
        this.service.hiddenTabs = true;
        this.heading = true;
      } else {
        this.service.hiddenTabs = false;
      }
    }
  }
  ionViewWillEnter() {
    this.getAds();
    // get discounted products
    this.database.getdiscountedProducts().subscribe(res => {
      this.discontedProducts = res;
      console.log(res);
    });
    // get featured products 
    this.database.getFeaturedProducts().subscribe(res => {
      this.featuredProducts = res;
      console.log(res);
    })
    // check for unread notices
    this.getShops();
    this.getDonationPoster();
    this.getRestaurantAds();
    this.getRestaurants();
  }

  onIonViewDidLoad() {
    this.selectShop = false;
  }
  clearSearchResults(){
    this.FoodResults = [];
    this.ProductsResults = [];
    this.VideoResults = [];
    this.ShopResults = [];
    this.RestaurantsResults = [];
  }
  startSearch() {
    if (this.searchTerm === undefined || this.searchTerm.length === 0) { 
     this.clearSearchResults();
      return ;
     }
    this.stopSpinner = false;
    // get food results
    this.FoodResults = this.searchFn.searchFood(this.searchTerm);
    // get shops results
    this.ShopResults = this.searchFn.ShopSearch(this.searchTerm);
    // get videos results
    this.VideoResults = this.searchFn.searchVideo(this.searchTerm);
    // get products results
    this.ProductsResults = this.searchFn.searchProduct(this.searchTerm);
    // get restaurant results
    this.RestaurantsResults = this.searchFn.searchRestaurant(this.searchTerm);

    console.table(this.searchFn.searchFood(this.searchTerm));
    console.table(this.searchFn.ShopSearch(this.searchTerm));
    console.table(this.searchFn.searchVideo(this.searchTerm));
    console.table(this.searchFn.searchProduct(this.searchTerm));
    console.table(this.searchFn.searchRestaurant(this.searchTerm));

    if (this.FoodResults.length > 0 || this.ShopResults.length > 0 || this.VideoResults.length > 0 || this.ProductsResults.length > 0 || this.RestaurantsResults.length > 0) {
      this.hideGuide = true;
      this.stopSpinner = true;
    }
  }
  getRestaurantAds() {
    this.service.getFoodAds().subscribe(res => {
      this.restAd = res;
      console.log(this.restAd);
    })
  }
  getRestaurants() {
    this.service.getRest().subscribe(res => {
      console.log('restaurants', res);
      this.Restaurants = res;
    }, error => { console.log(error) });
  }
  posterToRest(shop) {
    // this.service.changeData(shop);
    let dt = this.filterRest(shop);
    console.log('params', dt);
    let navigationExtras: NavigationExtras = {
      queryParams: dt[0]
    };
    this.fireApi.hiddenTabs = true;
    this.navCtrl.navigate(['tabs/profile'], navigationExtras);
  }
  filterRest(shop) {
    return this.Restaurants.filter(item => {
      return item.Restaurant.toLowerCase().indexOf(shop.toLowerCase()) > -1;
    });
  }
  seeDetails(item){
    let navigationExtras: NavigationExtras = {
      queryParams: item
    };
    this.service.hiddenTabs = true ;
    this.navCtrl.navigate(['tabs/details'], navigationExtras);
  }
  openMyVideo(id){
    this.youtube.openVideo(id);
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
  goToRest(rest) {
    this.service.changeData(rest.Restaurant);
    let navigationExtras: NavigationExtras = {
      queryParams: rest
    };
    this.service.hiddenTabs = true;
    this.navCtrl.navigate(['tabs/profile'], navigationExtras);
  }
  getDonationPoster() {
    this.fireApi.getPoster().subscribe(res => {
      this.poster = res;
      console.log('poster', this.poster);
    })
  }
  goToSoko() {
    this.service.hiddenTabs = true;
    this.navCtrl.navigate(['tabs/tab3']);
  }
  gotoRecipes() {
    this.navCtrl.navigate(['tabs/recipes']);
  }
  posterToShop(shop) {
    this.fireApi.changeData(shop);
    let dt = this.filterItems(shop);
    console.log('params', dt);
    let navigationExtras: NavigationExtras = {
      queryParams: dt[0]
    };
    this.navCtrl.navigate(['tabs/shopprofile'], navigationExtras);
  }
  filterItems(shop) {
    return this.shops.filter(item => {
      return item.shop.toLowerCase().indexOf(shop.toLowerCase()) > -1;
    });
  }

  gotoShop(shop) {
    this.fireApi.changeData(shop.shop);
    let navigationExtras: NavigationExtras = {
      queryParams: shop
    };
    this.navCtrl.navigate(['tabs/shopprofile'], navigationExtras);
  }
  shopProducts(shop) {
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
  Delivery() {
    this.fireApi.hiddenTabs = true;
    this.fireApi.shareShopBy('delivery');
    this.navCtrl.navigate(['tabs/selectshop']);
  }
  shoppingList() {
    this.navCtrl.navigate(['tabs/mycontacts']);
  }
  goToselectShop() {
    this.service.hiddenTabs = true;
    this.navCtrl.navigate(['tabs/selectshop']);
  }
  goToRestaurants() {
    this.navCtrl.navigate(['tabs/restaurants']);
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


  search() {

    this.searchBar = !this.searchBar;
    // this.myInput.setFocus();
    this.fireApi.hiddenTabs = !this.fireApi.hiddenTabs;
    if (this.searchBar === false) {
      this.searchTerm = '';
      this.clearSearchResults();
    }
  }

  async gotoDiscountModal(item) {
    if (item.barcode === undefined) {
      item.barcode = '';
    }
    const mod = await this.modal.create({
      component: DiscountmodalPage,
      componentProps: item
    });
    console.log(item);
    await mod.present();
  }

  getAds() {
    this.fireApi.getAds().subscribe(res => {
      this.ads = res;
      console.log('ADS', this.ads)
    });
  }
  getShops() {
    console.log('==========')
    this.fireApi.getShops().valueChanges()
      .subscribe(res => {
        this.shops = res;
        this.unfilteredShops = res;
        console.log('shops', this.shops);
      });
  }
  goToLifestyle() {
    this.service.hiddenTabs = true;
    this.navCtrl.navigate(['tabs/lifestyle']);
  }


}


