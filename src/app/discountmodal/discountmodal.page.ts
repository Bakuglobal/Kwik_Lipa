import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-discountmodal',
  templateUrl: './discountmodal.page.html',
  styleUrls: ['./discountmodal.page.scss'],
})
export class DiscountmodalPage implements OnInit {
  count = 0 ;
  @Input('id') id;
  @Input('barcode') barcode;
  @Input('category') category;
  @Input('description') description;
  @Input('image') image;
  @Input('product') product;
  @Input('quantity') quantity;
  @Input('shop') shop;
  @Input('status') status;
  @Input('stock') stock;
  @Input('currentprice') currentprice;



  constructor(
    private mod : ModalController
  ) { }

  ngOnInit() {
  }


  close(){
    this.mod.dismiss();
  }

  addToCart(){
    this.count ++ ;
  }
}

