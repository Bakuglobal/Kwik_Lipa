import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { ModalController } from '@ionic/angular';
import { FirestoreService } from '../services/firestore.service';


@Component({
  selector: 'app-shop-modal',
  templateUrl: './shop-modal.page.html',
  styleUrls: ['./shop-modal.page.scss'],
})
export class ShopModalPage implements OnInit {
  restaurants:any[]=[];
  shops:any[]=[];
  recipeshops:any[]=[];
  selected:string;
  constructor(private fService: FirestoreService, private modal2: ModalController, private  fs: AngularFirestore) { 
    this.fService.getShops().subscribe(res=>{
      console.log('shops', res)
      this.shops=res;
    }, error=>{
      console.log(error)
    })
 
    this.fService.getRest().subscribe(res=>{
     console.log('restaurants', res)
     this.restaurants=res;
   }, error=>{
     console.log(error)
   })
 
   this.fService.getRecipe().subscribe(res=>{
     console.log('recipeshops', res)
     this.recipeshops=res;
   }, error=>{
     console.log(error)
   })
  }

  ngOnInit() {
  }
  // ionViewWillEnter(){
  //  this.fs.collection('shops').valueChanges().subscribe(res=>{
    //  console.log('the shops', res)
  //  })
//  }

 selectMerchant(){
   this.modal2.dismiss(this.selected)
 }
}
