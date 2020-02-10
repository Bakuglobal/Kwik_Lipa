import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-view-list',
  templateUrl: './view-list.page.html',
  styleUrls: ['./view-list.page.scss'],
})
export class ViewListPage implements OnInit {
  @Input('Title') Title;
  @Input('Items') Items;
  @Input('members') members;
  @Input('DueDate') DueDate;
  @Input('userID') userID;
  edit = false;
  totaItems;

  constructor(
    private modal: ModalController
  ) {
  }

  ngOnInit() {
    this.getTotalCount();
  }

  close() {
    this.modal.dismiss();
  }
  add(index) {
    this.Items[index].count++;
    this.totaItems++;

  }
  reduce(index) {
    if (this.Items[index].count == 1) { return }
    else {
      this.Items[index].count--;
      this.totaItems--;
    };

  }
  getTotalCount() {
    this.totaItems = this.Items.reduce((a, b) => a + (b.count * 1), 0);
  }

}
