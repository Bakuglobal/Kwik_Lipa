import { Component, AfterViewInit, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Shops } from '../models/shops';
import { FirestoreService } from '../services/firestore.service';
import 'rxjs/add/operator/map';
import 'rxjs/Rx';
import { map } from 'rxjs/operators';
import { User } from '../models/user';
import { Router } from '@angular/router';        
import { DatabaseService } from '../services/database.service' ;
import { Platform, IonContent } from '@ionic/angular';                                      
import { AlertController,ToastController,LoadingController,MenuController } from '@ionic/angular';
import { Network } from '@ionic-native/network/ngx';
import { AngularFireAuth } from '@angular/fire/auth';
import { IonSlides } from '@ionic/angular';


@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page  implements OnInit{
  // Views

      @ViewChild('picSlider',  {static: false}) viewer: IonSlides;
      @ViewChild(IonContent, {static: false}) content: IonContent;

  // Variables
        count = 0 ;
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
        showSearch = false ;

  constructor(
          private platform: Platform,
          public fireApi: FirestoreService,
          public loadingController: LoadingController,
          public toastController: ToastController,
          public alertCtrl: AlertController,
          public navCtrl: Router,
          public database: DatabaseService,
          private network :Network,
          public menuCtrl: MenuController,
          public service: FirestoreService,
          public fauth: AngularFireAuth
    
  ) {

    //check if offline
          this.network.onDisconnect().subscribe(()=>{
            this.Disconnected = true ;

          });

    //check if online
          this.network.onConnect().subscribe(()=>{
              setTimeout(()=>
              {
                //this.msgNetwork();
                this.Disconnected = false ;
              },2000);
          }); 
    // hide bottom tabs
        this.service.hiddenTabs = false ;

  }
 
          onIonViewDidLoad(){
            this.selectShop = false ;
          }

          slideOpts = {
            initialSlide: 1,
            speed: 500,
            autoplay:true
          };
// to home page view
          back(){
            this.selectShop = false ;
          }
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
              this.getShops();
              this.menuCtrl.enable(true);
              this.count = Number(localStorage.getItem('NoticeCount'));
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

//scan and pay     
            scanAndPay(){
              this.fireApi.shareShopBy('scan');
              this.selectShop = true ;
              
            }
// pickpay and collect
            pickPayCollect(){
              this.fireApi.shareShopBy('pick');
              this.selectShop = true ;
              
            }
// goto shoppinglist page
            shoppingList(){
              this.navCtrl.navigate(['mycontacts'])
            }
// an alert for network info
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
          notifications(){
            this.navCtrl.navigate(['tabs/notifications']);
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


