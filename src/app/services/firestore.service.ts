import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection
} from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
// import * as sha256 from 'js-sha256';
import { User } from '../models/user';
import * as firebase from 'firebase/app';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';
import { Support } from '../models/support';
import { Observable, BehaviorSubject } from 'rxjs';
// import { IpayTrans, Ipaydata } from '../models/ipay-trans';
// import { Mpesa } from '../models/mpesa';
// import { IPAY_HASHKEY } from '../constants/ipay';
import { Shops } from '../models/shops';
import { resolve } from 'q';
// import { Products } from '../models/products';
import { map } from 'rxjs/operators';
import { ModalController } from '@ionic/angular';
import { LoginPage } from '../login/login.page';



const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':
      'multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW'
  })
};

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {
  base_url_ipay = 'https://kwik.herokuapp.com/';

  HASH256 = '/generateSha256';
  TRANSACT = 'transact';
  MPESA = 'mpesa';
  
  public hiddenTabs: boolean;


  private pathUsers = '/users';
  private pathSupport = '/support';
  private pathShops = '/shops';
  private pathProducts= '/products';

  operationUser: AngularFireList<User> = null;
  operationSupport: AngularFireList<Support> = null;
  operationShops: AngularFireList<Shops> = null;
  // operationProducts: AngularFireList<Products> = null;

  public products: AngularFireList<any>;
    

  private cart = [] ;
  authState: any = null;

  // data: Ipaydata;
  usermsg = {} ;
  // mpesaData: Mpesa; 

  constructor(
    public db: AngularFireDatabase,
    public af: AngularFireAuth,
    public nav: Router,
    public http: HttpClient,
    public modalCtrl: ModalController,
   
    
  ) {
    this.authState = this.af.authState;
    this.operationUser = db.list(this.pathUsers);
    this.operationSupport = db.list(this.pathSupport);
    this.operationShops = db.list(this.pathShops);

    this.products = db.list('/products');

    this.af.authState.subscribe(auth => {
      this.authState = auth;
    });
  }

  viewMessage(){
    const msgRef : firebase.database.Reference = firebase.database().ref(this.pathSupport);
    msgRef.on('value', msgSnapshot => {
      this.usermsg = msgSnapshot.val();
    });
    return this.usermsg ;
  }
//------share shopname across pages
 private dataSource = new BehaviorSubject("Shopname");
    serviceData = this.dataSource.asObservable();

    changeData(data: any) {
      this.dataSource.next(data);
    }
  //------share cart across pages
  private cartDetails = new BehaviorSubject("cart");
    serviceCart = this.cartDetails.asObservable();
    shareCartDetails(details: any){
      this.cartDetails.next(details);
    }
  //---share cart total across a page
  private cartTotal = new BehaviorSubject("total");
   serviceTotal = this.cartTotal.asObservable();
   shareCartTotal(total: any){
     this.cartTotal.next(total);
   }
  //----share phone numbers for checkout
  private phone = new BehaviorSubject("254");
   servicePhone = this.phone.asObservable();
   sharePhoneNumber(number: any){
     this.phone.next(number);
   }
  
   // share shopBy Tag

    private shopBy = new BehaviorSubject("shopBy");
    serviceshopBy = this.shopBy.asObservable();
    shareShopBy(string: any){
      this.shopBy.next(string);
    }



//keep track of cart items
    getCart(){
      return this.cart ;
    }
    addProduct(product){
      this.cart.push(product);
    }
    removeProduct(){
      this.cart.pop();
    }
  register(email: any, password: any, phone : any, firstname : any, lastname: any,gender: any,dob: Date, residence: any) {
    return this.af.auth
      .createUserWithEmailAndPassword(email, password)
      .then((authData: any) => {
        localStorage.setItem('userID',authData.user.uid);
        let value = {
          FirstName: firstname,
          LastName: lastname,
          ehone: phone,
          email: email,
          Gender: gender,
          Dob: dob,
          Residence: residence
        };

        this.operationUser
          .update(authData.user.uid, value)
          .catch(error => console.log(error));
      });
  }

  login(email: any, password: any) {
    return this.af.auth.signInWithEmailAndPassword(email, password);
  }

  logout() {
    this.af.auth.signOut().then(
      resp => {
        localStorage.clear();
        this.nav.navigate(['tabs/login']);
      },
      error => {
        console.log(error);
      }
    );
  }
 

  getCurrentUser() {
    return new Promise<any>((resolve, reject) => {
      var user = firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
          resolve(user);
        } else {
          reject('No user logged in');
        }
      });
    });
  }

  updatePassword(newPassword, email, oldPassword) {
    return new Promise((resolve, reject) => {
      firebase
        .auth()
        .signInWithEmailAndPassword(email, oldPassword)
        .then(function (user) {
          firebase
            .auth()
            .currentUser.updatePassword(newPassword)
            .then(function () {
              resolve('password chanaged successfully');
            })
            .catch(function (err) {
              resolve(err);
            });
        })
        .catch(function (err) {
          reject(err);
        });
    });
  }

  // ---------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------

  sendSupport(data) {
    return this.operationSupport.push(data);
  }
  
  getShops(): AngularFireList<Shops> {
    return this.operationShops;
  }
 getuserMessage() : AngularFireList<Support> {
   return this.operationSupport;
 }
  getUserDetails(key) {
    return this.db.list('users', ref => {
      let q = ref.orderByKey().equalTo(key);
      return q;
    });
  }

  submitProduct(data, userID, transactionID,shopname) {
    data.forEach(element => {
      element.created_at = this.convertDateTime(new Date());
      element.shopname = shopname ;
      this.db.list(`Transactions/${userID}/${transactionID}`).push(element);
    });
  }

 

  shop(key) {
    return this.db.list('shops/' + key);
  }

  getScannedProducts(shopKey, barcode) {
    return this.db.list(`products/${shopKey}`, ref => {
      let q = ref.orderByChild('barcode').equalTo(barcode);
      return q;
    });
  }

  convertDateTime(date) {
    let rsl = date.toString();
    return rsl;
  }

  transactions(key) {
    return this.db.list(`Transactions/${key}`);
  }

  clearTransactions(key) {
    return this.db.list(`Transactions/${key}`).remove();
  }

  getDeepTransactions(key, transaID) {
    return this.db.list(`Transactions/${key}/${transaID}`);
  }

  updateUserEmail(email, oldemail,password) {
    return new Promise((resolve, reject) => {
      firebase
        .auth()
        .signInWithEmailAndPassword(oldemail, password)
        .then(function (user) {
          firebase
            .auth()
            .currentUser.updateEmail(email)
            .then(function () {
              resolve('email update successfully');
            })
            .catch(function (error) {
              reject(error);
            });
        })
        .catch(function (err) {
          reject(err);
        });
    });
  }

  updateOperationUsers(key: any, value: any) {
    return this.operationUser
      .update(key, value)
      .catch(error => console.log(error));
  }

 
  

  //--------
  //--------
  
  
}
