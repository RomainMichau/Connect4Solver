import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {Connect4GridComponent} from './connect4-grid/connect4-grid.component';
import {HttpClientModule} from "@angular/common/http";
import {ApiModule, Configuration} from "../services";
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {ToastrModule} from 'ngx-toastr';
import {FormsModule} from "@angular/forms";
import { SwaggerUIComponent } from './swagger-ui/swagger-ui.component';


@NgModule({
  declarations: [
    AppComponent,
    Connect4GridComponent,
    SwaggerUIComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    ApiModule.forRoot(() => {
      return new Configuration({
        basePath: ``,
      })
    }),
    BrowserAnimationsModule,
    ToastrModule.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
