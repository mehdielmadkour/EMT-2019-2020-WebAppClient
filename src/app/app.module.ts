import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { MatCardModule } from '@angular/material';
import { MatGridListModule } from '@angular/material';
import { NgxAudioPlayerModule } from 'ngx-audio-player';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from './navbar/navbar.component';
import { RegisterComponent } from './register/register.component';
import { TrackingComponent } from './tracking/tracking.component';
import { SignalementComponent } from './signalement/signalement.component';
import { AdminPanelComponent } from './admin-panel/admin-panel.component';
import { StrategyComponent } from './strategy/strategy.component';
import { DownloadComponent } from './download/download.component';
import { CarSimulationComponent } from './car-simulation/car-simulation.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MapEditorComponent } from './map-editor/map-editor.component';
import { RecoveryComponent } from './recovery/recovery.component';
import { ResetComponent } from './reset/reset.component';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    NavbarComponent,
    RegisterComponent,
    TrackingComponent,
    SignalementComponent,
    AdminPanelComponent,
    StrategyComponent,
    DownloadComponent,
    CarSimulationComponent,
    MapEditorComponent,
    RecoveryComponent,
    ResetComponent
  ],
  imports: [
    FormsModule,
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    AppRoutingModule,
    NgbModule,
    ServiceWorkerModule.register('./ngsw-worker.js', { enabled: environment.production }),
    BrowserAnimationsModule,
    MatCardModule,
    MatGridListModule,
    NgxAudioPlayerModule
  ],
  providers: [{provide: LocationStrategy, useClass: HashLocationStrategy}],
  bootstrap: [AppComponent]
})
export class AppModule { }
