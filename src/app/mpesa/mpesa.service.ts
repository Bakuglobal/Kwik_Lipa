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

// //get token
getToken(){
  let headers = new HttpHeaders();
  headers.append('Content-Type','application/json');
  headers.append('Access-Control-Allow-Origin','*');
  headers.append('Access-Control-Allow-Headers','Origin,X-Requested-With, Content-Type,Accept')

  return this.httpClient.get("https://kwik-lipa-mpesa-online.glitch.me/token",{ headers : headers })
 
}

sendStkRequest(amt,phone,desc,token) {
  if(token === null){
    console.log('TOKEN NULL');
    return;
  }
  let headers = new HttpHeaders();
  headers.append('Content-Type','application/json');
  headers.append('Access-Control-Allow-Origin','*');
  headers.append('Access-Control-Allow-Headers','Origin,X-Requested-With, Content-Type,Accept')
  
  let postData = {
          "phone": phone.toString(),  
          "amount": amt.toString(),
          "token":token,
          "desc": desc.toString()
  }
 return this.httpClient.post("https://kwik-lipa-mpesa-online.glitch.me/hooks/stk", postData, {headers : headers})
}


//get mpesa response

getMpesaResponse(){
  // let headers = new HttpHeaders();
  // headers.append('Response-Type','text');
  // headers.append('Access-Control-Allow-Origin','*');
  // headers.append('Access-Control-Allow-Headers','Origin,X-Requested-With, Content-Type,Accept')
 return this.httpClient.get("https://kwik-lipa-mpesa-online.glitch.me/hooks/response", {responseType:"text"})
    
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
