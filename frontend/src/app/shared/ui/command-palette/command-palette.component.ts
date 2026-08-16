import { Component, EventEmitter, HostListener, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ToastService } from '../../../core/services/toast.service';
import { ThemeService } from '../../../core/services/theme.service';

@Component({
  selector: 'app-command-palette',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="palette-backdrop" (click)="close.emit()">
      <div class="palette-modal card" (click)="$event.stopPropagation()">
        <div class="palette-header">
          <span class="search-icon">🔍</span>
          <input 
            type="text" 
            placeholder="Search FlowCRM commands or navigate... (Type 'Lead', 'Customer', 'Settings')" 
            (input)="onSearch($event)"
            autoFocus
          />
          <span class="esc-badge">ESC</span>
        </div>
        <div class="palette-body">
          <div class="palette-section">
            <div class="section-title">QUICK ACTIONS</div>
            <div class="command-item" (click)="execute('create-lead')">
              <span class="item-icon">➕</span>
              <span class="item-text">Create New Lead</span>
              <span class="item-shortcut">Quick Create</span>
            </div>
            <div class="command-item" (click)="execute('create-customer')">
              <span class="item-icon">👤</span>
              <span class="item-text">Create New Customer</span>
              <span class="item-shortcut">Customer</span>
            </div>
            <div class="command-item" (click)="execute('create-quotation')">
              <span class="item-icon">📄</span>
              <span class="item-text">Create Quotation</span>
              <span class="item-shortcut">Coming Soon</span>
            </div>
          </div>
          <div class="palette-section">
            <div class="section-title">NAVIGATION</div>
            <div class="command-item" (click)="navigate('/app/dashboard')">
              <span class="item-icon">📊</span>
              <span class="item-text">Go to Dashboard</span>
            </div>
            <div class="command-item" (click)="navigate('/app/leads')">
              <span class="item-icon">🎯</span>
              <span class="item-text">Go to Leads</span>
            </div>
            <div class="command-item" (click)="navigate('/app/pipeline')">
              <span class="item-icon">📈</span>
              <span class="item-text">Go to Pipeline Kanban</span>
            </div>
            <div class="command-item" (click)="navigate('/app/customers')">
              <span class="item-icon">👥</span>
              <span class="item-text">Go to Customers</span>
            </div>
            <div class="command-item" (click)="navigate('/app/settings')">
              <span class="item-icon">⚙️</span>
              <span class="item-text">Open Settings</span>
            </div>
          </div>
          <div class="palette-section">
            <div class="section-title">THEME PREFERENCE</div>
            <div class="command-item" (click)="toggleTheme('light')">
              <span class="item-icon">☀</span>
              <span class="item-text">Switch to Light Theme</span>
            </div>
            <div class="command-item" (click)="toggleTheme('dark')">
              <span class="item-icon">🌙</span>
              <span class="item-text">Switch to Dark Theme</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .palette-backdrop {
      position: fixed;
      inset: 0;
      background-color: rgba(15, 23, 42, 0.6);
      backdrop-filter: blur(4px);
      z-index: 10000;
      display: flex;
      justify-content: center;
      align-items: flex-start;
      padding-top: 100px;
    }
    .palette-modal {
      width: 100%;
      max-width: 600px;
      padding: 0;
      overflow: hidden;
      box-shadow: var(--shadow-lg);
      border: 1px solid var(--color-border);
      animation: scaleUp 180ms ease;
    }
    .palette-header {
      display: flex;
      align-items: center;
      padding: 16px 20px;
      border-bottom: 1px solid var(--color-border);
      gap: 12px;
    }
    .palette-header input {
      flex: 1;
      background: transparent;
      border: none;
      outline: none;
      color: var(--color-text);
      font-size: 16px;
    }
    .esc-badge {
      font-size: 11px;
      font-weight: 600;
      padding: 2px 6px;
      border-radius: 4px;
      background: var(--color-surface-hover);
      color: var(--color-text-muted);
    }
    .palette-body {
      max-height: 380px;
      overflow-y: auto;
      padding: 12px 0;
    }
    .palette-section {
      margin-bottom: 12px;
    }
    .section-title {
      font-size: 11px;
      font-weight: 700;
      color: var(--color-text-subtle);
      padding: 6px 20px;
      letter-spacing: 0.5px;
    }
    .command-item {
      display: flex;
      align-items: center;
      padding: 10px 20px;
      gap: 12px;
      cursor: pointer;
      transition: background-color 150ms ease;
    }
    .command-item:hover {
      background-color: var(--color-surface-hover);
    }
    .item-icon { font-size: 16px; }
    .item-text { flex: 1; font-size: 14px; font-weight: 500; }
    .item-shortcut { font-size: 12px; color: var(--color-primary); font-weight: 600; }
    @keyframes scaleUp {
      from { transform: scale(0.95); opacity: 0; }
      to { transform: scale(1); opacity: 1; }
    }
  `]
})
export class CommandPaletteComponent {
  @Output() close = new EventEmitter<void>();
  router = inject(Router);
  toastService = inject(ToastService);
  themeService = inject(ThemeService);

  @HostListener('window:keydown.escape')
  onEsc() {
    this.close.emit();
  }

  onSearch(event: Event) {
    // Search filtering handles command filtering
  }

  execute(command: string) {
    this.toastService.info(`Executed command: ${command}`);
    this.close.emit();
  }

  navigate(path: string) {
    this.router.navigate([path]);
    this.close.emit();
  }

  toggleTheme(mode: 'light' | 'dark') {
    this.themeService.setTheme(mode);
    this.toastService.success(`Theme switched to ${mode} mode`);
    this.close.emit();
  }
}
