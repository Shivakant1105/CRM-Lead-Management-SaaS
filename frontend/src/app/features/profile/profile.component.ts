import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="profile-page">
      <div class="page-title">
        <h1>User Profile</h1>
        <p>Manage your account settings and personal profile details</p>
      </div>

      <div class="card profile-card">
        <div class="profile-header">
          <div class="avatar-large">{{ initials() }}</div>
          <div class="info">
            <h2>{{ authService.currentUser()?.firstName }} {{ authService.currentUser()?.lastName }}</h2>
            <p>{{ authService.currentUser()?.email }}</p>
            <span class="badge badge-primary">{{ role() }}</span>
          </div>
        </div>

        <form [formGroup]="profileForm" (ngSubmit)="saveProfile()">
          <div class="grid-2">
            <div class="form-group">
              <label>First Name</label>
              <input type="text" formControlName="firstName" />
            </div>
            <div class="form-group">
              <label>Last Name</label>
              <input type="text" formControlName="lastName" />
            </div>
          </div>

          <div class="form-group">
            <label>Phone Number</label>
            <input type="text" formControlName="phone" />
          </div>

          <button type="submit" class="btn btn-primary">Update Profile</button>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .profile-page { display: flex; flex-direction: column; gap: 24px; max-width: 680px; }
    .page-title h1 { font-size: 24px; font-weight: 800; }
    .page-title p { color: var(--color-text-muted); font-size: 14px; }
    .profile-card { padding: 32px; }
    .profile-header { display: flex; align-items: center; gap: 20px; margin-bottom: 28px; }
    .avatar-large {
      width: 64px; height: 64px; border-radius: var(--radius-full); background: var(--color-primary);
      color: #fff; font-size: 24px; font-weight: 800; display: flex; align-items: center; justify-content: center;
    }
    .info h2 { font-size: 20px; font-weight: 700; margin-bottom: 2px; }
    .info p { font-size: 14px; color: var(--color-text-muted); margin-bottom: 8px; }
    .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
    .form-group { margin-bottom: 20px; }
    .form-group label { display: block; font-size: 13px; font-weight: 600; margin-bottom: 6px; }
    input {
      width: 100%; padding: 10px 14px; font-size: 14px; border-radius: var(--radius-md);
      border: 1px solid var(--color-border); background: var(--color-surface); color: var(--color-text); outline: none;
    }
  `]
})
export class ProfileComponent {
  authService = inject(AuthService);
  toastService = inject(ToastService);
  fb = inject(FormBuilder);

  profileForm = this.fb.group({
    firstName: [this.authService.currentUser()?.firstName || 'Shiva', Validators.required],
    lastName: [this.authService.currentUser()?.lastName || 'Admin', Validators.required],
    phone: ['+91 9876543210']
  });

  initials(): string {
    const user = this.authService.currentUser();
    return user ? (user.firstName.charAt(0) + user.lastName.charAt(0)).toUpperCase() : 'FL';
  }

  role(): string {
    const roles = this.authService.currentUser()?.roles;
    return roles && roles.length > 0 ? roles[0] : 'TENANT_ADMIN';
  }

  saveProfile() {
    this.toastService.success('Profile updated successfully');
  }
}
