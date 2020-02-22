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
import { Shops } from './models/shops';
import { IonRouterOutlet } from '@ionic/angular';
import * as $ from "jquery";
import { Keyboard } from '@ionic-native/keyboard/ngx';;
import { AngularFirestore } from '@angular/fire/firestore';
// import { OneSignal } from '@ionic-native/onesignal/ngx';
import { OneSignalService } from './OneSignal/one-signal.service';
import { FCM } from '@ionic-native/fcm/ngx';
import { NotificationsPage } from './notifications/notifications.page';
import { Body } from '@angular/http/src/body';


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
      title: 'Shops',
      url: '/tabs/selectshop',
      icon: 'basket',
    },
    {
      title: 'Customer Care',
      url: '/tabs/support',
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
          // private oneSignal: OneSignal,
          private notice: OneSignalService,
          private keyboard: Keyboard,
          private fcm: FCM,
  ) {

      // Initiliaze APP

          this.initializeApp();

      // check if userID exists in storage

          if(localStorage.getItem('userID') != null){
            let id = localStorage.getItem('userID');
            this.getDetails(id);
          }

          if(this.platform.is('android')){
            this.keyboard.onKeyboardShow().subscribe((e) => {
              const offset = $(document.activeElement).offset().top;
              let height = (offset - e.keyboardHeight)*-1;
              height = height > 0 ? 0 : height;      
              $('body').animate({ 'marginTop': height + 'px' }, 100);
            });
            this.keyboard.onKeyboardHide().subscribe(e => {
              $('body').animate({ 'marginTop': 0 + 'px' }, 100);
            });
          
          }
   
  } 
  
  //
  

  // GO to login page

          login(){
            this.menu.close();
            this.routerCtrl.navigate(['tabs/login']);
          }
  //Get user profile details from firestore

          getDetails(id){
            this.database.collection('users').doc(id).valueChanges().subscribe(res =>{
              this.User = res ;
              localStorage.setItem('email',this.User.email);
              localStorage.setItem('Name',this.User.firstName);
              localStorage.setItem('Number',this.User.phone);
              this.show = true ;
            })
          }
//initialize app

            initializeApp() {
              this.platform.ready().then(() => {
                //
                if (this.platform.is('android')) {
                  this.statusBar.backgroundColorByHexString("#00ade5");

                  this.fcm.getToken().then(token => {
                    console.log('fcm - token'+token);
                    this.notice.setToken(token);
                    if(localStorage.getItem('userID') !== undefined){
                      this.notice.sendTokenToFirebase(localStorage.getItem('userID'));
                    }
                  });
                  this.fcm.onTokenRefresh().subscribe(token => {
                    console.log('fcm -token'+token);
                    this.notice.setToken(token);
                    if(localStorage.getItem('userID') !== undefined){
                      this.notice.sendTokenToFirebase(localStorage.getItem('userID'));
                    }
                  });
                  //  get notifications
                  this.fcm.onNotification().subscribe(data => {
                    console.log(data);
                    if (data.wasTapped) {
                      console.log('Received in background', data);
                      // this.navCtrl.navigate([data.landing_page, data.price]);
                      this.service.showNotice(true);
                      this.saveNoticeTofirebase(data);
                      this.viewNotice();
                    } else {
                      console.log('Received in foreground', data);
                      // this.navCtrl.navigate([data.landing_page, data.price]);
                      this.service.showNotice(true);
                      this.showAlert(data);
                    }
                  });
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

// view notices 
async viewNotice(){
  this.routerCtrl.navigate(['tabs/notifications']);
}
async showAlert(data){
  const alert = await this.alertCtrl.create({
    header: data.title,
    message: data.body,
    buttons: [
      {
        text: 'View',
        handler: () => {
          this.saveNoticeTofirebase(data);
          this.viewNotice();
        }
      },
      {
        text: 'Close',
        handler: () => {
          this.saveNoticeTofirebase(data); 
        }
      }
    ],
    cssClass: 'alert'
  });
  await alert.present();
}
saveNoticeTofirebase(data){
  let notice = {
    message: data.body,
    Date: Date(),
    title: data.title,
    userID: localStorage.getItem('userID')
  }
  this.database.collection('Notifications').add(notice).catch(err => console.log(err));
}

                    
}
