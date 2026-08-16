import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="login-layout">
      <!-- Left Visual Panel -->
      <div class="brand-panel">
        <div class="brand-header">
          <div class="logo-mark">F</div>
          <span class="brand-title">Flow<span>CRM</span></span>
        </div>

        <div class="hero-content">
          <h1>Enterprise Sales Command Center</h1>
          <p>Supercharge your sales velocity with multi-tenant intelligence, pipeline automation, and financial workflows.</p>

          <div class="metrics-preview card">
            <div class="metric-item">
              <span class="m-val">₹24.8L</span>
              <span class="m-lbl">Pipeline Value</span>
            </div>
            <div class="metric-item">
              <span class="m-val">+18.4%</span>
              <span class="m-lbl">Conversion Rate</span>
            </div>
            <div class="metric-item">
              <span class="m-val">99.9%</span>
              <span class="m-lbl">Uptime SLA</span>
            </div>
          </div>
        </div>

        <div class="footer-note">© 2026 FlowCRM Platform Inc. All rights reserved.</div>
      </div>

      <!-- Right Login Card Form -->
      <div class="form-panel">
        <div class="form-card card">
          <h2>Welcome back to FlowCRM 👋</h2>
          <p class="subtitle">Sign in to access your enterprise workspace</p>

          <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
            <div class="form-group">
              <label>Email Address</label>
              <input type="email" formControlName="email" placeholder="name@company.com" [class.invalid]="isInvalid('email')" />
              <div class="error-text" *ngIf="isInvalid('email')">Please enter a valid email address</div>
            </div>

            <div class="form-group">
              <div class="label-row">
                <label>Password</label>
                <a routerLink="/forgot-password" class="forgot-link">Forgot password?</a>
              </div>
              <input type="password" formControlName="password" placeholder="••••••••" [class.invalid]="isInvalid('password')" />
              <div class="error-text" *ngIf="isInvalid('password')">Password is required</div>
            </div>

            <div class="form-group checkbox-group">
              <input type="checkbox" id="remember" formControlName="remember" />
              <label for="remember">Remember me for 30 days</label>
            </div>

            <button type="submit" class="btn btn-primary submit-btn" [disabled]="loading()">
              @if (loading()) { Logging in... } @else { Sign In }
            </button>
          </form>

          <div class="demo-seed-box">
            <div class="seed-title">💡 Demo Credentials:</div>
            <div class="seed-credentials" (click)="fillDemo('demo.admin@flowcrm.local')">
              <strong>Admin:</strong> demo.admin&#64;flowcrm.local / Password123!
            </div>
            <div class="seed-credentials" (click)="fillDemo('sales.manager@flowcrm.local')">
              <strong>Manager:</strong> sales.manager&#64;flowcrm.local / Password123!
            </div>
          </div>

          <div class="switch-auth">
            Don't have a workspace? <a routerLink="/register">Onboard your company</a>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .login-layout { display: flex; min-height: 100vh; background-color: var(--color-background); }
    .brand-panel {
      flex: 1.2; background: linear-gradient(135deg, #0F172A 0%, #1E1B4B 100%);
      color: #fff; padding: 48px; display: flex; flex-direction: column; justify-content: space-between;
    }
    .brand-header { display: flex; align-items: center; gap: 12px; }
    .logo-mark {
      width: 42px; height: 42px; border-radius: var(--radius-md);
      background: var(--color-primary); color: #fff; font-weight: 800; font-size: 22px;
      display: flex; align-items: center; justify-content: center;
    }
    .brand-title { font-size: 24px; font-weight: 800; }
    .brand-title span { color: var(--color-primary); }
    .hero-content { max-width: 520px; margin: auto 0; }
    .hero-content h1 { font-size: 38px; font-weight: 800; line-height: 1.2; margin-bottom: 16px; }
    .hero-content p { font-size: 16px; color: #94A3B8; margin-bottom: 32px; }
    .metrics-preview {
      display: flex; justify-content: space-between; background: rgba(255, 255, 255, 0.05);
      border-color: rgba(255, 255, 255, 0.1); color: #fff; padding: 20px;
    }
    .metric-item { display: flex; flex-direction: column; }
    .m-val { font-size: 20px; font-weight: 700; color: #818CF8; }
    .m-lbl { font-size: 12px; color: #94A3B8; }
    .footer-note { font-size: 13px; color: #64748B; }

    .form-panel { flex: 1; display: flex; align-items: center; justify-content: center; padding: 32px; }
    .form-card { width: 100%; max-width: 440px; padding: 36px; border: 1px solid var(--color-border); }
    .form-card h2 { font-size: 22px; font-weight: 700; margin-bottom: 6px; }
    .subtitle { font-size: 14px; color: var(--color-text-muted); margin-bottom: 24px; }
    .form-group { margin-bottom: 20px; }
    .form-group label { display: block; font-size: 13px; font-weight: 600; margin-bottom: 6px; }
    .label-row { display: flex; justify-content: space-between; align-items: center; }
    .forgot-link { font-size: 13px; color: var(--color-primary); text-decoration: none; }
    input[type="email"], input[type="password"] {
      width: 100%; padding: 12px 14px; font-size: 14px; border-radius: var(--radius-md);
      border: 1px solid var(--color-border); background-color: var(--color-surface);
      color: var(--color-text); outline: none; transition: border 150ms;
    }
    input.invalid { border-color: var(--color-danger); }
    .error-text { font-size: 12px; color: var(--color-danger); margin-top: 4px; }
    .checkbox-group { display: flex; align-items: center; gap: 8px; font-size: 13px; }
    .submit-btn { width: 100%; padding: 12px; font-size: 15px; margin-top: 8px; }
    .demo-seed-box {
      margin-top: 24px; padding: 12px; border-radius: var(--radius-md);
      background-color: var(--color-surface-hover); border: 1px solid var(--color-border); font-size: 12px;
    }
    .seed-title { font-weight: 700; margin-bottom: 6px; color: var(--color-primary); }
    .seed-credentials { cursor: pointer; padding: 4px 0; color: var(--color-text-muted); }
    .seed-credentials:hover { color: var(--color-text); }
    .switch-auth { text-align: center; margin-top: 24px; font-size: 14px; color: var(--color-text-muted); }
    .switch-auth a { color: var(--color-primary); text-decoration: none; font-weight: 600; }
  `]
})
export class LoginComponent {
  fb = inject(FormBuilder);
  authService = inject(AuthService);
  toastService = inject(ToastService);
  router = inject(Router);

  loading = signal(false);

  loginForm = this.fb.group({
    email: ['demo.admin@flowcrm.local', [Validators.required, Validators.email]],
    password: ['Password123!', [Validators.required]],
    remember: [true]
  });

  isInvalid(field: string): boolean {
    const control = this.loginForm.get(field);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  fillDemo(email: string) {
    this.loginForm.patchValue({ email, password: 'Password123!' });
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    const { email, password } = this.loginForm.value;

    this.authService.login({ email: email!, password: password! }).subscribe({
      next: (res) => {
        this.loading.set(false);
        if (res.success) {
          this.toastService.success('Logged in successfully');
          this.router.navigate(['/app/dashboard']);
        }
      },
      error: (err) => {
        this.loading.set(false);
        this.toastService.error(err.error?.message || 'Invalid email or password');
      }
    });
  }
}
