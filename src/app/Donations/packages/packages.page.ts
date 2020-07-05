import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { FirestoreService } from 'src/app/services/firestore.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-packages',
  templateUrl: './packages.page.html',
  styleUrls: ['./packages.page.scss'],
})
export class PackagesPage implements OnInit {
packages: any[]
region: any ;
  constructor(
    private location: Location,
    private navCtrl: Router,
    private service: FirestoreService,
    private fs: AngularFirestore,
    private alert: AlertController,
  ) { 
    this.getRegion();
    this.getPackages();
    // this.setprod();
  }

  ngOnInit() {
  }
  getRegion(){
    this.region = this.service.getRegion()
  }
  back(){
    this.location.back();
  }
  goToShops(pack){
    this.service.setPackage(pack);
    console.log('selected package',pack);
    this.showAlert(pack);
    // this.navCtrl.navigate(['tabs/Regionshop']);
  }
  getPackages(){
    this.service.getPackages().valueChanges().subscribe(res => {
      this.packages = res ;
      console.log('packages',this.packages);
    })
  }
  async showAlert(pack){
    const lt = await this.alert.create({
      message: "Sponsor a family of "+'<strong>'+pack.family+'</strong>'+" "+"with"+" "+"Kshs."+'<strong>'+pack.total+'</strong>'+"."+" "+"Click Okay to pay via Mpesa",
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

 


  // setprod(){
  //   let prod = [
  //     {"product":"Sugar","quantity":"2Kg","price":"200"},
  //     {"product":"Rice","quantity":"2Kg","price":"200"},
  //     {"product":"Cooking Oil","quantity":"2Litres","price":"200"},
  //     {"product":"Soap","quantity":"2Kg","price":"200"}
  //   ]
  //   this.fs.collection('Packages').doc('Jp5pZxjVIjwa39ASHZyN').update(
  //     {
  //       product: prod
  //     }
  //   ).catch(err => {
  //     console.log(err)
  //   })
  // }
}
