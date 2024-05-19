import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TaskAddPageRoutingModule } from './task-add-routing.module';

import { TaskAddPage } from './task-add.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TaskAddPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [TaskAddPage]
})
export class TaskAddPageModule { }
