import { Component, OnInit, Input } from '@angular/core';
import { ModalController, ToastController, AlertController } from '@ionic/angular';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-view-order',
  templateUrl: './view-order.page.html',
  styleUrls: ['./view-order.page.scss'],
})
export class ViewOrderPage implements OnInit {
  @Input('OderID') OrderID ;
  @Input('notes') notes ;
  @Input('pickDay') pickDay ;
  @Input('shop') shop ;
  @Input('pickMins') pickMins ;
  @Input('pickHour') pickHour ;
  @Input('products') products ;
  @Input('Date') Date ;
  @Input('userID') userID ;
  @Input('username') username ;
  @Input('status') status ;
  @Input('delivery') Delivery ;


  constructor(
    private modal: ModalController,
    private fs: AngularFirestore,
    private toast: ToastController,
    private alert : AlertController
  ) { }

  ngOnInit() {
  }


  back(){
    this.modal.dismiss()
    }

  cancelOrder(){
    const ref = this.fs.collection('Orders') ;

   let data = {
     "status": this.status
   }
    ref.doc(this.OrderID).update(data);
    this.presentToast('Your '+''+ this.OrderID+''+''+ 'Order'+ ''+' is canceled')
    this.back();
  }
  // toast
  async presentToast(msg){
    const ts = await this.toast.create({
      message: msg,
      position: "bottom",
      duration: 2000
    });
    await ts.present();
  }
  // alert 
  async confirm() {
    const alert = await this.alert.create({
      header: 'Please confirm',
      message: 'Do you want to cancel this order',
      buttons: [
        {
          text: 'No',
          role: 'cancel'
        },
        {
          text: 'Yes',
          handler: () => {
            this.cancelOrder();
          }
        }
      ]
    });
    await alert.present();
  }

}


