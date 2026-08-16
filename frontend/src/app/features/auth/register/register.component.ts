import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="register-layout">
      <div class="form-card card">
        <div class="header">
          <div class="logo">F</div>
          <h2>Create FlowCRM Workspace</h2>
          <p>Onboard your company in less than 2 minutes</p>
        </div>

        <form [formGroup]="registerForm" (ngSubmit)="onSubmit()">
          <div class="grid-2">
            <div class="form-group">
              <label>First Name</label>
              <input type="text" formControlName="firstName" placeholder="Shiva" />
            </div>
            <div class="form-group">
              <label>Last Name</label>
              <input type="text" formControlName="lastName" placeholder="Kant" />
            </div>
          </div>

          <div class="form-group">
            <label>Work Email</label>
            <input type="email" formControlName="email" placeholder="shiva@acme.com" />
          </div>

          <div class="form-group">
            <label>Company / Organization Name</label>
            <input type="text" formControlName="companyName" placeholder="Acme Technologies Pvt Ltd" />
          </div>

          <div class="grid-2">
            <div class="form-group">
              <label>Industry</label>
              <select formControlName="industry">
                <option value="Software & IT Services">Software & IT</option>
                <option value="Real Estate">Real Estate</option>
                <option value="Education">Education</option>
                <option value="Financial Services">Financial Services</option>
                <option value="Manufacturing">Manufacturing</option>
              </select>
            </div>
            <div class="form-group">
              <label>Phone Number</label>
              <input type="text" formControlName="phone" placeholder="+91 9876543210" />
            </div>
          </div>

          <div class="form-group">
            <label>Password</label>
            <input type="password" formControlName="password" placeholder="Minimum 8 characters" />
          </div>

          <button type="submit" class="btn btn-primary submit-btn" [disabled]="loading()">
            @if (loading()) { Creating Workspace... } @else { Finish Setup & Launch }
          </button>
        </form>

        <div class="switch-auth">
          Already have an account? <a routerLink="/login">Sign in</a>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .register-layout {
      min-height: 100vh; display: flex; align-items: center; justify-content: center;
      background-color: var(--color-background); padding: 24px;
    }
    .form-card { width: 100%; max-width: 520px; padding: 36px; border: 1px solid var(--color-border); }
    .header { text-align: center; margin-bottom: 24px; }
    .logo {
      width: 44px; height: 44px; background: var(--color-primary); color: #fff;
      font-weight: 800; font-size: 24px; border-radius: var(--radius-md);
      display: flex; align-items: center; justify-content: center; margin: 0 auto 12px auto;
    }
    .header h2 { font-size: 22px; font-weight: 700; }
    .header p { font-size: 14px; color: var(--color-text-muted); }
    .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
    .form-group { margin-bottom: 16px; }
    .form-group label { display: block; font-size: 13px; font-weight: 600; margin-bottom: 6px; }
    input, select {
      width: 100%; padding: 10px 14px; font-size: 14px; border-radius: var(--radius-md);
      border: 1px solid var(--color-border); background-color: var(--color-surface);
      color: var(--color-text); outline: none;
    }
    .submit-btn { width: 100%; padding: 12px; font-size: 15px; margin-top: 12px; }
    .switch-auth { text-align: center; margin-top: 20px; font-size: 14px; color: var(--color-text-muted); }
    .switch-auth a { color: var(--color-primary); text-decoration: none; font-weight: 600; }
  `]
})
export class RegisterComponent {
  fb = inject(FormBuilder);
  authService = inject(AuthService);
  toastService = inject(ToastService);
  router = inject(Router);

  loading = signal(false);

  registerForm = this.fb.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    companyName: ['', Validators.required],
    industry: ['Software & IT Services'],
    phone: [''],
    password: ['', [Validators.required, Validators.minLength(8)]]
  });

  onSubmit() {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    this.authService.register(this.registerForm.value).subscribe({
      next: (res) => {
        this.loading.set(false);
        if (res.success) {
          this.toastService.success('Workspace created successfully!');
          this.router.navigate(['/app/dashboard']);
        }
      },
      error: (err) => {
        this.loading.set(false);
        this.toastService.error(err.error?.message || 'Registration failed');
      }
    });
  }
}
