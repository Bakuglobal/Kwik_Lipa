import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { FirestoreService } from 'src/app/services/firestore.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {


  AdvertslideOpts = {
    initialSlide: 1,
    speed: 500,
    autoplay: true,
    slidesPerView: 1
  };
  slideme = {
    initialSlide: 0,
    speed: 500,
    autoplay: true,
    slidesPerView: 1.7,
  }
  skeleton = [1,2,3];
  constructor(
    private location: Location,
    private service: FirestoreService
  ) { 
    this.service.hiddenTabs = true ;
  }

  ngOnInit() {
  }
  back(){
    this.service.hiddenTabs = false ;
    this.location.back();
  }
}
