import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TaskAddPage } from './task-add.page';

const routes: Routes = [
  {
    path: '',
    component: TaskAddPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TaskAddPageRoutingModule {}
