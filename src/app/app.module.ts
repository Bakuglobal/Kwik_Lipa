import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { environment } from '../environments/environment';
import { FirestoreService } from './services/firestore.service';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { DeviceOrientation } from '@ionic-native/device-orientation/ngx';
import { Contacts } from '@ionic-native/contacts/ngx';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import {Network} from '@ionic-native/network/ngx';
import { ChatmodalPageModule } from './chatmodal/chatmodal.module';
import { NewChatPageModule } from './new-chat/new-chat.module';
import { HttpModule } from '@angular/http';
import { HTTP } from '@ionic-native/http/ngx';
import { InfomodalPageModule } from './infomodal/infomodal.module';
import { SokomodalPageModule } from './sokomodal/sokomodal.module';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import {InAppBrowser} from '@ionic-native/in-app-browser/ngx';
import { LoanPageModule } from './loan/loan.module';
import { CommentsPageModule } from './comments/comments.module';
import { NgxQRCodeModule } from 'ngx-qrcode2';
import { TransModalPageModule } from './modal/trans-modal/trans-modal.module';
import { OpenNativeSettings } from '@ionic-native/open-native-settings/ngx';
import { CPageModule } from './c/c.module';
import { ScannedModalPageModule } from './scanned-modal/scanned-modal.module';
import { OffersPage } from './offers/offers.page';
import { Firebase } from '@ionic-native/firebase/ngx';
import { AppLauncher} from '@ionic-native/app-launcher/ngx';
// import { OneSignal } from '@ionic-native/onesignal/ngx';
import { Tab1Page } from './tab1/tab1.page';
import { Keyboard } from '@ionic-native/keyboard/ngx';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material.module';
import { AndroidFullScreen} from '@ionic-native/android-full-screen/ngx' ;
import { FCM }from '@ionic-native/fcm/ngx'
import { ViewOrderPageModule } from './view-order/view-order.module';
import { ViewListPageModule } from './view-list/view-list.module';
import { ImageDisplayPageModule } from './image-display/image-display.module';
import { DiscountmodalPageModule } from './discountmodal/discountmodal.module';
import { NotificationsPageModule } from './notifications/notifications.module';


@NgModule({
  declarations: [AppComponent,   ],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicModule.forRoot({_forceStatusbarPadding: true}),
    AppRoutingModule,
    AngularFireDatabaseModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    HttpClientModule,
    HttpModule,
    AngularFireAuthModule,
    FormsModule,
    AngularFireStorageModule,
    ChatmodalPageModule,
    NewChatPageModule,
    InfomodalPageModule,
    SokomodalPageModule,
    CommentsPageModule,
    NgxQRCodeModule,
    TransModalPageModule,
    CPageModule,
    ScannedModalPageModule,
    BrowserAnimationsModule,
    MaterialModule,
    ViewOrderPageModule,
    ViewListPageModule,
    ImageDisplayPageModule,
    DiscountmodalPageModule,
    NotificationsPageModule

  ],
  providers: [
    DeviceOrientation,
    InAppBrowser,
    StatusBar,
    OffersPage,
    OpenNativeSettings,
    Firebase,
    SocialSharing,
    Network,
    Contacts,
    Geolocation,
    AppLauncher,
    // OneSignal,
    SplashScreen,
    BarcodeScanner,
    FirestoreService,
    Tab1Page,
    HTTP,
    FCM,
    Keyboard,
    AndroidFullScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
    
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
