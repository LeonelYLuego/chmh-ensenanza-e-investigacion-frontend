import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from '../routing/app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CoreModule } from '../core.module';
import { NavComponent } from 'app/layout/nav';
import { DataModule } from '@data/data.module';
import { SharedModule } from '@shared/shared.module';
import { AuthModule } from '@auth/auth.module';
import { ErrorPagesModule } from '@error-pages/error-pages.module';
import { OthersModule } from '@others/others.module';
import { SocialServicesModule } from '@social-services/social-services.module';
import { OptionalMobilitiesModule } from 'app/modules/optional-mobilities/optional-mobilities.module';
import { ObligatoryMobilitiesModule } from 'app/modules/obligatory-mobilities/obligatory-mobilities.module';
import { IncomingStudentsModule } from 'app/modules/incoming-students/incoming-students.module';

/** Application Module */
@NgModule({
  declarations: [AppComponent, NavComponent],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,

    CoreModule,
    DataModule,
    SharedModule,
    BrowserAnimationsModule,

    AuthModule,
    ErrorPagesModule,
    OthersModule,
    SocialServicesModule,
    OptionalMobilitiesModule,
    ObligatoryMobilitiesModule,
    IncomingStudentsModule,

    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
