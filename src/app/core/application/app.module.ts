import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AuthModule } from '@auth/auth.module';
import { CoreModule } from '@core/core.module';
import { DataModule } from '@data/data.module';
import { ErrorPagesModule } from '@error-pages/error-pages.module';
import { IncomingStudentsModule } from '@incoming-students/incoming-students.module';
import { ObligatoryMobilitiesModule } from '@obligatory-mobilities/obligatory-mobilities.module';
import { OptionalMobilitiesModule } from '@optional-mobilities/optional-mobilities.module';
import { OthersModule } from '@others/others.module';
import { SharedModule } from '@shared/shared.module';
import { SocialServicesModule } from '@social-services/social-services.module';
import { NavComponent } from 'app/layout/nav';
import { AppRoutingModule } from '.';
import { AppComponent } from './app.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

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
    MatMenuModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
