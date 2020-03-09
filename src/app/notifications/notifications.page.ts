import { Component, OnInit, Input } from '@angular/core';
import { FirestoreService } from '../services/firestore.service';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { Location } from '@angular/common';
import { AngularFirestore } from '@angular/fire/firestore';
import { ModalController, LoadingController } from '@ionic/angular';
import { ViewOrderPage } from '../view-order/view-order.page';
import { Order } from '../models/order';
import { Badge } from '@ionic-native/badge/ngx';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.page.html',
  styleUrls: ['./notifications.page.scss'],
})
export class NotificationsPage implements OnInit {

  Order: Order;
  notifications = [];
  Name;
  count = '';
  constructor(
    private service: FirestoreService,
    private navCtrl: Router,
    private modal: ModalController,
    private fs: AngularFirestore,
    private load: LoadingController,
    private badge: Badge
  ) {
    this.service.hiddenTabs = true;
    this.Name = localStorage.getItem('Name');
    this.service.serviceNotice.subscribe(res => {
      this.count = res ;
      console.log(this.count)
    });
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

  viewOrder(title,docId,status) {
    if(status == "unread"){
      this.changeNoticeBadgeCount();
    }
    this.fs.collection('Notifications').doc(docId).update({'status':'read'});
    this.badge.increase(-1);
    let id = title.substring(0, 8);
    console.log(id);
    this.getOder(id);
      this.loader();
      setTimeout( () => {
        this.gotoModal(this.Order);
      },3000)
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
  changeNoticeBadgeCount(){
    let count = Number(this.count);
    this.service.showNotice(count - 1);
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
