import { Component, OnInit, ViewChild } from '@angular/core';
import { InitService } from 'src/app/services';
import {
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  @ViewChild('phone') phone;
  @ViewChild('password') password;

  loginForm: FormGroup;
  showPassword


  constructor(
    public initService: InitService,
    private formBuilder: FormBuilder
  ) {
    this.loginForm = this.formBuilder.group({
      phone: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });
  }

  ngOnInit() {
  }


  togglePassword() {
    this.showPassword = !this.showPassword;
  }



  setNextFocus(from) {
    if (from == 'phone') {
      this.password.setFocus();
    } else if (from == 'password') {
      if (this.loginForm.valid) {
        this.login();
      }
    }
  }

  register() {
    this.initService.navCtrl.navigateForward(['register'])
  }

  changeCountry() {
    this.initService.presentToast('not done yet', 'danger')
  }

  async login() {
    if (this.loginForm.valid) {
      let params: any = {
        phone: '+20' + this.loginForm.get('phone').value,
        password: this.loginForm.get('password').value,
      };
      await this.initService.presentLoading();
      await this.initService.httpService
        .postRequest('auth/login', params)
        .then((response: any) => {
          this.initService.loading.dismiss();
          this.initService.storageService
            .storeUserData(response)
            .then(() => {
              this.initService.navCtrl.navigateRoot(['intro']);
            });
        })
        .catch((err) => {
          this.initService.loading.dismiss();
          if (err?.error?.statusCode == 401 || err?.error?.statusCode == 422) {
            this.initService.presentToast(err.error.message, 'danger')
          } else {
            this.initService.presentToast('Error happened', 'danger')
          }
        });
    }
  }




}
