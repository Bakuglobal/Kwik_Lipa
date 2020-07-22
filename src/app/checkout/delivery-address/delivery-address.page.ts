import { Component, OnInit, NgZone, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { FirestoreService } from 'src/app/services/firestore.service';
import { DatabaseService } from 'src/app/services/database.service';
import { ToastController, LoadingController, AlertController } from '@ionic/angular';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { NativeGeocoder, NativeGeocoderResult, NativeGeocoderOptions } from '@ionic-native/native-geocoder/ngx';
import { Location } from '@angular/common';
import { MpesaService } from 'src/app/mpesa/mpesa.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { Contacts } from '@ionic-native/contacts/ngx';


declare var google;
export class mpesaRes {
  CheckoutRequestID?: any;
  CustomerMessage?: any;
  MerchantRequestID?: any;
  ResponseCode?: any;
  ResponseDescription?: any;
  errorMessage?: any;
}

@Component({
  selector: 'app-delivery-address',
  templateUrl: './delivery-address.page.html',
  styleUrls: ['./delivery-address.page.scss'],
})
export class DeliveryAddressPage implements OnInit {
  @ViewChild('map', { static: false }) mapElement: ElementRef;
  map: any;
  address: string;
  lat: string;
  long: string;
  lat2: string;
  long2: string;
  autocomplete: { input: string; };
  autocompleteItems: any[];
  // location: any;
  placeid: any;
  GoogleAutocomplete: any;
  directionDisplay = new google.maps.DirectionsRenderer;

  delivery = 'deliver';
  deliveryFee: number;
  NewdeliveryAddr = '';
  deliveryAddr: string;
  searchAddr = false;
  cart = [];
  shop: string;
  shopLocation: string;
  notes: string;
  phonenumber: string;
  loader: any;
  Ordersuccess = false ;
  constructor(
    private navCtrl: Router,
    private service: FirestoreService,
    private db: DatabaseService,
    private toast: ToastController,
    private nativeGeocoder: NativeGeocoder,
    public zone: NgZone,
    private geolocation: Geolocation,
    private location: Location,
    private mpesa: MpesaService,
    private loadCtrl: LoadingController,
    private fs: AngularFirestore,
    public contacts: Contacts,
    private alert: AlertController
  ) {
    this.service.hiddenTabs = true;

    // autocomplete
    this.GoogleAutocomplete = new google.maps.places.AutocompleteService();
    this.autocomplete = { input: '' };
    this.autocompleteItems = [];

    this.getShop();
    this.getCart();
    this.phonenumber = localStorage.getItem('Number');


  }

  ngOnInit() {

    this.loadMap();
  }
  getShop() {
    this.service.serviceData
      .subscribe(data => (this.shop = data));
    console.log("shop name: ", this.shop);
    this.service.Location.subscribe(data => (this.shopLocation = data));
    console.log("shop location : ", this.shopLocation);
    this.getShopCodes();
  }

  back() {
    this.location.back();
  }
  changeAddress() {

  }
  setDeliveryAddrr(addr) {
    this.NewdeliveryAddr = addr;
  }

  radioGroupChange(event) {
    console.table(event);
    console.log(this.delivery)
  }
  deliveryOption(event) {
    console.log(event.detail.value);
    this.delivery = event.detail.value;
    switch (this.delivery) {
      case "pick":
        this.deliveryFee = 0;
        break;

      case "deliver":
        this.getFee();
        break;
    }
  }



  //LOADING THE MAP HAS 2 PARTS.
  loadMap() {

    //FIRST GET THE LOCATION FROM THE DEVICE.
    this.geolocation.getCurrentPosition().then((resp) => {
      let latLng = new google.maps.LatLng(resp.coords.latitude, resp.coords.longitude);
      let mapOptions = {
        center: latLng,
        zoom: 15,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      }

      //LOAD THE MAP WITH THE PREVIOUS VALUES AS PARAMETERS.
      this.getAddressFromCoords(resp.coords.latitude, resp.coords.longitude);
      this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
      this.map.addListener('tilesloaded', () => {
        console.log('accuracy', this.map, this.map.center.lat());
        this.lat = this.map.center.lat()
        this.long = this.map.center.lng()
        this.getAddressFromCoords(this.map.center.lat(), this.map.center.lng());
      });
      this.directionDisplay.setMap(this.map);
    }).catch((error) => {
      console.log('Error getting location', error);
    });
  }
  getAddressFromCoords(lattitude, longitude) {
    console.log("getAddressFromCoords " + lattitude + " " + longitude);
    // get place name
    this.getName(lattitude, longitude);
    // calculate fee
    this.getFee();
    let options: NativeGeocoderOptions = {
      useLocale: true,
      maxResults: 5
    };
    this.nativeGeocoder.reverseGeocode(lattitude, longitude, options)
      .then((result: NativeGeocoderResult[]) => {
        this.address = "";
        let responseAddress = [];
        for (let [key, value] of Object.entries(result[0])) {
          if (value.length > 0)
            responseAddress.push(value);
        }
        responseAddress.reverse();
        for (let value of responseAddress) {
          this.address += value + ", ";
        }
        this.address = this.address.slice(0, -2);
      })
      .catch((error: any) => {
        this.address = "Address Not Available!";
      });
  }

  //FUNCTION SHOWING THE COORDINATES OF THE POINT AT THE CENTER OF THE MAP
  ShowCords() {
    alert('lat' + this.lat + ', long' + this.long)
  }

  //AUTOCOMPLETE, SIMPLY LOAD THE PLACE USING GOOGLE PREDICTIONS AND RETURNING THE ARRAY.
  UpdateSearchResults() {
    if (this.autocomplete.input == '') {
      this.autocompleteItems = [];
      return;
    }
    this.GoogleAutocomplete.getPlacePredictions({ input: this.autocomplete.input },
      (predictions, status) => {
        this.autocompleteItems = [];
        this.zone.run(() => {
          predictions.forEach((prediction) => {
            this.autocompleteItems.push(prediction);
          });
        });
      });
  }

  //wE CALL THIS FROM EACH ITEM.
  SelectSearchResult(item) {
    console.log(item);
    // get place code
    this.db.getPlaceCode(item).subscribe(val => {
      let data: any = val;
      console.log(data.results[0].geometry.location);
      const geocode = data.results[0].geometry.location;
      this.lat = geocode.lat;
      this.long = geocode.lng;

      // this.placeid = item ;

      this.autocomplete.input = '';
      this.autocompleteItems = [];
      this.getAddressFromCoords(geocode.lat, geocode.lng);
      this.getName(geocode.lat, geocode.lng);
      this.getFee();
    });
    // this.placeid = item.place_id ;
  }


  //lET'S BE CLEAN! THIS WILL JUST CLEAN THE LIST WHEN WE CLOSE THE SEARCH BAR.
  ClearAutocomplete() {
    this.autocompleteItems = []
    this.autocomplete.input = ''
  }

  //sIMPLE EXAMPLE TO OPEN AN URL WITH THE PLACEID AS PARAMETER.
  GoTo() {
    return window.location.href = 'https://www.google.com/maps/search/?api=1&query=Google&query_place_id=' + this.placeid;
  }
  // get place name
  getName(lat, lng) {
    this.db.getPlaceName(lat, lng).subscribe(val => {
      let data: any = val;
      this.placeid = data.results[0].formatted_address;
      console.log(this.placeid.formatted_address);
    });
  }
  // calculate fee
  getFee() {
    let distance = this.db.DistanceInKm(this.lat, this.long, this.lat2, this.long2);
    console.log('distance', parseFloat(distance.toString()).toFixed(2));
    let distInTwoDecimal = parseFloat(distance.toString()).toFixed(2);

    // multply distance by 40 for @KM
    let fee = Number(distInTwoDecimal) * 40;
    const trunc = parseInt(fee.toString(), 10);
    fee = Number(trunc);
    if (fee < 40 || fee === 40) {
      this.deliveryFee = 40;
    } else {
      this.deliveryFee = fee;
    }
    console.log(this.deliveryFee);



  }
  getShopCodes() {
    console.log(this.shopLocation)
    // this.shopLocation = "Wanyee Close, Nairobi, Kenya";
    // get cordinates of the shop
    this.db.getPlaceCode(this.shopLocation).subscribe(val => {
      let data: any = val;
      console.log(data.results[0].geometry.location);
      const cordinates = data.results[0].geometry.location;
      this.lat2 = cordinates.lat;
      this.long2 = cordinates.lng;
    });
  }
  getCart() {
    this.cart = this.db.getCart();
  }
  getTotal() {
    let total = this.cart.reduce((a, b) => a + (b.count * b.currentprice), 0);
    return (Number(total));
  }
  total() {
    return this.getTotal() + this.deliveryFee;
  }
  payment() {
    // initiate mpesa transactions
    this.loading();
    // get Token
    this.mpesa.getToken().subscribe(res => {
      let token = res;
      console.log('token', token);
      if (token === null) {
        console.log('TOKEN NULL');
        this.mpesa.toasted("Something went wrong try again");
        this.loader.dismiss();
        return;
      } else {
        // SEND STK
        let desc = localStorage.getItem('userID');
        this.sendSTK(desc, token);
      }
    })

    // LISTEN FOR FEEDBACK



  }
  sendSTK(desc, token) {
    // let number = this.mpesa.formatNumber(this.phonenumber)
    this.mpesa.sendStkRequest(this.total(), this.phonenumber, desc, token).subscribe(data => {
      let dt: mpesaRes = data;
      console.log(dt);
      if (dt.errorMessage === "Invalid Access Token") {
        //  this.getToken();
        this.loader.dismiss();
        this.toaster('Network issues try again');
        return;
      }
      if (dt.errorMessage === "Bad Request - Invalid PhoneNumber") {
        console.log("Invalid PhoneNumber");
        this.toaster('The phone number in your account is incorrect')
        this.loader.dismiss();
        return;
      }
      if (dt.errorMessage === "Invalid grant type passed") {
        this.toaster('something went wrong try checking out again');
        this.loader.dismiss();
        return;
      }
      console.log("AWAITING response");
        // wait for 5 seconds then check the server 
        setTimeout(()=>{
          if(dt.ResponseCode === '0'){
            // stk was sent so check for results
            this.mpesa.getMpesaResponse().subscribe(data => {
              console.log(data);
              switch (data) {
                case 'paid':
                  // sent out order to shop
                  let ord = this.prepareOrderObj();
                  ord.payment = "paid";
                  this.fs.collection('Orders').doc(ord.OrderID).set(ord).then(res => {
                    this.clearCart();
                    this.Ordersuccess = true ;
                    this.loader.dismiss();
                  })
                    .catch(err => { console.log('error msg', err); this.loader.dismiss(); });
                  break;
              
                case 'canceled':
                  // toast canceled msg
                  this.loader.dismiss();
                  this.toaster('the payment was canceled');
                  break;
              }
              // this.loader.dismiss();
            },error => {
              console.log(error);
              this.loader.dismiss();
            })

          }else{
            // stk did not go through
            this.toaster('something went wrong try checking out again');
            this.loader.dismiss();
          }
        },30000);
      // this.loader.dismiss();
    });
}

//goto orders
myorders() {
  this.service.hiddenTabs = false;
  this.Ordersuccess = false;
  this.navCtrl.navigate(['tabs/transactions'])
}
  prepareOrderObj() {
    var deliveryLocation;
    var fee;
    this.notes = this.db.getNotes();
    let id = this.generateOrderID().substring(0, 8).toUpperCase();

    if (this.delivery === 'pick') {
      deliveryLocation = '';
      fee = 0;
    } else {
      deliveryLocation = this.placeid;
      fee = this.deliveryFee
    }

    let order = {
      "Date": new Date(),
      "Delivery": this.delivery,
      "userID": localStorage.getItem('userID'),
      "products": this.cart,
      "notes": this.notes,
      "shop": this.shop,
      "status": "open",
      "Location": deliveryLocation,
      "OrderID": id,
      "username": localStorage.getItem('Name'),
      "DeliveryFee": fee,
      "payment": ""
    }
    return order;
  }
  // generate orderID
  generateOrderID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }
  // loader
  async loading() {
    this.loader = await this.loadCtrl.create({
      message: 'Preparing payment ...'
    });
    await this.loader.present();
  }
  //  toaster
  async toaster(msg) {
    const ts = await this.toast.create({
      message: msg,
      position: "bottom",
      duration: 2000
    });
    await ts.present();
  }
  clearCart() {
    this.cart.length = 0;
    this.db.resetCart();
    this.delivery = '';
    this.deliveryFee = 0;
    this.service.changeData('Shopname');
  }
  async changeNumber() {
    const pop = await this.alert.create({
      message: 'Enter the Mpesa number to pay with',
      inputs: [
        {
          placeholder: 'Enter number eg. +2547xxxxxxxx',
          name: 'number'
        }
      ],
      buttons: [
        {
          text: 'MyContacts',
          handler: () => {
            console.log('Pick from contacts');
            this.contacts.pickContact().then(det => {
            let number = this.mpesa.formatNumber(det.phoneNumbers[0].value);
            this.phonenumber = number ;
            });
          }
        },
        {
          text: 'Ok',
          handler: (data) => {
            console.log(data);
            let number = this.mpesa.formatNumber(data.number);
            this.phonenumber = number ;
            this.payment();
          }
        }
      ]
    });
    await pop.present();
  }
  async presentAlertConfirm() {
    const alert = await this.alert.create({
      header: 'Please Confirm!',
      message:
        'Pay <strong>KES ' +
        this.total() +
        '.00</strong>!!!'+'<br>'+' via' + ''+'<strong>'+' '+this.phonenumber +'</strong>' +''+ ' M-pesa',
      buttons:[
        {
          text: 'Yes',
          cssClass: 'secondary',
          handler: () => {
            this.phonenumber = this.mpesa.formatNumber(this.phonenumber);
            this.payment();
          }
        },
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary'
        },
        {
          text: 'Pay using another number',
          cssClass: 'secondary',
          handler: () => {
            this.changeNumber();
          }
        }
      ]
    });

    await alert.present();
  }
  

}
