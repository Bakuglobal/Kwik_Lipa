import { Component, OnInit,ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { IonSlides, MenuController } from '@ionic/angular';
import { FirestoreService } from '../services/firestore.service';
// import { AdMobFree } from '@ionic-native/admob-free/ngx';


@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.page.html',
  styleUrls: ['./welcome.page.scss'],
})
export class WelcomePage implements OnInit {
  @ViewChild(IonSlides, {static: false}) slides: IonSlides ;

  SkipMsg: String = "Skip" ;

  slideOpts = {
    initialSlide: 0,
    speed: 400
  };

  nextSlide() {
    this.slides.slideNext();
  }

  constructor(
    public navCtrl: Router,
    // private admobFree: AdMobFree
    private service : FirestoreService,
    private menu : MenuController
  ) {}
  ngOnInit() {
    this.redirect();
    this.removeBannerAd();
    this.service.hiddenTabs = true ;
    this.menu.enable(false);
  }
  redirect(){
    const id = localStorage.getItem('userID');
    if(id !== null){
      this.service.hiddenTabs = false ;
      this.navCtrl.navigate(['tabs']);
    }
  }
 
  removeBannerAd(){
    // this.admobFree.banner.remove();
  }


  slidechanged(){
    
    if(this.slides.isEnd()){
      this.SkipMsg = "Get started";
    }
  }
  Skip(){
    this.service.hiddenTabs = false ;
    this.menu.enable(false);
    this.navCtrl.navigate(['tabs']);
  }
  
}
