import { Component } from '@angular/core';
import { StatusBar } from '@capacitor/status-bar';
import { Network } from '@capacitor/network';
import { InitService } from './services';
import { Device } from '@capacitor/device';


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {


  constructor(public initService: InitService) {
    this.initializeApp();
  }


  initializeApp() {
    this.initService.platform.ready().then(async () => {
      const info = await Device.getId();
      const device_info = await Device.getInfo();
      this.initService.device_id = info.identifier;
      if (
        this.initService.platform.is('cordova') ||
        this.initService.platform.is('capacitor')
      ) {
        StatusBar.setBackgroundColor({
          color: '#FFFFFF',
        });
        if (device_info.manufacturer.toLowerCase() === 'huawei') {
          this.initService.platform_type = 'huawei'
        } else {
          if (this.initService.platform.is('ios')) {
            this.initService.platform_type = 'ios'
          } else {
            this.initService.platform_type = 'android'
          }
        }
        this.checkConnection();
      }
      this.initService.navCtrl.navigateRoot(['intro']);
    });
  }


  async checkConnection() {
    Network.addListener('networkStatusChange', (status) => {
      if (status.connected) {
        this.initService.connection_lost = false;
      } else {
        this.initService.connection_lost = true;
      }
    });


    const status = await Network.getStatus();
    if (status.connected) {
      this.initService.connection_lost = false;
    } else {
      this.initService.connection_lost = true;
    }
  }







}
