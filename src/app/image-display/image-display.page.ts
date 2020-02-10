import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { NavParams, ModalController } from '@ionic/angular';

@Component({
  selector: 'app-image-display',
  templateUrl: './image-display.page.html',
  styleUrls: ['./image-display.page.scss'],
})
export class ImageDisplayPage implements OnInit {
    img: any;

    // @ViewChild('slider', { read: ElementRef })slider: ElementRef;

    sliderOps = {
        zoom: {
            maxRatio: 3
        }
    };


    constructor(private navParams: NavParams, private modalController: ModalController) { }

    ngOnInit() {
        this.img = this.navParams.get('img');
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

}
