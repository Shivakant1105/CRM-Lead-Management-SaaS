import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="settings-page">
      <div class="page-title">
        <h1>Workspace & System Settings</h1>
        <p>Manage company profile, RBAC user access, and system configurations</p>
      </div>

      <div class="settings-tabs">
        <button [class.active]="activeTab() === 'company'" (click)="activeTab.set('company')">Company Settings</button>
        <button [class.active]="activeTab() === 'users'" (click)="activeTab.set('users')">User Management</button>
        <button [class.active]="activeTab() === 'roles'" (click)="activeTab.set('roles')">Roles & RBAC Permissions</button>
      </div>

      <!-- Company Settings Tab -->
      @if (activeTab() === 'company') {
        <div class="card settings-card">
          <h3>Company Information</h3>
          <form [formGroup]="companyForm" (ngSubmit)="saveCompany()">
            <div class="grid-2">
              <div class="form-group">
                <label>Company Name</label>
                <input type="text" formControlName="companyName" />
              </div>
              <div class="form-group">
                <label>Tax / GST Number</label>
                <input type="text" formControlName="taxNumber" />
              </div>
            </div>

            <div class="grid-2">
              <div class="form-group">
                <label>Email Address</label>
                <input type="email" formControlName="email" />
              </div>
              <div class="form-group">
                <label>Phone Number</label>
                <input type="text" formControlName="phone" />
              </div>
            </div>

            <div class="grid-2">
              <div class="form-group">
                <label>Default Currency</label>
                <select formControlName="currency">
                  <option value="INR">INR (₹)</option>
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                </select>
              </div>
              <div class="form-group">
                <label>Timezone</label>
                <select formControlName="timezone">
                  <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
                  <option value="UTC">UTC</option>
                  <option value="America/New_York">America/New_York (EST)</option>
                </select>
              </div>
            </div>

            <button type="submit" class="btn btn-primary">Save Company Settings</button>
          </form>
        </div>
      }

      <!-- User Management Tab -->
      @if (activeTab() === 'users') {
        <div class="card settings-card">
          <div class="tab-header">
            <h3>Active Workspace Users</h3>
            <button class="btn btn-primary" (click)="toastService.info('Invite user modal')">+ Invite User</button>
          </div>

          <table class="data-table">
            <thead>
              <tr>
                <th>User Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Shiva Admin</strong></td>
                <td>demo.admin&#64;flowcrm.local</td>
                <td><span class="badge badge-primary">TENANT_ADMIN</span></td>
                <td><span class="badge badge-success">ACTIVE</span></td>
              </tr>
              <tr>
                <td><strong>Rajesh Kumar</strong></td>
                <td>sales.manager&#64;flowcrm.local</td>
                <td><span class="badge badge-primary">SALES_MANAGER</span></td>
                <td><span class="badge badge-success">ACTIVE</span></td>
              </tr>
              <tr>
                <td><strong>Priya Sharma</strong></td>
                <td>sales.executive&#64;flowcrm.local</td>
                <td><span class="badge badge-primary">SALES_EXECUTIVE</span></td>
                <td><span class="badge badge-success">ACTIVE</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      }

      <!-- Roles Tab -->
      @if (activeTab() === 'roles') {
        <div class="card settings-card">
          <h3>Role Permission Matrix</h3>
          <p class="sub-text">Permissions are strictly enforced on Spring Boot API controllers</p>

          <table class="data-table">
            <thead>
              <tr>
                <th>Role Name</th>
                <th>Description</th>
                <th>Granted Permissions</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>TENANT_ADMIN</strong></td>
                <td>Full administrative access</td>
                <td>All Permissions Granted</td>
              </tr>
              <tr>
                <td><strong>SALES_MANAGER</strong></td>
                <td>Manages sales team & deals</td>
                <td>DASHBOARD, LEAD_ALL, CUSTOMER_ALL, QUOTATION_VIEW</td>
              </tr>
              <tr>
                <td><strong>SALES_EXECUTIVE</strong></td>
                <td>Handles assigned leads</td>
                <td>DASHBOARD, LEAD_VIEW/CREATE, CUSTOMER_VIEW</td>
              </tr>
            </tbody>
          </table>
        </div>
      }
    </div>
  `,
  styles: [`
    .settings-page { display: flex; flex-direction: column; gap: 24px; }
    .page-title h1 { font-size: 24px; font-weight: 800; }
    .page-title p { color: var(--color-text-muted); font-size: 14px; }
    .settings-tabs { display: flex; gap: 12px; border-bottom: 1px solid var(--color-border); padding-bottom: 12px; }
    .settings-tabs button {
      background: none; border: none; padding: 10px 18px; font-size: 14px; font-weight: 600;
      color: var(--color-text-muted); cursor: pointer; border-radius: var(--radius-md); transition: all 150ms;
    }
    .settings-tabs button.active { background: var(--color-primary-light); color: var(--color-primary); }
    .settings-card { padding: 28px; }
    .settings-card h3 { font-size: 18px; font-weight: 700; margin-bottom: 20px; }
    .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
    .form-group { margin-bottom: 20px; }
    .form-group label { display: block; font-size: 13px; font-weight: 600; margin-bottom: 6px; }
    input, select {
      width: 100%; padding: 10px 14px; font-size: 14px; border-radius: var(--radius-md);
      border: 1px solid var(--color-border); background: var(--color-surface); color: var(--color-text); outline: none;
    }
    .tab-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
    .data-table { width: 100%; border-collapse: collapse; text-align: left; }
    .data-table th, .data-table td { padding: 14px 16px; border-bottom: 1px solid var(--color-border); font-size: 14px; }
    .data-table th { font-weight: 700; color: var(--color-text-subtle); background: var(--color-background); }
    .sub-text { color: var(--color-text-muted); font-size: 13px; margin-bottom: 16px; }
  `]
})
export class SettingsComponent {
  fb = inject(FormBuilder);
  toastService = inject(ToastService);

  activeTab = signal<'company' | 'users' | 'roles'>('company');

  companyForm = this.fb.group({
    companyName: ['FlowCRM Demo Technologies Pvt Ltd'],
    taxNumber: ['GSTIN987654321'],
    email: ['contact@flowcrm.local'],
    phone: ['+91 9876543210'],
    currency: ['INR'],
    timezone: ['Asia/Kolkata']
  });

  saveCompany() {
    this.toastService.success('Company settings updated successfully');
  }
}
