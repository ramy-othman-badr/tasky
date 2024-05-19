import { Component, OnInit } from '@angular/core';
import { InitService } from 'src/app/services';
import { Clipboard } from '@capacitor/clipboard';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  profileDetails: any = {}
  loading = true

  constructor(public initService: InitService) { }

  ngOnInit() {
    this.getProfileDetails()
  }



  getProfileDetails() {
    this.initService.httpService.getRequest('auth/profile').then((response: any) => {
      this.profileDetails = response
      this.loading = false
    }).catch((err) => {
      if (err.status == 401) {
        this.initService.refreshToken().then(() => {
          this.getProfileDetails()
        })
      }
    })

  }

  async copyPhoneNumber() {
    await Clipboard.write({
      string: this.profileDetails.username
    });
  }



}