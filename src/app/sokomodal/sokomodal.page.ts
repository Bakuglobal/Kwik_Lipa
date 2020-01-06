import { Component, OnInit , ViewChild, ElementRef} from '@angular/core';
import { ModalController, AlertController } from '@ionic/angular';
import { Geolocation} from '@ionic-native/geolocation/ngx';
import { OpenNativeSettings } from '@ionic-native/open-native-settings/ngx';

declare var google ;

@Component({
  selector: 'app-sokomodal',
  templateUrl: './sokomodal.page.html',
  styleUrls: ['./sokomodal.page.scss'],
})
export class SokomodalPage implements OnInit {
  map;
  shopLocation;
  @ViewChild('mapElement',{static: true}) mapElement:  ElementRef ;

  directionService = new google.maps.DirectionsService ;
  directionDisplay = new google.maps.DirectionsRenderer ;
  currentLocation: any = {
    lat:0,
    lng: 0
  }
  constructor(
    private modalCtrl: ModalController,
    private geoLocation: Geolocation,
    private alertCtrl: AlertController,
    public openSettings : OpenNativeSettings,
  ) { 
  }

  ngOnInit() {
  }
  ionViewWillEnter() {
    
} 
ngAfterContentInit(): void {
 this.geoLocation.getCurrentPosition().then((resp)=>{
   this.currentLocation.lat =resp.coords.latitude ;
   this.currentLocation.lng = resp.coords.longitude ;
 });
 const map =new google.maps.Map(this.mapElement.nativeElement, {
   zoom: 8,
   center: {lat: -1.3031934,lng: 36.5672003}
 });
 this.directionDisplay.setMap(map);
 this.calculateAndDisplayRoute();
}
calculateAndDisplayRoute(){
  const that = this ;
  this.directionService.route({
    origin: this.currentLocation,
    destination: 'Nakumatt Mega',
    travelMode: 'WALKING'
  },( response , status) =>{
    if(status === 'OK'){
      that.directionDisplay.setDirections(response);
    }else{
      // window.alert('Direction failed due to '+ status+ ' make sure your location is turn on')
      this.alertController();
    }
  }
  );
}
async alertController(){
  const alt = await this.alertCtrl.create({
    message: 'Your location is turned off',
    buttons: [
      {
        text: 'open settings',
        handler: ()=> {
          this.openSettings.open("location").then(val => {
               this.ionViewWillEnter(); 
            // this.geoLocation.getCurrentPosition().then((resp)=>{
            //   this.currentLocation.lat =resp.coords.latitude ;
            //   this.currentLocation.lng = resp.coords.longitude ;
            // });
            // const map =new google.maps.Map(this.mapElement.nativeElement, {
            //   zoom: 8,
            //   center: {lat: -1.3031934,lng: 36.5672003}
            // });
            // this.directionDisplay.setMap(map);
            // this.calculateAndDisplayRoute(); 
          })
        }
      }
    ]

  })
}
  close(){
    this.modalCtrl.dismiss();
  }
}
