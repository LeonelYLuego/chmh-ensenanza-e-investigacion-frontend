import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { NavComponent } from '@app/layout/nav/nav.component';
import { CoreModule } from '../core.module';
import { DataModule } from '@app/data/data.module';
import { AuthModule } from '@app/modules/auth/auth.module';
import { OthersModule } from '@app/modules/others/others.module';
import { ErrorPagesModule } from '@app/modules/error-pages/error-pages.module';

/** Application Module */
@NgModule({
  declarations: [AppComponent, NavComponent],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,

    CoreModule,
    DataModule,
    BrowserAnimationsModule,

    AuthModule,
    ErrorPagesModule,
    OthersModule,

    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
