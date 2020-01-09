import { Component, OnInit  } from '@angular/core';
import { Router , NavigationExtras , ActivatedRoute} from '@angular/router';
import { FirestoreService } from '../services/firestore.service';
import { AlertController, ToastController, ModalController } from '@ionic/angular';
import { AngularFirestore } from '@angular/fire/firestore' ;
import { DatabaseService } from '../services/database.service';
import { CPage } from '../c/c.page';
import { Location } from '@angular/common';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
// import { AdMobFree } from '@ionic-native/admob-free/ngx';

@Component({
  selector: 'app-offers',
  templateUrl: './offers.page.html',
  styleUrls: ['./offers.page.scss'],
})

export class OffersPage implements OnInit {


  shopSelected: any ;
  offers = [] ;
  UnfilteredOffers = [] ;
  cart = [] ;
  showLoader = false ;
  public count = 0 ;
  showSearch = false ;
  searchTerm : string ;
  docID = [] ;


  constructor(
    public fireApi: FirestoreService,
    public navCtrl: Router,
    public alertCtrl: AlertController,
    private fs: AngularFirestore,
    private toastCtrl: ToastController,
    private db: DatabaseService,
    private modal: ModalController,
    private location: Location
    // private admobFree: AdMobFree
  ) {
    this.showShop();
    console.log('shop name -- '+this.shopSelected) 
        if(this.shopSelected == 'Kakila Organic'){
      //get kakila OffersPage
      
      this.getOffers();
    console.log('offers -- '+ this.offers)
    }

  }
  changeCount(number){
    this.count = number ;
  }

  ngOnInit() {
  }
  showSearchBar(){
    if(this.showSearch == false){
      this.showSearch = true ;
    } else {
      this.showSearch = false ;
    }
  }
  setFilteredItems(){
    if(this.searchTerm != null || this.searchTerm != ''){
      this.offers = this.filterItems()
      console.log(this.offers)
    }
  }
  filterItems() {
    return this.UnfilteredOffers.filter(item => {
      return item.product.toLowerCase().indexOf(this.searchTerm.toLowerCase()) > -1;
    });
  }
      
  
  async getOffers(){
    this.showLoader = true ;
    await this.fs.collection('click&collect').ref.where('shop', '==', 'kakila')
    .onSnapshot(querySnapshot => {
      querySnapshot.docChanges().forEach(change => {
        if (change.type === 'added') {
          console.log('New city: ', change.doc.data());
          // add id to array
          this.docID.push(change.doc.id)

          // append count to product and push to array

         let modified =  change.doc.data() ;
          modified.count = 0 ;
          this.offers.push(modified)
          this.UnfilteredOffers.push(modified)
          
        } 
        if (change.type === 'modified') {
          console.log('Modified city: ', change.doc.data());
          //find index of product in local array
          let id = change.doc.id ;
          let index = this.docID.indexOf(id)

          //add count to the modified product
          let modified =  change.doc.data() ;
          modified.count = 0 ;
          //replace the product in the local array <--offers--> with the modified one
          this.offers[index] = modified;
          this.UnfilteredOffers[index] = modified
        } 
        if (change.type === 'removed'){
          console.log('Removed city: ', change.doc.data());
          //find index of product in local array
          let id = change.doc.id ;
          let index = this.docID.indexOf(id);

          //add count to the modified product
          let modified =  change.doc.data() ;
          modified.count = 0 ;
          //replace the product in the local array <--offers--> with the modified one
          this.offers.splice(index,1);
          this.UnfilteredOffers.splice(index,1);
        }
      });
  });
    this.showLoader = false ;
  }
  
  addToCart(item){
    if(this.cart.includes(item)){
      let index = this.cart.indexOf(item);
      this.cart[index].count ++ ;
      this.count ++ ;
      

    }else{
      let mod = item ;
      mod.count ++ ;
      this.cart.push(mod);
      this.count ++ ;
   
    console.log('Cart --> '+ this.cart);
    this.toast('Product added To cart') ;
  }
}

async openPrompt(){
  let prompt = await this.alertCtrl.create({
    header:'********HURRY********',
    message:'Visit the Shop Today and buy at this price',
    buttons: [
      {
        text:'Close',
        role:'cancel'
      }
    ]
  });
  await prompt.present();

}
  back(){
    this.offers.length = 0 ;
    this.cart.length = 0 ;
    this.count = 0 ;
    this.navCtrl.navigate(['tabs/tab1']);
  }

  showShop(){
    this.fireApi.serviceData
      .subscribe(data => (this.shopSelected = data));
    console.log("sent data from home page : ", this.shopSelected);
  }
 

  async toast(data){
    const toast = await this.toastCtrl.create({
      message: data,
      duration: 1000
    })
    await toast.present();
  }

         //  Handle cart details

         sendCart(){
              this.db.setData(this.cart)
              this.navCtrl.navigate(['tabs/cart'])
         }
     async viewProduct(item){
           const mod = await this.modal.create({
             component: CPage,
             componentProps: item

           })    
           await mod.present()
         }
}
