import { Component, ViewChildren, QueryList } from '@angular/core';
import {
  Platform,
  MenuController,
  PopoverController,
  ActionSheetController,
  ModalController,
  ToastController,
  Events,
  AlertController
} from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { FirestoreService } from './services/firestore.service';
import { Router } from '@angular/router';
import { User } from './models/user';
import {
  DeviceOrientation,
  DeviceOrientationCompassHeading
} from '@ionic-native/device-orientation/ngx';
import { FileUpload } from './models/upload';
import { Shops } from './models/shops';
import { IonRouterOutlet } from '@ionic/angular';
import { viewClassName } from '@angular/compiler';
import { Network } from '@ionic-native/network/ngx';
import { timer } from 'rxjs';
import { AngularFireDatabase } from '@angular/fire/database';
import { AngularFirestore } from '@angular/fire/firestore';
import { OneSignal } from '@ionic-native/onesignal/ngx';
import { OneSignalService } from './OneSignal/one-signal.service';



@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {
  public appPages = [
    {
      title: 'My Account',
      url: '/tabs/settings',
      icon: 'person',
      active: false
    },
    {
      title: 'Loyalty Points',
      url: '/tabs/wallet',
      icon: 'card',
      active: false
    },
    {
      title: 'My Orders',
      url: '/tabs/transactions',
      icon: 'pulse',
      active: false
    },
    {
      title: 'Shopping List',
      url: '/tabs/mycontacts',
      icon: 'list-box',
      active: false
    },
    {
    title: 'My Credits',
    url: '/tabs/mycredits',
    icon: 'cash',
    active: false
    },
    {
      title: 'Shops',
      url: '/tabs',
      icon: 'basket',
      active: false
    },
    {
      title: 'Customer Care',
      url: '/support',
      icon: 'chatbubbles',
      active: false
    },
    {
      title: 'How it Works',
      url: '/tabs/about',
      icon: 'help',
      active: false
    }
  ];

  selectedFiles: FileList;
  currentFileUpload: FileUpload;
  progress: { percentage: number } = { percentage: 0 };

  lastTimeBackPress = 0;
  timePeriodToExit = 2000;
  showSplash = true ;

  @ViewChildren(IonRouterOutlet) routerOutlets: QueryList<IonRouterOutlet>;

  userID ;
  userProfile  = {
    "name": localStorage.getItem('userName'),
    "email" : localStorage.getItem('userEmail')
  };
 User: User ;
 public  show  =  false;

  
  
  constructor(
          private platform: Platform,
          private splashScreen: SplashScreen,
          private statusBar: StatusBar,
          private fireApi: FirestoreService,
          public menuCtrl: MenuController,
          private menu: MenuController,
          public routerCtrl: Router,
          public alertCtrl: AlertController,
          private deviceOrientation: DeviceOrientation,
          private actionSheetCtrl: ActionSheetController,
          private popoverCtrl: PopoverController,
          private modalCtrl: ModalController,
          private toast: ToastController,
          public events: Events,
          public service: FirestoreService,
          public database: AngularFirestore,
          private oneSignal: OneSignal,
          private notice: OneSignalService
  ) {

      // Initiliaze APP

          this.initializeApp();

      // check if userID exists in storage

          if(localStorage.getItem('UserID') != null){
            let id = localStorage.getItem('UserID');
            this.getDetails(id);
          }
   
  }

  // GO to login page

          login(){
            this.menu.close();
            this.routerCtrl.navigate(['tabs/login']);
          }
  //Get user profile details from firestore

          getDetails(id){
            this.database.collection('users').doc(id).valueChanges().subscribe(res =>{
              this.User = res ;
              this.show = true ;
            })
          }
//initialize app

            initializeApp() {
              this.platform.ready().then(() => {
                //
                if (this.platform.is('android')) {
                  this.statusBar.backgroundColorByHexString("#33000000");
                  // this.setupPush();
                }else{
                  
                  if (this.platform.is('cordova')) {
                    // this.setupPush();
                  }
                }
                this.statusBar.styleDefault();
                this.statusBar.hide() ;
              });
              

              

              //HIDE BOTTOM BANNER AD

              this.platform.backButton.subscribe(async () => {
                // close action sheet
                try {
                  const element = await this.actionSheetCtrl.getTop();
                  if (element) {
                    element.dismiss();
                    return;
                  }
                } catch (error) { }

                // close popover
                try {
                  const element = await this.popoverCtrl.getTop();
                  if (element) {
                    element.dismiss();
                    return;
                  }
                } catch (error) { }

                // close modal
                try {
                  const element = await this.modalCtrl.getTop();
                  if (element) {
                    element.dismiss();
                    return;
                  }
                } catch (error) {
                  console.log(error);
                }

                // close side menu
                try {
                  const element = await this.menu.getOpen();
                  if (element !== null) {
                    this.menu.close();
                    return;
                  }
                } catch (error) { }

                this.routerOutlets.forEach(async (outlet: IonRouterOutlet) => {
                  if (outlet && outlet.canGoBack()) {
                    outlet.pop();
                  } else if (this.routerCtrl.url === '/tabs') {
                    if (
                      new Date().getTime() - this.lastTimeBackPress <
                      this.timePeriodToExit
                    ) {
                      // this.platform.exitApp(); // Exit from app
                      this.service.hiddenTabs = true ;
                      navigator['app'].exitApp(); // work for ionic 4
                    } else {
                      const toast = await this.toast.create({
                        message: 'Press back again to exit App.',
                        duration: 3000
                      });
                      toast.present();
                      this.lastTimeBackPress = new Date().getTime();
                    }
                  }
                });
              });
              
            }
 // open page on click an item in the side menu
          public openPage(page) {
            this.menuCtrl.close();
            page.active = !page.active; 
            this.routerCtrl.navigate([page.url]);
            
          }

 
// Go to a page
          navigate(url) {
            this.menuCtrl.close();
            this.routerCtrl.navigate([url]);
          }
// log out of the app
          logout() {
            this.menuCtrl.close();
            localStorage.clear();
            this.fireApi.logout();
          }



                    
}
