import { Component, OnInit } from '@angular/core';
import { InitService } from 'src/app/services';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.scss'],
})
export class LogoutComponent  implements OnInit {

  constructor(public initService: InitService) {

  }

  ngOnInit() {}

  dismissModal() {
    this.initService.modalController.dismiss()
  }

  confirm() {
    this.initService.modalController.dismiss({
      confirmed: true
    })
  }

}
