import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { FirestoreService } from 'src/app/services/firestore.service';
import { YoutubeVideoPlayer } from '@ionic-native/youtube-video-player/ngx';



@Component({
  selector: 'app-lifestyle',
  templateUrl: './lifestyle.page.html',
  styleUrls: ['./lifestyle.page.scss'],
})
export class LifestylePage implements OnInit {

  constructor(    private location: Location,
    private service: FirestoreService, private youtube: YoutubeVideoPlayer) { }

  ngOnInit() {
  }


  back(){
    this.service.hiddenTabs = false ;
    this.location.back();
  }

  // PLAY YOUTUBE VIDEO
  openMyVideo(id){
    this.youtube.openVideo(id);
  }

}
