import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.page.html',
  styleUrls: ['./cart.page.scss'],
})
export class CartPage implements OnInit {
cart = [1,2,3,4];
  constructor(
    private location: Location,
    private navCtrl: Router,
    private alert: AlertController 
  ) { }

  ngOnInit() {
  }
  back(){
    this.location.back();
  }
  async showAlert(){
    const lt = await this.alert.create({
      message: "Please wait for M-pesa Pop-up to pay for this Order",
      buttons: [
        {
          text:'cancel',
          role: 'cancel'
        },
        {
          text: 'Okay',
          role:'cancel'
        }
      ]
    });
    await lt.present();
  }
}
