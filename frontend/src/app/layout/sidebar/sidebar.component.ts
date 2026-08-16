import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <aside class="app-sidebar" [class.collapsed]="isCollapsed">
      <!-- Logo Brand -->
      <div class="brand-container">
        <div class="logo-mark">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4 4H16V8H8V12H14V16H8V20H4V4Z" fill="currentColor"/>
          </svg>
        </div>
        @if (!isCollapsed) {
          <span class="wordmark">Flow<span>CRM</span></span>
        }
      </div>

      <!-- Navigation Links -->
      <nav class="nav-menu">
        <div class="nav-group-title" *ngIf="!isCollapsed">MAIN CRM</div>
        
        <a routerLink="/app/dashboard" routerLinkActive="active" class="nav-item">
          <span class="nav-icon">📊</span>
          <span class="nav-label" *ngIf="!isCollapsed">Dashboard</span>
        </a>

        <a routerLink="/app/leads" routerLinkActive="active" class="nav-item">
          <span class="nav-icon">🎯</span>
          <span class="nav-label" *ngIf="!isCollapsed">Leads</span>
          <span class="coming-soon-badge" *ngIf="!isCollapsed">Phase 2</span>
        </a>

        <a routerLink="/app/pipeline" routerLinkActive="active" class="nav-item">
          <span class="nav-icon">📈</span>
          <span class="nav-label" *ngIf="!isCollapsed">Sales Pipeline</span>
          <span class="coming-soon-badge" *ngIf="!isCollapsed">Phase 2</span>
        </a>

        <a routerLink="/app/customers" routerLinkActive="active" class="nav-item">
          <span class="nav-icon">👥</span>
          <span class="nav-label" *ngIf="!isCollapsed">Customers</span>
          <span class="coming-soon-badge" *ngIf="!isCollapsed">Phase 3</span>
        </a>

        <a routerLink="/app/activities" routerLinkActive="active" class="nav-item">
          <span class="nav-icon">📅</span>
          <span class="nav-label" *ngIf="!isCollapsed">Activities</span>
        </a>

        <div class="nav-group-title" *ngIf="!isCollapsed">FINANCIAL & REPORTS</div>

        <a routerLink="/app/quotations" routerLinkActive="active" class="nav-item">
          <span class="nav-icon">📄</span>
          <span class="nav-label" *ngIf="!isCollapsed">Quotations</span>
          <span class="coming-soon-badge" *ngIf="!isCollapsed">Phase 7</span>
        </a>

        <a routerLink="/app/invoices" routerLinkActive="active" class="nav-item">
          <span class="nav-icon">💳</span>
          <span class="nav-label" *ngIf="!isCollapsed">Invoices</span>
          <span class="coming-soon-badge" *ngIf="!isCollapsed">Phase 11</span>
        </a>

        <a routerLink="/app/payments" routerLinkActive="active" class="nav-item">
          <span class="nav-icon">💰</span>
          <span class="nav-label" *ngIf="!isCollapsed">Payments</span>
          <span class="coming-soon-badge" *ngIf="!isCollapsed">Phase 13</span>
        </a>

        <a routerLink="/app/reports" routerLinkActive="active" class="nav-item">
          <span class="nav-icon">📉</span>
          <span class="nav-label" *ngIf="!isCollapsed">Reports</span>
          <span class="coming-soon-badge" *ngIf="!isCollapsed">Phase 20</span>
        </a>

        <div class="nav-group-title" *ngIf="!isCollapsed">SYSTEM</div>

        <a routerLink="/app/settings" routerLinkActive="active" class="nav-item">
          <span class="nav-icon">⚙️</span>
          <span class="nav-label" *ngIf="!isCollapsed">Settings</span>
        </a>
      </nav>
    </aside>
  `,
  styles: [`
    .app-sidebar {
      width: 250px;
      height: 100vh;
      background-color: var(--color-sidebar);
      border-right: 1px solid var(--color-border);
      display: flex;
      flex-direction: column;
      position: sticky;
      top: 0;
      transition: width 250ms cubic-bezier(0.4, 0, 0.2, 1);
      z-index: 90;
    }
    .app-sidebar.collapsed { width: 76px; }
    .brand-container {
      height: 64px;
      display: flex;
      align-items: center;
      padding: 0 20px;
      gap: 12px;
      border-bottom: 1px solid var(--color-border);
    }
    .logo-mark {
      width: 36px;
      height: 36px;
      border-radius: var(--radius-md);
      background: linear-gradient(135deg, var(--color-primary), var(--color-accent));
      color: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 800;
    }
    .wordmark { font-size: 20px; font-weight: 800; color: var(--color-text); }
    .wordmark span { color: var(--color-primary); }
    .nav-menu { flex: 1; padding: 16px 12px; overflow-y: auto; }
    .nav-group-title {
      font-size: 11px; font-weight: 700; color: var(--color-text-subtle);
      margin: 16px 12px 8px 12px; letter-spacing: 0.6px;
    }
    .nav-item {
      display: flex; align-items: center; gap: 12px; padding: 10px 14px;
      color: var(--color-text-muted); text-decoration: none; font-size: 14px; font-weight: 500;
      border-radius: var(--radius-md); transition: all 150ms ease; margin-bottom: 4px;
    }
    .nav-item:hover { background-color: var(--color-surface-hover); color: var(--color-text); }
    .nav-item.active { background-color: var(--color-primary-light); color: var(--color-primary); font-weight: 600; }
    .nav-icon { font-size: 18px; }
    .coming-soon-badge {
      margin-left: auto; font-size: 10px; font-weight: 700; padding: 2px 6px;
      border-radius: 4px; background: var(--color-background); color: var(--color-text-subtle);
      border: 1px solid var(--color-border);
    }
  `]
})
export class SidebarComponent {
  @Input() isCollapsed = false;
}
