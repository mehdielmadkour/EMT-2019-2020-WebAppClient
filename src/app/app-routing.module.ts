import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { AuthGuard } from './service/auth/auth.guard';
import { RegisterComponent } from './register/register.component';
import { TrackingComponent } from './tracking/tracking.component';
import { SignalementComponent } from './signalement/signalement.component';
import { AdminPanelComponent } from './admin-panel/admin-panel.component';
import { StrategyComponent } from './strategy/strategy.component';
import { DownloadComponent } from './download/download.component';
import { CarSimulationComponent } from './car-simulation/car-simulation.component';
import { MapEditorComponent } from './map-editor/map-editor.component';
import { RecoveryComponent } from './recovery/recovery.component';
import { ResetComponent } from './reset/reset.component';


const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'register',
    component: RegisterComponent
  },
  {
    path: 'tracking',
    canActivate: [AuthGuard],
    component: TrackingComponent
  },
  {
    path: 'signalement',
    canActivate: [AuthGuard],
    component: SignalementComponent
  },
  {
    path: 'admin-panel',
    canActivate: [AuthGuard],
    component: AdminPanelComponent
  },
  {
    path: 'strategy',
    canActivate: [AuthGuard],
    component: StrategyComponent
  },
  {
    path: 'download',
    canActivate: [AuthGuard],
    component: DownloadComponent
  },
  {
    path: 'simulation',
    canActivate: [AuthGuard],
    component: CarSimulationComponent
  },
  {
    path: 'editor',
    canActivate: [AuthGuard],
    component: MapEditorComponent
  },
  {
    path: 'recovery',
    component: RecoveryComponent
  },
  {
    path: 'reset',
    component: ResetComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {onSameUrlNavigation: 'reload'})],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AppRoutingModule { }
