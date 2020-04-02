import { Component, OnInit, ViewChild, ElementRef, Input } from '@angular/core';
import { NavParams, ModalController } from '@ionic/angular';

@Component({
  selector: 'app-image-display',
  templateUrl: './image-display.page.html',
  styleUrls: ['./image-display.page.scss'],
})
export class ImageDisplayPage implements OnInit {
    @Input('url')url: string;
    liked = false ;

    // @ViewChild('slider', { read: ElementRef })slider: ElementRef;

    sliderOpts = {
        zoom: {
            maxRatio: 3
        }
    };
    constructor(
        private modalController: ModalController
    ) { }
    
    ngOnInit() {
    }

    zoom(zoomIn: boolean) {
        // let zoom = this.slider.nativeElement.swiper.zoom;
        // if(zoomIn) {
        //     zoom.in();
        // } else {
        //     zoom.out();
        // }

    }

    close() {
        this.modalController.dismiss();
    }
    like(){
        if(this.liked = false){
            this.liked = true ;
        }else {
            this.liked = false ;
        }
    }
    comments(){

    }
    share(){

    }
}
