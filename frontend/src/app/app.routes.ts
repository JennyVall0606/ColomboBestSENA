import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { AuthGuard } from './guards/auth.guard';
import { DashboardComponent } from './components/dashboard/dashboard.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent, title: 'Iniciar Sesión' },
  { path: 'register', component: RegisterComponent, title: 'Registro' },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard], title: 'Panel de Control' },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', redirectTo: 'login' }
];