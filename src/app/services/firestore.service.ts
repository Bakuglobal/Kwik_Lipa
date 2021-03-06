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
import {  BehaviorSubject } from 'rxjs';
// import { IpayTrans, Ipaydata } from '../models/ipay-trans';
// import { Mpesa } from '../models/mpesa';
// import { IPAY_HASHKEY } from '../constants/ipay';
import { Shops } from '../models/shops';
import { resolve } from 'q';
// import { Products } from '../models/products';
import { map } from 'rxjs/operators';
import { ModalController } from '@ionic/angular';
import { LoginPage } from '../login/login.page';
import { HTTP } from '@ionic-native/http/ngx';
import { Order } from '../models/order';
import { List } from '../models/list';
import { Notice } from '../models/upload';
import { ADs } from '../models/ads';
import { Category } from '../models/categories';
import { Chat } from '../models/chat';


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
  //variables
      private pathSupport = '/support';
      private pathShops = '/shops';
      public hiddenTabs: boolean;
      operationUser: AngularFireList<User> = null;
      operationSupport: AngularFireList<Support> = null;
      operationShops: AngularFireList<Shops> = null;
      public products: AngularFireList<any>;
      private cart = [] ;
      authState: any = null;
      OpenOrdersCollection: AngularFirestoreCollection<Order> ;
      pastOrderCollection: AngularFirestoreCollection<Order> ;
      pastPaidOrderCollection: AngularFirestoreCollection<Order> ;
      allLists: AngularFirestoreCollection<List> ;
      notices: AngularFirestoreCollection<Notice> ;
      count = 0 ;
      budget = 0 ;
      region: any ;
      package: any ;

  // objects
      usermsg = {} ;
     
  // private pathUsers = '/users';
 
  constructor(
    public db: AngularFireDatabase,
    public af: AngularFireAuth,
    public nav: Router,
    public http: HttpClient,
    public modalCtrl: ModalController,
    public fs: AngularFirestore
    
  ) {
        this.authState = this.af.authState;
        // this.operationUser = db.list(this.pathUsers);
        this.operationSupport = db.list(this.pathSupport);
        this.operationShops = db.list(this.pathShops);

        this.products = db.list('/products');

        this.af.authState.subscribe(auth => {
        this.authState = auth;
    });
  }
//cart count across page
setCount(num){
 return this.count = num ;
}
getCount(){
  return this.count ;
}
getNGO(){
  return this.fs.collection('NGO');
}
getRegions(){
  return this.fs.collection('Regions')
}
setRegion(item){
  this.region = item ;
}
getRegion(){
  return this.region ;
}
getPackages(){
  return this.fs.collection('Packages');
}
setPackage(item){
  this.package = item ;
}
getPackage(){
  return this.package ;
}
getNgoShops(){
  return this.fs.collection('NGOShops');
}
//get message send to support
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
//------share shop address across pages
private shopLocation = new BehaviorSubject("none");
Location = this.shopLocation.asObservable();
changeLocation(data: any) {
  this.shopLocation.next(data);
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
// show new notification
    private notice = new BehaviorSubject("0");
    serviceNotice = this.notice.asObservable();
    showNotice(number: any){
      this.notice.next(number);
    }
// share shopBy Tag
    private shopBy = new BehaviorSubject("shopBy");
    serviceshopBy = this.shopBy.asObservable();
    shareShopBy(string: any){
      this.shopBy.next(string);
    }
//Handle the cart
    getCart(){
      return this.cart ;
    }
    addProduct(product){
      this.cart.push(product);
    }
    removeProduct(){
      this.cart.pop();
    }
// registration process
    register(email: string,password: any){
      return this.af.auth.createUserWithEmailAndPassword(email,password)
    }
    createUserProfile(data,id){
     return this.fs.collection('users').doc(id).set(data)
    }
 
// login process
  login(email: any, password: any) {
    return this.af.auth.signInWithEmailAndPassword(email, password);
  }
//log out process
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
 
//get the user profile
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
//change user password
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
//send message to support
    sendSupport(data) {
      return this.fs.collection('messages').doc(localStorage.getItem('userID')).set(data);
    }
    addToReplies(data){
      return this.fs.collection('messages').doc(localStorage.getItem('userID')).collection('replies').add(data);
    }
//get the list of shops   
  getShops(){
    let ref =  this.fs.collection<Shops>('shops', ref => {
      return ref.where('businessInfo.type','==','Shops');
    });
    return ref.snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id ;
          return { id, ... data};
        })
      })
    )
  }
  getRecipe(){
    let ref =  this.fs.collection<Shops>('shops', ref => {
      return ref.where('businessInfo.type','==','recipes');
    });
    return ref.snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id ;
          return { id, ... data};
        })
      })
    )
  }
  getCats(){
    return this.fs.collection('videocat');
  }
  getvideos(cat){
    return this.fs.collection('lifestyleVideos',ref => {
      return ref.where('category','==',cat);
    })
  }
//get the message send to support
 getuserMessage() : AngularFireList<Support> {
   return this.operationSupport;
 }
 
getUserDetails(id){
  return this.fs.collection('users').doc(id);
}
//save the transactions history
  submitProduct(data, userID, transactionID,shopname) {
    data.forEach(element => {
      element.created_at = this.convertDateTime(new Date());
      element.shopname = shopname ;
      this.db.list(`Transactions/${userID}/${transactionID}`).push(element);
    });
  }

//get a single shop
    shop(key) {
      return this.db.list('shops/' + key);
    }

// get a list of places in a country from google map api
getPlace(place,key){
  let headers = new HttpHeaders ;
  headers.append('Access-Control-Allow-Origin', '*')
  
  return this.http.get('https://maps.googleapis.com/maps/api/place/autocomplete/json?input='+place+'&key='+key,{headers: headers});
}

//convert date to string
    convertDateTime(date) {
      let rsl = date.toString();
      return rsl;
    }
//get a signle transaction history
    transactions(key) {
      return this.db.list(`Transactions/${key}`);
    }
//delete a single transaction 
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
// get open orders
openOrders(id){
  this.OpenOrdersCollection = this.fs.collection('Orders', ref => {
    return ref.where('userID','==',id).where('status','==','open').orderBy('Date','desc')
  })
  return this.OpenOrdersCollection.valueChanges() ;

}
// get past orders
pastOrders(id){
  this.pastOrderCollection = this.fs.collection('Orders', ref => {
    return ref.where('userID','==',id).where('status','==','canceled').orderBy('Date','asc')
  })
  return this.pastOrderCollection.valueChanges() ;
}
pastPaidOrders(id){
  this.pastPaidOrderCollection = this.fs.collection('Orders', ref => {
    return ref.where('userID','==',id).where('status','==','Paid').orderBy('Date','asc')
  })
  return this.pastPaidOrderCollection.valueChanges() ;

}

// get all shopping list of the user
getLists(id){
  this.allLists = this.fs.collection<List>('shopping-list', ref => {
    return ref.where('userID','==',id).orderBy('DueDate','asc');
  })
  return this.allLists.snapshotChanges().pipe(
    map(actions => {
      return actions.map(a => {
        const data = a.payload.doc.data();
        const id = a.payload.doc.id ;
        return { id, ... data};
      })
    })
  )
}
// get shared shopping lists
getSharedLists(id){
  this.allLists = this.fs.collection<List>('shopping-list', ref => {
    return ref.where('members','array-contains',id).orderBy('DueDate','asc');
  })
  return this.allLists.snapshotChanges().pipe(
    map(actions => {
      return actions.map(a => {
        const data = a.payload.doc.data();
        const id = a.payload.doc.id ;
        return { id, ... data};
      })
    })
  )
}
  //  get users from db
getUsers(){
  return this.fs.collection('users') ;
}
// get areas
getAreas(){
  return this.fs.collection('Areas').valueChanges();
}
// get notifications
getNotifications(id){
 this.notices =  this.fs.collection<Notice>('Notifications', ref => {
   return ref.where('userID','==',id).orderBy('Date','asc');
 });
 return this.notices.snapshotChanges().pipe(
    map(actions => {
      return actions.map(a => {
        const data = a.payload.doc.data();
        const id = a.payload.doc.id ;
        return { id, ... data};
      })
    })
  )
}
// get unreadnotice
getunreadNotice(id){
  this.notices =  this.fs.collection<Notice>('Notifications', ref => {
    return ref.where('userID','==',id).where('status','==','unread').orderBy('Date','asc');
  });
  return this.notices.snapshotChanges().pipe(
     map(actions => {
       return actions.map(a => {
         const data = a.payload.doc.data();
         const id = a.payload.doc.id ;
         return { id, ... data};
       })
     })
   )
}
// check prev chats, composite queery
prevChatSender(id){
let ref = this.fs.collection<Chat>('Chats', ref=>{
  return ref.where('sender', '==', id).orderBy('Date', 'asc')
  
})
return ref.snapshotChanges().pipe(
  map(actions => {
    return actions.map(a => {
      const data = a.payload.doc.data();
      const id = a.payload.doc.id ;
      return { id, ... data};
    })
  })
)
}

prevChatSendTo(id){
  let ref = this.fs.collection<Chat>('Chats', ref=>{
    return ref.where('sendTo', '==', id).orderBy('Date', 'asc')
    
  })
  return ref.snapshotChanges().pipe(
    map(actions => {
      return actions.map(a => {
        const data = a.payload.doc.data();
        const id = a.payload.doc.id ;
        return { id, ... data};
      })
    })
  )
  }

// get donation poster
getPoster(){
  return this.fs.collection('donations').valueChanges();
}
// share list budget
setBudget(value){
  this.budget = value ;
}
getBudget(){
  return this.budget ;
}
getAds(){
  let fs =  this.fs.collection<ADs>('Ads', ref => {
    return ref.where('type','==','shop').orderBy('priority','desc');
  }) ;
 return  fs.valueChanges();
}
// get restaurants
getRest(){
  let ref =  this.fs.collection<Shops>('shops', ref => {
    return ref.where('businessInfo.type','==','food');
  });
  return ref.snapshotChanges().pipe(
    map(actions => {
      return actions.map(a => {
        const data = a.payload.doc.data();
        const id = a.payload.doc.id ;
        return { id, ... data};
      })
    })
  )
}
getMeals(shop){
  return this.fs.collection(shop).valueChanges();
}
getCategory(shop){
  return this.fs.collection('Categories').doc<Category>(shop).valueChanges();
}
getFoodAds(){
  let fs =  this.fs.collection<ADs>('Ads', ref => {
    return ref.where('type','==','food').orderBy('priority','desc');
  }) ;
 return  fs.valueChanges();
}
getproducts(shop){
  return this.fs.collection(shop, ref => {
    return ref.orderBy('currentprice','desc').limitToLast(5);
  });
}

  getUsersAndIDs() {
    const ref = this.fs.collection<User>('users', ref => {
      return ref.orderBy('phone')
    })
    return ref.snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const id = a.payload.doc.id;
          const data = a.payload.doc.data()
          return { id, ...data }
        })
      })
    )
  }
  
  getUserProfile(id) {
    return this.fs.collection('users').doc<User>(id)
  }

sendToShop(list){
  return this.fs.collection('sendlist').add(list);
}
// retrieve msgs with ids
retrieveMessages(){
  let ref = this.fs.collection<Chat>('Chats',
    ref => ref.where('sender', '==', localStorage.getItem('userID')).orderBy('Date', 'asc')
  )
  return ref.snapshotChanges().pipe(
    map(actions => {
      return actions.map(a => {
        const data = a.payload.doc.data();
        const id = a.payload.doc.id;
        return { id, ...data };
      })
    })
  )
  
}

retrieveMessagesToMe(){
  let ref = this.fs.collection<Chat>('Chats',
    ref => ref.where('sendTo', '==', localStorage.getItem('userID')).orderBy('Date', 'asc')
  )
  return ref.snapshotChanges().pipe(
    map(actions => {
      return actions.map(a => {
        const data = a.payload.doc.data();
        const id = a.payload.doc.id;
        return { id, ...data };
      })
    })
  )
  
}

}


