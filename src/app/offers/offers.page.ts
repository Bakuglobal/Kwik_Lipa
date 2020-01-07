import { Component, OnInit  } from '@angular/core';
import { Router , NavigationExtras , ActivatedRoute} from '@angular/router';
import { FirestoreService } from '../services/firestore.service';
import { AlertController, ToastController, ModalController } from '@ionic/angular';
import { AngularFirestore } from '@angular/fire/firestore' ;
import { DatabaseService } from '../services/database.service';
import { CPage } from '../c/c.page';
// import { AdMobFree } from '@ionic-native/admob-free/ngx';

@Component({
  selector: 'app-offers',
  templateUrl: './offers.page.html',
  styleUrls: ['./offers.page.scss'],
})

export class OffersPage implements OnInit {


  shopSelected: any ;
  offers = [] ;
  cart = [] ;
  showLoader = false ;
  public count = 0 ;

  constructor(
    public fireApi: FirestoreService,
    public navCtrl: Router,
    public alertCtrl: AlertController,
    private fs: AngularFirestore,
    private toastCtrl: ToastController,
    private db: DatabaseService,
    private modal: ModalController
    // private admobFree: AdMobFree
  ) {
     
  }
  changeCount(number){
    this.count = number ;
  }

  ngOnInit() {
    this.showShop();
    
  }
  ionViewWillEnter(){
        //check if shop is kakila
        console.log('shop name -- '+this.shopSelected) 
        if(this.shopSelected == 'Kakila Organic'){
      //get kakila OffersPage
      
      this.getOffers();
    console.log('offers -- '+ this.offers)
    }
      
  }
  async getOffers(){
    this.showLoader = true ;
    await this.fs.collection('click&collect').ref.where('shop', '==', 'kakila')
    .onSnapshot(querySnapshot => {
      querySnapshot.docChanges().forEach(change => {
        if (change.type === 'added') {
          console.log('New city: ', change.doc.data());
         let modified =  change.doc.data() ;
         modified.count = 0 ;
          this.offers.push(modified)
          
        } 
        if (change.type === 'modified') {
          console.log('Modified city: ', change.doc.data());
          let modified =  change.doc.data() ;
         modified.count = 0 ;
          this.offers.push(modified)
        } 
        if (change.type === 'removed'){
          console.log('Removed city: ', change.doc.data());
          let modified =  change.doc.data() ;
          modified.count = 0 ;
           this.offers.push(modified)
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
  shop(){
    this.offers.length = 0 ;
    this.cart.length = 0 ;
    this.count = 0 ;
    this.navCtrl.navigate(['tabs/shop']);
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
