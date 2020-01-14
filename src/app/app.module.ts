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
// import { TransModalPageModule } from './modal/trans-modal/trans-modal.module';
// import { FileChooser } from '@ionic-native/file-chooser/ngx';
import { DeviceOrientation } from '@ionic-native/device-orientation/ngx';
// import { AdMobFree } from '@ionic-native/admob-free/ngx';

//  import { HttpModule } from '@angular/http/ngx';
import { Contacts } from '@ionic-native/contacts';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';

// import {GooglePlus} from '@ionic-native/google-plus/ngx';
import {Network} from '@ionic-native/network/ngx';
import { ChatmodalPageModule } from './chatmodal/chatmodal.module';
import { NewChatPageModule } from './new-chat/new-chat.module';
import { Http, HttpModule } from '@angular/http';
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


@NgModule({
  declarations: [AppComponent,   ],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicModule.forRoot({_forceStatusbarPadding: true}),
    // IonicModule.forRoot({scrollAssist: false, autoFocusAssist: false}),
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
    LoanPageModule,
    CommentsPageModule,
    NgxQRCodeModule,
    TransModalPageModule,
    CPageModule,
    ScannedModalPageModule,
    

    
  ],
  providers: [
    // FileChooser,
    // AdMobFree,
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
    // GooglePlus,
    SplashScreen,
    BarcodeScanner,
    FirestoreService,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
    
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
