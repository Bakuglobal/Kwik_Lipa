import { Injectable } from '@angular/core';
import { Router, ActivatedRouteSnapshot, CanActivate } from "@angular/router";
import { Observable } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/auth';
import { FirestoreService } from '../services/firestore.service';

@Injectable({
  providedIn: 'root'
})
export class LogsService {

  constructor(private router: Router , private fauth: AngularFireAuth , private service: FirestoreService) { }


  canActivate(route: ActivatedRouteSnapshot){
   let logs = localStorage.getItem('userID') ;
   console.log(logs)
   if(logs != null){

    this.router.navigate(['tabs/tabs1'])

   }
  }
}
