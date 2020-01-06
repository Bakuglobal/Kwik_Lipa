import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AngularFirestore,AngularFirestoreCollection } from '@angular/fire/firestore' ;
 
import { map  } from 'rxjs/operators';
import { HttpHeaders, HttpClient } from '@angular/common/http';
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
  shops ;
  private listCollection: AngularFirestoreCollection<ShoppingList>;
  private lists: Observable<ShoppingList[]>; 
  items = [] ;   
  
  constructor(
    private http:HttpClient,
    private fireApi:AngularFirestore
  ) { 
    this.listCollection = this.fireApi.collection<ShoppingList>('shopping-list');
 
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
  return this.fireApi.collection<ShoppingList>('shopping-list', ref => ref.where('user-id', '==', id));
  
}
 


  createList(mylist){
    return this.fireApi.collection('shopping-list').add(mylist);
  }
  readList(){
    return this.fireApi.collection('shopping-list').snapshotChanges();
   
  }
  updateList(mylist,mylistId){
    this.fireApi.doc('shopping-list/' +mylistId).update(mylist);
  }
  deleteList(mylistId){
    this.fireApi.doc('shopping-list/'+ mylistId).delete();
  }

// END OF SHOPPINGLIST DATABASE SERVICE


// START OF SHOPS DATABASE QUERY SERVICE


    ///  GET SHOPS PRODUCTS
  getshopsproduct(barcode,shop){

      let headers = new HttpHeaders();
      headers.append('Content-Type','application/json');
      headers.append('Access-Control-Allow-Origin','*');
      headers.append('Access-Control-Allow-Headers','Origin,X-Requested-With, Content-Type,Accept');

      let postdata = {
        "item_number": barcode,
        "shop_selected" : shop
      }
    
   return this.http.post("https://kwik-db-api.glitch.me/api/products",postdata,{headers : headers});
  
  }

// get users from firestore
async getUsers(){
  await this.fireApi.collection('users').get()
    .subscribe(querySnapshot => {
      querySnapshot.docs.forEach(doc => {
      this.items.push(doc.data());
    });
  })
}
filterItems(searchTerm) {
  // this.getUsers();
  console.log(this.items)
  return this.items.filter(item => {
    return item.phone.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1;
  });
}


  }
