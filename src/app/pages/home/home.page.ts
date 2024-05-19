import { Component, OnInit } from '@angular/core';
import { InitService, QrcodeService } from 'src/app/services';
import { TaskAddPage } from '../task-add/task-add.page';
import { LogoutComponent } from 'src/app/components/user/logout/logout.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  segments = [
    { id: 'all', name: 'All' },
    { id: 'inprogress', name: 'Inprogress' },
    { id: 'waiting', name: 'Waiting' },
    { id: 'finished', name: 'Finished' },
  ]

  segment_value = this.segments[0].id

  loading = true
  loading_array = [1, 1, 1, 1, 1, 1, 1, 1]
  filter = {
    page: 1
  }
  items = []

  tasks_events

  constructor(public initService: InitService, public qrcodeService: QrcodeService) {
    this.tasks_events = this.initService.getObservable().subscribe((data) => {
      if (data == 'tasks_changed') {
        this.initService.ngZone.run(() => {
          this.getItems('refresh')
        })
      }
    })
  }


  ionViewDidEnter() {
    this.initService.platform.backButton.subscribe(() => {
      let modals = document.querySelectorAll('ion-modal');
      if (modals.length > 0) {
        this.initService.modalController.dismiss()
      } else {
        if (this.initService.router.url == '/home') {
          navigator['app'].exitApp();
        }
      }
    });
  }



  ngOnInit() {
    this.getItems('refresh');
  }

  segmentsChange() {
    this.filter = {
      page: 1,
    }
    this.getItems('refresh');
  }



  getItems(type?, event?) {
    if (type == 'refresh') {
      this.loading = true;
      this.items = [];
      this.filter.page = 1;
    }
    this.initService.httpService
      .getRequest('todos', this.filter)
      .then((response: any) => {
        if (response && response.length != 0) {
          for (var i in response) {
            this.items.push(response[i]);
          }
          this.filter.page++;
        }
        this.loading = false;
        if (event) {
          event.target.complete();
        }
      })
      .catch((err) => {
        if (event) {
          event.target.complete();
        }
        if (err.status == 401) {
          this.initService.refreshToken().then(() => {
            this.getItems(type, event);
          })
        }
      });
  }


  doRefresh(event) {
    this.getItems('refresh', event);
  }

  doInfinite(event) {
    this.getItems('', event);
  }

  openTask(taskID) {
    this.initService.navCtrl.navigateForward([`task-details/${taskID}`])
  }

  taskOptions(task, event) {
    event.stopPropagation()
    this.initService.presentToast('not done yet', 'danger')
  }

  scanQRCode() {
    this.qrcodeService.scanQR()
  }

  async addTask() {
    let modal = await this.initService.modalController.create({
      component: TaskAddPage,
      breakpoints: [1],
      initialBreakpoint: 1,
    });
    modal.onDidDismiss().then((data) => {
      if (data.data && data.data?.addedd) {
        this.getItems('refresh');
      }
    });
    modal.present();
  }

  openPage(page) {
    this.initService.navCtrl.navigateForward([page])
  }

  async logout() {
    let modal = await this.initService.modalController.create({
      component: LogoutComponent,
      breakpoints: [0.6],
      initialBreakpoint: 0.6,
      cssClass: 'logout-modal',
      backdropDismiss: true,
    });
    modal.onDidDismiss().then(async (data) => {
      if (data.data && data.data?.confirmed) {
        await this.initService.presentLoading()
        await this.initService.httpService.postRequest('auth/logout').then((response: any) => {
          this.clearUserData()
        }).catch((err) => {
          this.clearUserData()
        })
      }
    });
    modal.present();
  }



  clearUserData() {
    this.initService.storageService.removeUserData().then(() => {
      this.initService.user = false
      this.initService.httpService.access_token = ''
      this.initService.httpService.refresh_token = ''
      this.initService.userDetails = {}
      this.initService.loading.dismiss()
      this.initService.navCtrl.navigateRoot(['intro'])
    }).catch((err) => {

    })
  }



  truncateString(text, maxLength): string {
    if (text.length > maxLength) {
      return text.substring(0, maxLength) + "...";
    }
    return text;
  }


}
