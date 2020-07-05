import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs/Observable';
import { Firebase } from '@ionic-native/firebase/ngx';



import { map } from 'rxjs/operators';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Platform } from '@ionic/angular';
import { Product } from '../models/product';
import { FirestoreService } from './firestore.service';
import { Post } from '../models/post';
import { Shops } from '../models/shops';
import { Category} from '../models/categories';
  import { from } from 'rxjs';
export interface ShoppingList {
  Title: string,
  First: string,
  Second: string,
  Third: string,
  Fourth: string,
  Fifth: string,
  userId: string
}



@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  shops;
  data:any;
  cart = [];
  private listCollection: AngularFirestoreCollection<ShoppingList>;
  private lists: Observable<ShoppingList[]>;
  products;
  items = [];
  count = 0;
  user;
  public cartCount = 0;
  constructor(
    private http: HttpClient,
    // private fireApi:AngularFirestore,
    public firebaseNative: Firebase,
    private platform: Platform,
    private fs: AngularFirestore,
    public fireApi: FirestoreService,
    private db: DatabaseService,
  ) {
    this.listCollection = this.fs.collection<ShoppingList>('shopping-list');

    this.lists = this.listCollection.snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, ...data };
        });
      })
    );
    this.getUsers();
  }

  //   START OF  SHOPPING LIST DATABASE SERVICE
  getLists() {
    return this.lists;
  }

  getList(id) {
    return this.fs.collection<ShoppingList>('shopping-list', ref => ref.where('user-id', '==', id));

  }

  createList(mylist) {
    return this.fs.collection('shopping-list').add(mylist);
  }
  readList() {
    return this.fs.collection('shopping-list').snapshotChanges();

  }
  updateList(mylist, mylistId) {
    this.fs.doc('shopping-list/' + mylistId).update(mylist);
  }
  deleteList(mylistId) {
    this.fs.doc('shopping-list/' + mylistId).delete();
  }


  //  GET SHOPS PRODUCTS
  getshopsproduct(barcode, shop) {

    let headers = new HttpHeaders();
    // headers.append('Content-Type','application/json');
    headers.append('Access-Control-Allow-Origin', '*');
    headers.append('Access-Control-Allow-Headers', 'Origin,X-Requested-With, Content-Type,Accept');

    let postdata = {
      "item_number": barcode,
      "shop_selected": shop
    }

    return this.http.post("https://kwik-db-api.glitch.me/api/products", postdata, { headers: headers });

  }

  // get users from firestore
  async getUsers() {
    this.fs.collection('users').get()
      .subscribe(querySnapshot => {
        querySnapshot.docs.forEach(doc => {
          this.items.push(doc.data());
        });
      })
  }

  // Filter users 
  filterItems(searchTerm) {
    // this.getUsers();
    console.log(this.items)
    return this.items.filter(item => {
      return item.phone.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1;
    });
  }
  //share cart details across pages
 
  addCart(item) {
    if (this.cart.length === 0) {
      if(!item.count){
        item.count = 1;
        this.cartCount++;
      }else{
        this.cartCount += item.count ;
      }
      this.cart.push(item);
      console.log('0->added', this.cartCount, this.cart);
      return;
    } else {
      let exist: boolean = this.cart.some(x =>
        x.product === item.product 
      );
      if(exist){
          // increase count
          if(!item.count){
            item.count = 1;
            this.cartCount++;
          }else{
            this.cartCount += item.count ;
          }
          var indeX ;
          for (let [index, p] of this.cart.entries()) {
            console.log(index);
            if(p.product === item.product){
              indeX = index ;
            }
          }
          this.cart[indeX].count += 1;
          // this.cartCount++;
          console.log('exists->increased', this.cartCount, this.cart[indeX]);
          return;
      }else {
        // add to the cart
        if(!item.count){
          item.count = 1;
          this.cartCount++;
        }else{
          this.cartCount += item.count ;
        }
        this.cart.push(item);
        // this.cartCount++;
        console.log('exists->added', this.cartCount, this.cart);
        return;
      }
    }
  }
  removeFromCart(item) {
    for (let [index, p] of this.cart.entries()) {
      if (p.product === item.product) {
        this.cartCount =  this.cartCount - item.count;
        this.cart.splice(index, 1);
        console.log('1->removed', this.cartCount, this.cart);
        return;
      }
    }
  }
  reduceCount(item){
    if(item.count == 1){
      return ;
    }
    for (let [index, p] of this.cart.entries()) {
      if (p.product === item.product) {
        this.cartCount = this.cartCount - 1;
        this.cart[index].count--;
        console.log('1->removed', this.cartCount, this.cart[index]);
        return;
      }
    }
  }
  addCount(item){
    for (let [index, p] of this.cart.entries()) {
      if (p.product === item.product) {
        this.cartCount = this.cartCount + 1;
        this.cart[index].count++;
        console.log('1->removed', this.cartCount, this.cart[index]);
        return;
      }
    }
  }
  resetCart() {
    this.cart = [] ;
    this.cartCount = 0 ;
  }
  getCart() {
    return this.cart;
  }
  getCartCount() {
    return this.cartCount;
  }
  getPosts(){
    let posts = this.fs.collection<Post>('posts',ref => {
      return ref.orderBy('time','desc')
    })
    return posts.snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const id = a.payload.doc.id ;
          const data = a.payload.doc.data();
          return {id, ... data}
        });
      })
    )
  }
  // Handle Notifications
  async getToken() {
    let token;
    //for android devices
    if (this.platform.is('android')) {
      token = await this.firebaseNative.getToken()
      console.log('token is ==>' + token)
      alert(token);
    }
    //for ion devices
    if (this.platform.is('ios')) {
      token = await this.firebaseNative.getToken();
      await this.firebaseNative.grantPermission();
    }
    //not cordova app
    if (!this.platform.is('cordova')) {

    }
    return this.saveTokenToFirestore(token);
  }
  private saveTokenToFirestore(token) {
    if (!token) return;
    const device = this.fs.collection('Devices');
    const docData = {
      token,
      userId: localStorage.getItem('UserID')

    }
    console.log("deviceDATA -- " + docData);
    return device.doc(token).set(docData);

  }

  // listen to notifications
  listenToNotification() {
    return this.firebaseNative.onNotificationOpen();
  }
  //set user data for sharing with other pages
  setUser(data) {
    this.user = data;
  }
  //get user info
  getUser() {
    return this.user;
  }
  getproducts(shop){
    return this.fs.collection(shop, ref => {
      return ref.orderBy('currentprice', 'asc');
    });
  }
  // get disounted products
  getdiscountedProducts() {
    let prod = this.fs.collection<Product>('Popular', ref => {
      return ref.orderBy('currentprice', 'asc');
    });
    return prod.snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, ...data };
        })
      })
    )
  }
  // get featured products
  getFeaturedProducts() {
    let prod = this.fs.collection<Product>('Featured', ref => {
      return ref.orderBy('currentprice','asc');
    });
    return prod.snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, ...data };
        })
      })
    )
  }
  getShopPhoneNumber(shop){
    let obj = this.fs.collection<Shops>('shops', ref => {
      return ref.where('shop','==',shop);
    });
   return  obj.snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id ;
          return { id, ... data};
        })
      })
    )
  }
  // get shop categories
  getCategories(shop){
    return this.fs.collection('Categories').doc<Category>(shop);
  }

  // hold signup details
  holddata(data){
    this.data = data ;
  }
  sharedata(){
    return this.data;
  }
 
}
