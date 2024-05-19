import { Component, OnInit } from '@angular/core';
import { InitService } from 'src/app/services';
import {
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { ListCompComponent } from 'src/app/components/list-comp/list-comp.component';
import { DatePicker, DatePickerOptions } from '@capacitor-community/date-picker';
import { HttpHeaders } from '@angular/common/http';


@Component({
  selector: 'app-task-add',
  templateUrl: './task-add.page.html',
  styleUrls: ['./task-add.page.scss'],
})
export class TaskAddPage implements OnInit {

  taskDetailsForm: FormGroup;

  constructor(public initService: InitService, private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.taskDetailsForm = this.formBuilder.group({
      image: ['', [Validators.required]],
      title: ['', [Validators.required]],
      desc: ['', [Validators.required]],
      selected_priority: '',
      priority: ['', [Validators.required]],
      dueDate: ['', [Validators.required]],
    });
  }

  dismissModal() {
    this.initService.modalController.dismiss()
  }

  async selectImage() {
    await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Prompt // Use CameraSource.Photos to select from gallery
    }).then((image) => {
      this.getPhotoBlob(image.dataUrl)
    })
  }

  getPhotoBlob(dataUrl) {
    try {
      const contentType = 'image/jpeg'; // Adjust if you expect other types
      const blob = this.base64ToBlob(dataUrl, contentType);
      this.uploadImage(blob)
      return blob;
    } catch (error) {
      console.error('Error getting photo blob:', error);
      throw error;
    }
  }

  base64ToBlob(base64, contentType = '', sliceSize = 512) {
    const byteCharacters = atob(base64.split(',')[1]);
    const byteArrays = [];
  
    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize);
  
      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
  
      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }
  
    const blob = new Blob(byteArrays, { type: contentType });
    return blob;
  }



  async uploadImage(blob) {
    const formData = new FormData();
    formData.append('image', blob);

    let httpOptions = {
      headers: new HttpHeaders({
        Authorization: `Bearer ${this.initService.httpService.access_token}`,
      }),
    };

    this.initService.httpService.http
      .post(
        this.initService.httpService.url + 'upload/image',
        formData,
        httpOptions
      )
      .subscribe(
        (response: any) => {
          this.taskDetailsForm.get('image').setValue(response.image)
        },
        (error) => {
        }
      );
  }

  async selectPriority() {
    let modal = await this.initService.modalController.create({
      component: ListCompComponent,
      cssClass: 'priority-modal',
      componentProps: {
        items: this.initService.priorities,
        default_value: this.taskDetailsForm.get('priority').value,
        type: 'single',
        list_title: 'Select Priority'
      },
      breakpoints: [1],
      initialBreakpoint: 1,
    });
    modal.onDidDismiss().then((data) => {
      if (data.data && data.data?.selected_value) {
        this.taskDetailsForm.get('selected_priority').setValue(data.data?.selected_value.name)
        this.taskDetailsForm.get('priority').setValue(data.data?.selected_value.id)
      }
    });
    modal.present();
  }


  async selectDueDate() {
    let params: DatePickerOptions = {
      mode: 'date',
      android: {
        format: 'dd/MM/yyyy',
      },
      ios: {
        format: 'dd/MM/yyyy',
      },
    }

    if (this.taskDetailsForm.get('dueDate').value) {
      const dateObj = new Date(this.taskDetailsForm.get('dueDate').value);
      const isoDateString = dateObj.toISOString()
      params.date = isoDateString
    }

    let min_date = new Date()
    params.min = min_date.toISOString()
    DatePicker.present(params).then((value) => {
      const dateObj = new Date(value.value);
      // Extract the date part
      const dateOnlyString = dateObj.toISOString().split('T')[0];
      this.taskDetailsForm.get('dueDate').setValue(dateOnlyString)
    })
  }



  async addTask(no_loading?) {
    if (this.taskDetailsForm.valid) {
      if (!no_loading) {
        await this.initService.presentLoading()
      }
      this.initService.httpService.postRequest('todos', this.taskDetailsForm.value).then((response: any) => {
        this.initService.modalController.dismiss({ addedd: true })
        this.initService.loading.dismiss()
      }).catch((err) => {
        console.log(err)
        if (err.status == 401) {
          this.initService.refreshToken().then(() => {
            this.addTask(true);
          })
        }
      })
    }
  }



}