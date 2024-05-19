import { Component, OnInit } from '@angular/core';
import { InitService } from 'src/app/services';

@Component({
  selector: 'app-onboarding',
  templateUrl: './onboarding.page.html',
  styleUrls: ['./onboarding.page.scss'],
})
export class OnboardingPage implements OnInit {

  constructor(public initService: InitService) { }

  ngOnInit() {
  }


  getStarted() {
    this.initService.navCtrl.navigateRoot(['login'])
  }

}
