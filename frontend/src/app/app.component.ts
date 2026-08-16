import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ToastService } from './core/services/toast.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule],
  template: `
    <router-outlet></router-outlet>
    
    <!-- Global Toast Container -->
    <div class="toast-container">
      @for (toast of toastService.toasts(); track toast.id) {
        <div class="toast-item" [ngClass]="'toast-' + toast.type">
          <span class="toast-icon">
            @if (toast.type === 'success') { ✓ }
            @else if (toast.type === 'error') { ✕ }
            @else if (toast.type === 'warning') { ⚠ }
            @else { ℹ }
          </span>
          <span class="toast-message">{{ toast.message }}</span>
          <button class="toast-close" (click)="toastService.remove(toast.id)">✕</button>
        </div>
      }
    </div>
  `,
  styles: [`
    .toast-container {
      position: fixed;
      bottom: 24px;
      right: 24px;
      z-index: 9999;
      display: flex;
      flex-direction: column;
      gap: 10px;
      max-width: 380px;
    }
    .toast-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px 18px;
      border-radius: var(--radius-md);
      background-color: var(--color-surface);
      color: var(--color-text);
      border: 1px solid var(--color-border);
      box-shadow: var(--shadow-lg);
      font-size: 14px;
      font-weight: 500;
      animation: slideIn 250ms ease;
    }
    .toast-success { border-left: 4px solid var(--color-success); }
    .toast-error { border-left: 4px solid var(--color-danger); }
    .toast-warning { border-left: 4px solid var(--color-warning); }
    .toast-info { border-left: 4px solid var(--color-primary); }
    .toast-icon { font-weight: bold; }
    .toast-close { background: none; border: none; color: var(--color-text-muted); cursor: pointer; }
    @keyframes slideIn {
      from { transform: translateX(100%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
  `]
})
export class AppComponent {
  toastService = inject(ToastService);
}
