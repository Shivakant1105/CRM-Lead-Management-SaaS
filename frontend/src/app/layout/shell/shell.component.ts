import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from '../header/header.component';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { CommandPaletteComponent } from '../../shared/ui/command-palette/command-palette.component';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [CommonModule, RouterOutlet, HeaderComponent, SidebarComponent, CommandPaletteComponent],
  template: `
    <div class="app-container">
      <app-sidebar [isCollapsed]="sidebarCollapsed()"></app-sidebar>
      <div class="main-wrapper">
        <app-header 
          (toggleSidebar)="sidebarCollapsed.set(!sidebarCollapsed())"
          (openCommandPalette)="showCommandPalette.set(true)"
        ></app-header>
        <main class="content-area">
          <router-outlet></router-outlet>
        </main>
      </div>
    </div>

    @if (showCommandPalette()) {
      <app-command-palette (close)="showCommandPalette.set(false)"></app-command-palette>
    }
  `,
  styles: [`
    .app-container { display: flex; min-height: 100vh; background-color: var(--color-background); }
    .main-wrapper { flex: 1; display: flex; flex-direction: column; min-width: 0; }
    .content-area { flex: 1; padding: 24px; }
  `]
})
export class ShellComponent {
  sidebarCollapsed = signal(false);
  showCommandPalette = signal(false);
}
