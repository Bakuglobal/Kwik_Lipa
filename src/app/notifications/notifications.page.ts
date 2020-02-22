import { Component, OnInit, Input } from '@angular/core';
import { FirestoreService } from '../services/firestore.service';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { Location } from '@angular/common';
import { AngularFirestore } from '@angular/fire/firestore';
import { ModalController, LoadingController } from '@ionic/angular';
import { ViewOrderPage } from '../view-order/view-order.page';
import { Order } from '../models/order';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.page.html',
  styleUrls: ['./notifications.page.scss'],
})
export class NotificationsPage implements OnInit {

  Order: Order;
  notifications;
  Name;
  constructor(
    private service: FirestoreService,
    private navCtrl: Router,
    private modal: ModalController,
    private fs: AngularFirestore,
    private load: LoadingController
  ) {
    this.service.hiddenTabs = true;
    this.Name = localStorage.getItem('Name');
  }

  ionViewWillEnter() {
    this.service.getNotifications(localStorage.getItem('userID')).subscribe(res => {
      this.notifications = res;
      console.log(res);
    });
  }

  back() {
    this.service.hiddenTabs = false;
    this.navCtrl.navigate(['tabs/tab1']);
  }

  //  onScroll(event) {
  //   // used a couple of "guards" to prevent unnecessary assignments if scrolling in a direction and the var is set already:
  //   if (event.detail.deltaY > 0 && this.header && this.service.hiddenTabs) return;
  //   if (event.detail.deltaY < 0 && !this.header && this.service.hiddenTabs) return;
  //   if (event.detail.deltaY > 0) {
  //     console.log("scrolling down, hiding footer...");
  //     this.header = true;
  //     this.service.hiddenTabs = false ;
  //   } else {
  //     console.log("scrolling up, revealing footer...");
  //     this.header = false;
  //     this.service.hiddenTabs = true ;
  //   };
  // };

  viewOrder(title) {
    let id = title.substring(0, 8);
    console.log(id);
    this.getOder(id);
    if (this.Order == undefined) {
      this.loader();
      setTimeout( () => {
        this.gotoModal(this.Order);
      },2500)
    } else {
      this.gotoModal(this.Order);
    }

  }
  async getOder(id) {
    await this.fs.collection('Orders').doc(id).valueChanges().subscribe(res => {
      this.Order = res;
      console.log(this.Order);
    },
      err => { console.log(err) }
    )
  }
  ngOnInit() {
  }

  async gotoModal(order) {
    const mod = await this.modal.create({
      component: ViewOrderPage,
      componentProps: order
    });
    console.log(order);
    await mod.present();
  }
  async loader() {
    const ld = await this.load.create({
      message: 'Getting order ...',
      duration: 2500,
    });
    await ld.present();
  }

}
