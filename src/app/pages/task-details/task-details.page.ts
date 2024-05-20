import { Component, OnInit, ViewChild } from '@angular/core';
import { ListCompComponent } from 'src/app/components/list-comp/list-comp.component';
import { InitService } from 'src/app/services';
import { TaskAddPage } from '../task-add/task-add.page';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-task-details',
  templateUrl: './task-details.page.html',
  styleUrls: ['./task-details.page.scss'],
})
export class TaskDetailsPage implements OnInit {

  @ViewChild('popover') popover;
  taskID
  isOpen = false;

  loading = true
  taskDetails: any = {}

  statuss = [
    { id: 'waiting', name: 'Waiting' },
    { id: 'inProgress', name: 'InProgress' },
    { id: 'finished', name: 'Finished' },
  ]

  constructor(private router: ActivatedRoute, public initService: InitService) { }

  ngOnInit() {
    this.taskID = this.router.snapshot.paramMap.get('taskID');
    this.getTaskDetails()
  }

  taskOptions(e: Event) {
    this.popover.event = e;
    this.isOpen = true;
  }


  getTaskDetails(event?) {
    this.loading = true
    this.initService.httpService.getRequest(`todos/${this.taskID}`).then((response: any) => {
      if (response) {
        this.taskDetails = response
        this.loading = false
      } else {
        this.initService.navCtrl.pop()
      }
      if (event) {
        event.target.complete();
      }
    }).catch((err) => {
      if (event) {
        event.target.complete();
      }
      if (err.status == 401) {
        this.initService.refreshToken().then(() => {
          this.getTaskDetails(event);
        })
      }
    })
  }

  doRefresh(event) {
    this.getTaskDetails(event);
  }


  async editTask() {
    this.isOpen = false
    let modal = await this.initService.modalController.create({
      component: TaskAddPage,
      componentProps: {
        taskDetails: this.taskDetails,
      },
      breakpoints: [1],
      initialBreakpoint: 1,
    });
    modal.onDidDismiss().then((data) => {
      if (data.data && data.data?.edited) {
        this.getTaskDetails()
      }
    });
    modal.present();
  }

  async deleteTask(no_loading?) {
    this.isOpen = false
    if (!no_loading) {
      await this.initService.presentLoading()
    }
    this.initService.httpService.deleteRequest(`todos/${this.taskID}`).then((response: any) => {
      this.initService.loading.dismiss()
      this.initService.navCtrl.pop()
      this.initService.publishSomeData('tasks_changed')
    }).catch((err) => {
      if (err.status == 401) {
        this.initService.refreshToken().then(() => {
          this.deleteTask(true);
        })
      }
    })
  }



  async selectStatus() {
    let modal = await this.initService.modalController.create({
      component: ListCompComponent,
      cssClass: 'select-status-modal',
      componentProps: {
        items: this.statuss,
        default_value: this.taskDetails.status,
        type: 'single',
        list_title: 'Select Stauts'
      },
      breakpoints: [1],
      initialBreakpoint: 1,
    });
    modal.onDidDismiss().then((data) => {
      if (data.data && data.data?.selected_value) {
        this.updateTask(false, data.data?.selected_value.id)
      }
    });
    modal.present();
  }

  async updateTask(no_loading, status) {
    if (!no_loading) {
      await this.initService.presentLoading()
    }
    this.initService.httpService.putRequest(`todos/${this.taskID}`, {
      status: status
    }).then((response: any) => {
      this.isOpen = false
      this.initService.loading.dismiss()
      this.getTaskDetails()
      this.initService.publishSomeData('tasks_changed')
    }).catch((err) => {
      if (err.status == 401) {
        this.initService.refreshToken().then(() => {
          this.updateTask(true, status);
        })
      }
    })
  }


  async selectPriority() {
    /*     let modal = await this.initService.modalController.create({
          component: ListCompComponent,
          cssClass: 'priority-modal',
          componentProps: {
            items: this.initService.priorities,
            default_value: this.taskDetails.priority,
            type: 'single',
            list_title: 'Select Priority'
          },
          breakpoints: [1],
          initialBreakpoint: 1,
        });
        modal.onDidDismiss().then((data) => {
          if (data.data && data.data?.selected_value) {
          }
        });
        modal.present(); */
  }




}
