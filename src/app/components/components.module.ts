import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingComponent } from './app/loading/loading.component';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ConnectionComponent } from './app/connection/connection.component';
import { LogoutComponent } from './user/logout/logout.component';
import { ListCompComponent } from './list-comp/list-comp.component';


let comps = [
  LoadingComponent,
  ConnectionComponent,
  LogoutComponent,
  ListCompComponent
];
@NgModule({
  declarations: [comps],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [comps],
})
export class ComponentsModule { }
