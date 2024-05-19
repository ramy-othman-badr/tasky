import { Location } from '@angular/common';
import { Injectable, NgZone } from '@angular/core';
import {
  ActionSheetController,
  AlertController,
  LoadingController,
  ModalController,
  NavController,
  Platform,
  PopoverController,
  ToastController,
} from '@ionic/angular';
import { Subject } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpService } from './http.service';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root',
})
export class InitService {
  loading: any;

  private fooSubject = new Subject<any>();

  appName = 'Tasky';
  appVersion = '0.0.1';

  connection_lost = false;

  platform_type = 'android'
  device_id

  userDetails: any = {}
  user = false

  priorities = [
    { id: 'low', name: 'low' },
    { id: 'medium', name: 'medium' },
    { id: 'high', name: 'high' },
  ]

  constructor(
    public router: Router,
    public route: ActivatedRoute,
    public navCtrl: NavController,
    public location: Location,
    public actionSheetController: ActionSheetController,
    public ngZone: NgZone,
    public storageService: StorageService,
    public modalController: ModalController,
    public alertController: AlertController,
    public loadingController: LoadingController,
    public toastController: ToastController,
    public platform: Platform,
    public httpService: HttpService,
    public popoverController: PopoverController
  ) { }

  async presentToast(msg: string, color?: string) {
    const toast = await this.toastController.create({
      cssClass: 'toast-msg',
      message: msg,
      color: color ? color : 'dark',
      duration: 3000,
    });
    toast.present();
  }
  back() {
    this.navCtrl.back();
  }
  async presentLoading() {
    this.loading = await this.loadingController.create({
      cssClass: 'loading-msg',
      message: 'Please wait ...',
    });
    await this.loading.present();
  }

  publishSomeData(data: any) {
    this.fooSubject.next(data);
  }

  getObservable(): Subject<any> {
    return this.fooSubject;
  }



  refreshToken() {
    var promoise = new Promise((resolve, reject) => {
      this.httpService.getRequest('auth/refresh-token', {
        token: this.httpService.refresh_token
      }).then((response: any) => {
        this.httpService.access_token = response.access_token
        this.storageService.getUserData().then((user: any) => {
          user.access_token = response.access_token
          this.storageService.storeUserData(user).then(() => {
            resolve(true)
          }).catch((err) => {
            reject(err)
          })
        }).catch((err) => {
          reject(err)
        })
      }).catch((err) => {
        reject(err)
      })
    });
    return promoise;
  }


}
