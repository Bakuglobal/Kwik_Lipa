import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-new-sign-in-code',
  templateUrl: './new-sign-in-code.page.html',
  styleUrls: ['./new-sign-in-code.page.scss'],
})
export class NewSignInCodePage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  otpController(event,next,prev){
    if(event.target.value.length < 1 && prev){
      prev.setFocus()
    }
    else if(next && event.target.value.length>0){
      next.setFocus();
    }
    else {
     return 0;
    } 
 }

 

}
