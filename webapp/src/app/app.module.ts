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
import {SwaggerUIComponent} from './swagger-ui/swagger-ui.component';
import {MatSidenavModule} from "@angular/material/sidenav";
import {MatIconModule} from "@angular/material/icon";
import {FlexLayoutModule} from '@angular/flex-layout';
import {RouterModule} from "@angular/router";
import {MatButtonModule} from "@angular/material/button";
import {MatSliderModule} from "@angular/material/slider";
import {MatSlideToggleModule} from "@angular/material/slide-toggle";
import {MatTableModule} from "@angular/material/table";
import {MatSnackBarModule} from "@angular/material/snack-bar";
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatInputModule} from "@angular/material/input";

@NgModule({
  declarations: [
    AppComponent,
    Connect4GridComponent,
    SwaggerUIComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    MatSidenavModule,
    MatIconModule,
    FlexLayoutModule,
    RouterModule,
    MatButtonModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatTableModule,
    MatToolbarModule,
    MatInputModule,
    ApiModule.forRoot(() => {
      return new Configuration({
        basePath: ``,
      })
    }),
    BrowserAnimationsModule,
  ],
  exports: [MatSlideToggleModule, MatInputModule],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
