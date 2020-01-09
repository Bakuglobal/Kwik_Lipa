import { Injectable } from '@angular/core';
import { Router, ActivatedRouteSnapshot, CanActivate } from "@angular/router";
import { Observable } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/auth';
import { FirestoreService } from '../services/firestore.service';



@Injectable({
  providedIn: 'root'
})
export class AuthService implements CanActivate {

  constructor(private router: Router , private fauth: AngularFireAuth , private service: FirestoreService) { }


  canActivate(route: ActivatedRouteSnapshot){
   let logs = this.fauth.auth.currentUser ;
   console.log(logs)
   if(logs != null){

    return true ;

   }else {
     this.service.hiddenTabs = true ;
     this.router.navigate(['tabs/login'])

   }
 
  }

 

}
