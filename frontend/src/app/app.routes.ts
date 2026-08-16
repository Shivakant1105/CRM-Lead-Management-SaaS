import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { LoginComponent } from './features/auth/login/login.component';
import { RegisterComponent } from './features/auth/register/register.component';
import { ShellComponent } from './layout/shell/shell.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { SettingsComponent } from './features/settings/settings.component';
import { ProfileComponent } from './features/profile/profile.component';
import { ComingSoonComponent } from './features/coming-soon/coming-soon.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  {
    path: 'app',
    component: ShellComponent,
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'settings', component: SettingsComponent },
      { path: 'profile', component: ProfileComponent },
      
      // Placeholder routes for Phase 2+ modules
      { path: 'leads', component: ComingSoonComponent, data: { title: 'Lead Management', icon: '🎯', phase: 'Phase 2' } },
      { path: 'pipeline', component: ComingSoonComponent, data: { title: 'Sales Pipeline Kanban', icon: '📈', phase: 'Phase 4' } },
      { path: 'customers', component: ComingSoonComponent, data: { title: 'Customer 360 & Contacts', icon: '👥', phase: 'Phase 5' } },
      { path: 'activities', component: ComingSoonComponent, data: { title: 'Activities & Tasks', icon: '📅', phase: 'Phase 3' } },
      { path: 'quotations', component: ComingSoonComponent, data: { title: 'Quotations & Proposal Builder', icon: '📄', phase: 'Phase 7' } },
      { path: 'invoices', component: ComingSoonComponent, data: { title: 'Invoices & Billing', icon: '💳', phase: 'Phase 11' } },
      { path: 'payments', component: ComingSoonComponent, data: { title: 'Payment Gateway Tracking', icon: '💰', phase: 'Phase 13' } },
      { path: 'reports', component: ComingSoonComponent, data: { title: 'Reports & Business Analytics', icon: '📉', phase: 'Phase 20' } }
    ]
  },
  { path: '**', redirectTo: 'login' }
];
