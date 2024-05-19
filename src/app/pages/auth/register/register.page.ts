import { Component, OnInit, ViewChild } from '@angular/core';
import { InitService } from 'src/app/services';
import {
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ListCompComponent } from 'src/app/components/list-comp/list-comp.component';


@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  @ViewChild('phone') phone;
  @ViewChild('password') password;

  registerForm: FormGroup;
  showPassword

  levels = [
    { id: 'fresh', name: 'Fresh' },
    { id: 'junior', name: 'Junior' },
    { id: 'midLevel', name: 'Mid Level' },
    { id: 'senior', name: 'Senior' },
  ]

  constructor(
    public initService: InitService,
    private formBuilder: FormBuilder
  ) {
    this.registerForm = this.formBuilder.group({
      displayName: ['', [Validators.required]],
      phone: ['', [Validators.required]],
      password: ['', [Validators.required]],
      experienceYears: ['', [Validators.required]],
      address: ['', [Validators.required]],
      level: ['', [Validators.required]],
      selected_level: ['', [Validators.required]],
    });
  }

  ngOnInit() {
  }


  togglePassword() {
    this.showPassword = !this.showPassword;
  }


  async selectLevel() {
    let modal = await this.initService.modalController.create({
      component: ListCompComponent,
      cssClass: 'experience-level-modal',
      componentProps: {
        items: this.levels,
        default_value: this.registerForm.get('experienceYears').value,
        type: 'single',
        list_title: 'Select Experience Level'
      },
      breakpoints: [1],
      initialBreakpoint: 1,
    });
    modal.onDidDismiss().then((data) => {
      if (data.data && data.data?.selected_value) {
        this.registerForm.get('selected_level').setValue(data.data?.selected_value.name)
        this.registerForm.get('level').setValue(data.data?.selected_value.id)
      }
    });
    modal.present();
  }


  setNextFocus(from) {
    if (from == 'phone') {
      this.password.setFocus();
    } else if (from == 'password') {
      if (this.registerForm.valid) {
        this.register();
      }
    }
  }

  login() {
    this.initService.navCtrl.pop()
  }

  changeCountry() {
    this.initService.presentToast('not done yet', 'danger')
  }

  async register() {
    if (this.registerForm.valid) {
      let params: any = {
        displayName: this.registerForm.get('displayName').value,
        phone: '+20' + this.registerForm.get('phone').value,
        password: this.registerForm.get('password').value,
        experienceYears: this.registerForm.get('experienceYears').value,
        address: this.registerForm.get('address').value,
        level: this.registerForm.get('level').value,
      };
      await this.initService.presentLoading();
      this.initService.httpService
        .postRequest('auth/register', params)
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
