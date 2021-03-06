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
} from '@ionic-native/device-orientation/ngx';
import { IonRouterOutlet } from '@ionic/angular';
import * as $ from "jquery";
import { Keyboard } from '@ionic-native/keyboard/ngx';;
import { AngularFirestore } from '@angular/fire/firestore';
// import { OneSignal } from '@ionic-native/onesignal/ngx';
import { OneSignalService } from './OneSignal/one-signal.service';
import { FCM } from '@ionic-native/fcm/ngx';
import { Badge } from '@ionic-native/badge/ngx';
import { app } from 'firebase';
import { Location } from '@angular/common';


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {
  public appPages = [
    {
      title: 'My Account',
      url: '/tabs/profile',
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
      url: '/tabs/shoppinglist',
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
  showSplash = true;
  data = [];

  @ViewChildren(IonRouterOutlet) routerOutlets: QueryList<IonRouterOutlet>;

  userID;
  userProfile = {
    "name": localStorage.getItem('userName'),
    "email": localStorage.getItem('userEmail')
  };
  User: User;
  public show = false;



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
    private badge: Badge,
    private location: Location
  ) {

    // Initiliaze APP

    this.initializeApp();

    // check if userID exists in storage

    if (localStorage.getItem('userID') != null) {
      let id = localStorage.getItem('userID');
      this.getDetails(id);
      this.unreadNotices(id);
    } else {
      localStorage.setItem('noticeCount', '0');
      let unreadNotice = Number(localStorage.getItem('noticeCount'));
      this.service.showNotice(unreadNotice);
    }

    if (this.platform.is('android')) {
      this.keyboard.onKeyboardShow().subscribe((e) => {
        const offset = $(document.activeElement).offset().top;
        let height = (offset - e.keyboardHeight) * -1;
        height = height > 0 ? 0 : height;
        $('body').animate({ 'marginTop': height + 'px' }, 100);
      });
      this.keyboard.onKeyboardHide().subscribe(e => {
        $('body').animate({ 'marginTop': 0 + 'px' }, 100);
      });

    }


  }

  // GO to login page

  login() {
    this.menu.close();
    this.routerCtrl.navigate(['tabs/login']);
  }

  //Get user profile details from firestore

  getDetails(id) {
    this.database.collection('users').doc(id).valueChanges().subscribe(res => {
      this.User = res;
      localStorage.setItem('email', this.User.email);
      localStorage.setItem('Name', this.User.firstName);
      localStorage.setItem('Number', this.User.phone);
      this.show = true;
    })
  }
  //initialize app

  initializeApp() {
    this.platform.ready().then(() => {
      //
      if (this.platform.is('android')) {
        this.statusBar.backgroundColorByHexString("#00ade5");

        this.fcm.getToken().then(token => {
          console.log('fcm - token' + token);
          this.notice.setToken(token);
          if (localStorage.getItem('userID') !== undefined) {
            this.notice.sendTokenToFirebase(localStorage.getItem('userID'));
          }
        });
        this.fcm.onTokenRefresh().subscribe(token => {
          console.log('fcm -token' + token);
          this.notice.setToken(token);
          if (localStorage.getItem('userID') !== undefined) {
            this.notice.sendTokenToFirebase(localStorage.getItem('userID'));
          }
        });
        //  get notifications
        this.fcm.onNotification().subscribe(data => {
          console.log(data);
          if (data.wasTapped) {
            console.log('Received in background', data);
            let unreadNotice = Number(localStorage.getItem('noticeCount'));
            this.service.showNotice(unreadNotice + 1);
            this.badge.increase(1);
            this.routerCtrl.navigate(['tabs/notifications'])
          } else {
            console.log('Received in foreground', data);
            let unreadNotice = Number(localStorage.getItem('noticeCount'));
            this.service.showNotice(unreadNotice + 1);
            this.badge.increase(1);
          }
        });
      }
      this.statusBar.styleDefault();
      this.statusBar.hide();
    });
    //  back button
    this.backButtonEvent();

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

  // get unread notices
  unreadNotices(id) {
    this.service.getunreadNotice(id).subscribe(res => {
      this.data = res;
      let unreadCount = this.data.length;
      console.log(unreadCount.toString());
      localStorage.setItem('noticeCount', unreadCount.toString());
      let unreadNotice = Number(localStorage.getItem('noticeCount'));
      this.service.showNotice(unreadNotice);
    })
  }
  // active hardware back button
  backButtonEvent() {
    this.platform.backButton.subscribeWithPriority(666666,() => {
      if(this.constructor.name === "Tab1Page" ||this.constructor.name ===  'LoginPage' ||this.constructor.name ===  'RegisterPage')
      {
        if(window.confirm('Do you want to exit the app'))
        {
          navigator["app"].exitApp();
        }
      }else {
        this.location.back();
      }
    })
  }
  async toasted(msg) {
    const ts = await this.toast.create({
      message: msg,
      duration: 2000,
      position: 'middle'
    });
    ts.present();
  }
  

}
