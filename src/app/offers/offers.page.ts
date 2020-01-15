import { Component, OnInit  } from '@angular/core';
import { Router , NavigationExtras , ActivatedRoute} from '@angular/router';
import { FirestoreService } from '../services/firestore.service';
import { AlertController, ToastController, ModalController, NavController } from '@ionic/angular';
import { AngularFirestore } from '@angular/fire/firestore' ;
import { DatabaseService } from '../services/database.service';
import { CPage } from '../c/c.page';
import { Location } from '@angular/common';
import { THIS_EXPR, ThrowStmt } from '@angular/compiler/src/output/output_ast';
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
    private location: Location,
    private nav: NavController
  ) 
  {
      this.showShop();
      console.log('shop name -- '+ this.shopSelected) 
      this.getOffers(this.shopSelected);
    
  }

  //cart count
      changeCount(number){
        this.count = number ;
      }

  ngOnInit() {
    if(this.offers.length == 0){
      this.getOffers(this.shopSelected)
    }
    
  }

  // searchbar
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
      
  // get the offers of the selected shop 

        async getOffers(shop){
          this.showLoader = true ;
          await this.fs.collection('click&collect').ref.where('shop', '==', shop)
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
                this.UnfilteredOffers.push(modified);
                this.showLoader = false ;
                
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
                this.UnfilteredOffers[index] = modified ;
                this.showLoader = false ;
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
                this.showLoader = false ;
              }
            });
        });
          
        }
  //add items to the cart

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
// go to home page

      back(){
        // this.offers.length = 0 ;
        this.cart.length = 0 ;
        this.count = 0 ;
        this.navCtrl.navigate(['tabs/tab1']);
      }

//get a shop name

      showShop(){
        this.fireApi.serviceData
          .subscribe(data => (this.shopSelected = data));
        console.log("sent data from home page : ", this.shopSelected);
      }
    
//toast message

      async toast(data){
        const toast = await this.toastCtrl.create({
          message: data,
          duration: 1000
        })
        await toast.present();
      }

//  share cart details with cart page

         sendCart(){
              this.db.setData(this.cart)
              this.fireApi.hiddenTabs = true ;
              this.navCtrl.navigate(['tabs/cart'])
         }
//view a product details in a  modal
     async viewProduct(item){
           const mod = await this.modal.create({
             component: CPage,
             componentProps: item

           })    
           await mod.present()
         }
}
