import { Component, OnInit } from '@angular/core';
import { InitService } from 'src/app/services';

@Component({
  selector: 'app-intro',
  templateUrl: './intro.page.html',
  styleUrls: ['./intro.page.scss'],
})
export class IntroPage implements OnInit {
  constructor(public initService: InitService) { }

  ngOnInit() {
    this.initService.storageService.init().then(() => {
      this.checkUser();
    });
  }



  checkUser() {
    this.initService.storageService.getUserData().then((user: any) => {
      if (user) {
        this.initService.user = true
        this.initService.httpService.access_token = user.access_token;
        this.initService.httpService.refresh_token = user.refresh_token;
        this.initService.userDetails = user
        setTimeout(() => {
          this.initService.navCtrl.navigateRoot(['home'])
        }, 1000)
      } else {
        this.initService.user = false
        this.initService.httpService.access_token = '';
        this.initService.httpService.refresh_token = '';
        this.initService.userDetails = {}
        setTimeout(() => {
          this.initService.navCtrl.navigateRoot(['onboarding'])
        }, 1000)
      }
    })
  }





}
