import { Component, OnInit } from '@angular/core';
import { InitService } from 'src/app/services';
import { Network } from '@capacitor/network';

@Component({
  selector: 'app-connection',
  templateUrl: './connection.component.html',
  styleUrls: ['./connection.component.scss'],
})
export class ConnectionComponent implements OnInit {

  constructor(public initService: InitService) { }

  ngOnInit() { }


  async reload() {
    const status = await Network.getStatus();
    if (status.connected) {
      this.initService.connection_lost = false;
    } else {
      this.initService.connection_lost = true;
    }
  }

}
