import { Component, OnInit } from '@angular/core';
import {Http} from '@angular/http' ;
import 'rxjs/add/operator/map' ;
import {Router} from '@angular/router' ;
// import { AdMobFree } from '@ionic-native/admob-free/ngx';

@Component({
  selector: 'app-about',
  templateUrl: './about.page.html',
  styleUrls: ['./about.page.scss'],
})
export class AboutPage implements OnInit {


  //variables

      information: any [] ;

  //objects


  constructor(
    private http: Http,
    private navCtrl: Router,

     ) 
  {
        let localData = this.http.get('assets/about.json').map(res => res.json().About);
        localData.subscribe(data => {
          this.information = data ;
        });
   }
   
ngOnInit() {
  
  }
goToSupport(){
  this.navCtrl.navigate(['support']);
}
 

//Toggle section

    toggleSection(i){
    this.information[i].open = !this.information[i].open ;
    }
    toggleItem(i, j){
      this.information[i].children[j].open = !this.information[i].open ;
    }


  

}
