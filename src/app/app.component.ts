import { Component, ViewChildren, QueryList } from '@angular/core';
import {
  Platform,
  MenuController,
  PopoverController,
  ActionSheetController,
  ModalController,
  ToastController,
  Events
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
// import { FileChooser } from '@ionic-native/file-chooser/ngx';
import { FileUpload } from './models/upload';
import { Shops } from './models/shops';
import { IonRouterOutlet } from '@ionic/angular';
// import { AdMobFree, AdMobFreeBannerConfig, AdMobFreeInterstitialConfig } from '@ionic-native/admob-free/ngx';
// import { url } from 'inspector';
import { viewClassName } from '@angular/compiler';
// import {timer} from 'rxjs/observable/timer' ;
import { Network } from '@ionic-native/network/ngx';
import { timer } from 'rxjs';
import { AngularFireDatabase } from '@angular/fire/database';

declare var $: any;

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
  user ;
  name ;
  email ;
 public  show  =  false;

  
  
  constructor(
    private platform: Platform,
    // private admobFree: AdMobFree,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private fireApi: FirestoreService,
    public menuCtrl: MenuController,
    private menu: MenuController,
    public routerCtrl: Router,
    // private fileChooser: FileChooser,
    private deviceOrientation: DeviceOrientation,
    private actionSheetCtrl: ActionSheetController,
    private popoverCtrl: PopoverController,
    private modalCtrl: ModalController,
    private toast: ToastController,
    public events: Events,
    public service: FirestoreService,
    public database: AngularFireDatabase
  ) {
    this.initializeApp();
    if(localStorage.getItem('UserID') != null){
      let id = localStorage.getItem('UserID');
      this.getDetails(id);
    }
   
  }

login(){
  this.menu.close();
  this.routerCtrl.navigate(['tabs/login']);
}
  getDetails(id){
      this.database.database.ref('/users/'+ id).once('value').then(snap => {
        console.log('snap --'+snap.val().email);
        this.email = snap.val().email ;
        this.name = snap.val().name ;
        this.show = true ;
      })
  }


  initializeApp() {
    this.platform.ready().then(() => {
      //
      if (this.platform.is('android')) {
        this.statusBar.backgroundColorByHexString("#33000000");
      }else{
        // this.statusBar.styleDefault();
      }
      this.statusBar.styleDefault();
      this.statusBar.hide() ;
    });
    
      //UserProfile details 

    

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
        } else if (this.routerCtrl.url === '/tab1') {
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
 
  public openPage(page) {
    this.menuCtrl.close();
    page.active = !page.active; 
    this.routerCtrl.navigate([page.url]);
    
  }

 

  navigate(url) {
    this.menuCtrl.close();
    this.routerCtrl.navigate([url]);
  }

  logout() {
    this.menuCtrl.close();
    this.fireApi.logout();
    localStorage.clear();
  }

  selectFile(event) {
    this.selectedFiles = event.target.files;
  }
 //// KEYBOARD CUSTOM SCRIPT
//  

ngAfterViewInit() {
  
    // This element never changes.
    let ionapp = document.getElementsByTagName("ion-app")[0];

    window.addEventListener('keyboardDidShow', async (event) => {
        // Move ion-app up, to give room for keyboard
        let kbHeight: number = event["keyboardHeight"];
        let viewportHeight: number = $(window).height();
        let inputFieldOffsetFromBottomViewPort: number = viewportHeight - $(':focus')[0].getBoundingClientRect().bottom;
        let inputScrollPixels = kbHeight - inputFieldOffsetFromBottomViewPort;

        // Set margin to give space for native keyboard.
        ionapp.style["margin-bottom"] = kbHeight.toString() + "px";

        // But this diminishes ion-content and may hide the input field...
        if (inputScrollPixels > 0) {
            // ...so, get the ionScroll element from ion-content and scroll correspondingly
            // The current ion-content element is always the last. If there are tabs or other hidden ion-content elements, they will go above.
            let ionScroll = await $("ion-content").last()[0].getScrollElement();
            setTimeout(() => {
                $(ionScroll).animate({
                    scrollTop: ionScroll.scrollTop + inputScrollPixels
                }, 300);
            }, 300); // Matches scroll animation from css.
        }
    });
    window.addEventListener('keyboardDidHide', () => {
        // Move ion-app down again
        // Scroll not necessary.
        ionapp.style["margin-bottom"] = "0px";
    });
}
  
}
