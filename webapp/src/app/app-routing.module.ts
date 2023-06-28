import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Connect4GridComponent } from './connect4-grid/connect4-grid.component';
import {SwaggerUIComponent} from "./swagger-ui/swagger-ui.component";

const routes: Routes = [
  { path: '', component: Connect4GridComponent },
  {
    path: 'swagger',
    component: SwaggerUIComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
