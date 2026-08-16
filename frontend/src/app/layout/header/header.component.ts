import { Component, EventEmitter, Output, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { ThemeService } from '../../core/services/theme.service';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  template: `
    <header class="app-header">
      <div class="header-left">
        <!-- Sidebar Toggle -->
        <button class="icon-btn" (click)="toggleSidebar.emit()" title="Toggle Sidebar">
          ☰
        </button>

        <!-- Workspace Switcher -->
        <div class="workspace-switcher" (click)="showWorkspaceMenu.set(!showWorkspaceMenu())">
          <span class="workspace-logo">🏢</span>
          <span class="workspace-name">{{ authService.currentUser()?.companyName || 'FlowCRM Demo' }}</span>
          <span class="chevron">▼</span>

          @if (showWorkspaceMenu()) {
            <div class="dropdown-menu card" (click)="$event.stopPropagation()">
              <div class="dropdown-header">Workspaces</div>
              <div class="dropdown-item active">
                <span>✓ {{ authService.currentUser()?.companyName || 'FlowCRM Demo' }}</span>
                <span class="badge badge-primary">Active</span>
              </div>
              <div class="dropdown-divider"></div>
              <div class="dropdown-item" (click)="toastService.info('Create workspace feature coming soon')">
                <span>➕ Create New Workspace</span>
              </div>
            </div>
          }
        </div>
      </div>

      <div class="header-center">
        <!-- Search & Command Palette Trigger -->
        <div class="search-bar" (click)="openCommandPalette.emit()">
          <span class="search-icon">🔍</span>
          <span class="search-placeholder">Search FlowCRM or type command...</span>
          <span class="kbd-badge">Ctrl K</span>
        </div>
      </div>

      <div class="header-right">
        <!-- Quick Create Button -->
        <button class="btn btn-primary quick-create-btn" (click)="showQuickCreate.set(!showQuickCreate())">
          <span>+ Create</span>
          @if (showQuickCreate()) {
            <div class="quick-create-menu card" (click)="$event.stopPropagation()">
              <div class="create-item" (click)="action('Lead')">🎯 Create Lead</div>
              <div class="create-item" (click)="action('Customer')">👤 Create Customer</div>
              <div class="create-item" (click)="action('Quotation')">📄 Create Quotation</div>
              <div class="create-item" (click)="action('Follow-up')">📅 Schedule Follow-up</div>
            </div>
          }
        </button>

        <!-- Theme Toggle Button -->
        <button class="icon-btn" (click)="cycleTheme()" title="Toggle Light / Dark / System Theme">
          @if (themeService.effectiveTheme() === 'dark') { 🌙 } @else { ☀ }
        </button>

        <!-- User Profile Dropdown -->
        <div class="user-profile" (click)="showUserMenu.set(!showUserMenu())">
          <div class="avatar">{{ userInitials() }}</div>
          <span class="user-name">{{ authService.currentUser()?.firstName || 'Shiva' }}</span>
          
          @if (showUserMenu()) {
            <div class="user-dropdown card" (click)="$event.stopPropagation()">
              <div class="user-info">
                <div class="full-name">{{ authService.currentUser()?.firstName }} {{ authService.currentUser()?.lastName }}</div>
                <div class="user-email">{{ authService.currentUser()?.email }}</div>
                <div class="user-role badge badge-primary">{{ userRole() }}</div>
              </div>
              <div class="dropdown-divider"></div>
              <div class="dropdown-item" (click)="navigate('/app/profile')">👤 My Profile</div>
              <div class="dropdown-item" (click)="navigate('/app/settings')">⚙️ Settings</div>
              <div class="dropdown-divider"></div>
              <div class="dropdown-item danger" (click)="authService.logout()">🚪 Logout</div>
            </div>
          }
        </div>
      </div>
    </header>
  `,
  styles: [`
    .app-header {
      height: 64px;
      background-color: var(--color-header);
      border-bottom: 1px solid var(--color-border);
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 24px;
      position: sticky;
      top: 0;
      z-index: 100;
      transition: var(--theme-transition);
    }
    .header-left, .header-right { display: flex; align-items: center; gap: 16px; }
    .header-center { flex: 1; max-width: 480px; margin: 0 24px; }
    .icon-btn {
      background: none; border: none; font-size: 18px; cursor: pointer; color: var(--color-text);
      padding: 8px; border-radius: var(--radius-md); transition: background 150ms;
    }
    .icon-btn:hover { background-color: var(--color-surface-hover); }
    .workspace-switcher {
      display: flex; align-items: center; gap: 8px; font-weight: 600; cursor: pointer;
      padding: 6px 12px; border-radius: var(--radius-md); position: relative;
    }
    .workspace-switcher:hover { background-color: var(--color-surface-hover); }
    .search-bar {
      display: flex; align-items: center; gap: 10px; background-color: var(--color-background);
      border: 1px solid var(--color-border); border-radius: var(--radius-md);
      padding: 8px 14px; cursor: pointer; color: var(--color-text-muted); font-size: 14px;
    }
    .kbd-badge {
      font-size: 11px; font-weight: 600; background: var(--color-surface);
      border: 1px solid var(--color-border); padding: 2px 6px; border-radius: 4px; margin-left: auto;
    }
    .quick-create-btn { position: relative; }
    .quick-create-menu, .dropdown-menu, .user-dropdown {
      position: absolute; top: calc(100% + 8px); right: 0; min-width: 220px;
      padding: 8px; z-index: 500; border: 1px solid var(--color-border); box-shadow: var(--shadow-lg);
    }
    .create-item, .dropdown-item {
      padding: 10px 14px; font-size: 14px; font-weight: 500; border-radius: var(--radius-sm);
      cursor: pointer; display: flex; align-items: center; justify-content: space-between;
    }
    .create-item:hover, .dropdown-item:hover { background-color: var(--color-surface-hover); }
    .dropdown-divider { height: 1px; background-color: var(--color-border); margin: 6px 0; }
    .user-profile { display: flex; align-items: center; gap: 10px; cursor: pointer; position: relative; }
    .avatar {
      width: 36px; height: 36px; border-radius: var(--radius-full); background: var(--color-primary);
      color: #fff; font-weight: 700; display: flex; align-items: center; justify-content: center; font-size: 14px;
    }
    .user-name { font-size: 14px; font-weight: 600; }
    .user-info { padding: 8px 12px; }
    .full-name { font-weight: 700; font-size: 15px; }
    .user-email { font-size: 12px; color: var(--color-text-muted); margin-bottom: 6px; }
    .danger { color: var(--color-danger); }
  `]
})
export class HeaderComponent {
  @Output() toggleSidebar = new EventEmitter<void>();
  @Output() openCommandPalette = new EventEmitter<void>();

  authService = inject(AuthService);
  themeService = inject(ThemeService);
  toastService = inject(ToastService);
  router = inject(Router);

  showWorkspaceMenu = signal(false);
  showQuickCreate = signal(false);
  showUserMenu = signal(false);

  userInitials(): string {
    const user = this.authService.currentUser();
    if (!user) return 'FL';
    return (user.firstName.charAt(0) + user.lastName.charAt(0)).toUpperCase();
  }

  userRole(): string {
    const roles = this.authService.currentUser()?.roles;
    return roles && roles.length > 0 ? roles[0] : 'ADMIN';
  }

  cycleTheme() {
    const current = this.themeService.activeTheme();
    if (current === 'light') this.themeService.setTheme('dark');
    else if (current === 'dark') this.themeService.setTheme('system');
    else this.themeService.setTheme('light');
  }

  action(type: string) {
    this.toastService.info(`Create ${type} action triggered`);
    this.showQuickCreate.set(false);
  }

  navigate(path: string) {
    this.router.navigate([path]);
    this.showUserMenu.set(false);
  }
}
