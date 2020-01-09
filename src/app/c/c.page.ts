import { Component, OnInit , Input} from '@angular/core';
import { ModalController} from '@ionic/angular'

@Component({
  selector: 'app-c',
  templateUrl: './c.page.html',
  styleUrls: ['./c.page.scss'],
})
export class CPage implements OnInit {
  @Input() image: any ;
  @Input() product: any ;
  @Input() quantity: any ;
  @Input() currentprice: any ;
  @Input() initialprice: any ;
  


  constructor(
    private modal: ModalController
    ) { }

  ngOnInit() {
  }


  close(){
    this.modal.dismiss();
  }
}
