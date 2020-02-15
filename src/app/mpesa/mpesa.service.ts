import { Injectable } from '@angular/core';
import { AlertController, LoadingController, ToastController } from '@ionic/angular';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { FirestoreService } from '../services/firestore.service';

@Injectable({
  providedIn: 'root'
})
export class MpesaService {
  token : Object;
  load ;

  constructor(
    public fireApi: FirestoreService,
    public navCrtl: Router,
    public httpClient: HttpClient,
    public loadingController: LoadingController,
    public alertController: AlertController,
    private toast: ToastController
  ) { }

//get token
getToken(){
  let headers = new HttpHeaders();
  headers.append('Content-Type','application/json');
  headers.append('Access-Control-Allow-Origin','*');
  headers.append('Access-Control-Allow-Headers','Origin,X-Requested-With, Content-Type,Accept')

 this.httpClient.get("https://kwik-lipa-mpesa-online.glitch.me/hooks/token",{ headers : headers })
 .subscribe(data => {
   this.token = data ;
   console.log('token is :'+ this.token);
 });
}

sendStkRequest(amt,phone) {
  this.presentLoading('Processing ...');
  this.getToken();
 if(this.token != null){
  let headers = new HttpHeaders();
  headers.append('Content-Type','application/json');
  headers.append('Access-Control-Allow-Origin','*');
  headers.append('Access-Control-Allow-Headers','Origin,X-Requested-With, Content-Type,Accept')
  
  let postData = {
          "phone": phone.toString(),  
          "amount": amt.toString(),
          "token": this.token
  }
   

  this.httpClient.post("https://kwik-lipa-mpesa-online.glitch.me/hooks/stk", postData, {headers : headers})
  .subscribe(data => {
    console.log(data);
    if(data == "Invalid Access Token"){
     this.getToken();
     this.load.dismiss();
     this.toasted('Network issues try again')
    }
    if(data == "Bad Request - Invalid PhoneNumber"){
      console.log("Invalid PhoneNumber");
      this.load.dismiss();
    }
   }, error => {
    console.log(error);
    this.load.dismiss();
  });
}else {
  this.load.dismiss();
}
}

//get mpesa response

getMpesaResponse(){
  this.httpClient.get("https://kwik-lipa-mpesa-online.glitch.me/hooks/response", {responseType: 'text'})
    .subscribe(data => {
      if(data == "successful"){
        this.fireApi.getCurrentUser().then(results => {
          this.fireApi
            .getUserDetails(results.uid)
            .valueChanges()
            .subscribe(user => {
              // this.sendReceipt(user);
            })});
            // this.clearLocalArrays();
        this.navCrtl.navigate(['e-receipt'])
      }else {

        //this.clearLocalArrays();
        // this.errorCheckingOut();
        console.log(data);
      }
     }, error => {
      console.log(error);
    });
}
// loading

async presentLoading(msg){
  this.load = this.loadingController.create({
    message: msg
  });
  await this.load.present();
}
// toast 
async toasted(msg) {
  const ts = await this.toast.create({
    message: msg ,
    duration: 2000,
    position: 'bottom'
  });
  await ts.present();
}
}
