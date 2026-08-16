import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-coming-soon',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="coming-soon-container card">
      <div class="icon-wrap">{{ icon }}</div>
      <h2>{{ title }} Module</h2>
      <p class="desc">
        The {{ title }} workflow module is scheduled for implementation in <strong>{{ phase }}</strong> according to the FlowCRM Commercial Master Roadmap.
      </p>

      <div class="roadmap-preview card">
        <div class="rp-item">
          <span class="rp-step">✓ Phase 1</span>
          <span class="rp-name">SaaS Foundation + UI Shell</span>
        </div>
        <div class="rp-item current">
          <span class="rp-step">⏳ {{ phase }}</span>
          <span class="rp-name">{{ title }} Workflow Engine</span>
        </div>
        <div class="rp-item">
          <span class="rp-step">📋 Standard</span>
          <span class="rp-name">Full Database Integration & REST APIs</span>
        </div>
      </div>

      <div class="actions">
        <a routerLink="/app/dashboard" class="btn btn-primary">Return to Dashboard</a>
      </div>
    </div>
  `,
  styles: [`
    .coming-soon-container {
      display: flex; flex-direction: column; align-items: center; justify-content: center;
      text-align: center; padding: 60px 32px; max-width: 680px; margin: 40px auto;
    }
    .icon-wrap {
      width: 72px; height: 72px; border-radius: var(--radius-full); background: var(--color-primary-light);
      color: var(--color-primary); font-size: 32px; display: flex; align-items: center; justify-content: center;
      margin-bottom: 20px;
    }
    .coming-soon-container h2 { font-size: 24px; font-weight: 800; margin-bottom: 8px; }
    .desc { font-size: 15px; color: var(--color-text-muted); margin-bottom: 28px; max-width: 480px; }
    .roadmap-preview {
      width: 100%; display: flex; justify-content: space-between; background: var(--color-background);
      padding: 16px; margin-bottom: 28px; border: 1px solid var(--color-border);
    }
    .rp-item { display: flex; flex-direction: column; align-items: flex-start; text-align: left; font-size: 13px; }
    .rp-step { font-weight: 700; color: var(--color-primary); font-size: 12px; }
    .rp-item.current .rp-step { color: var(--color-warning); }
    .rp-name { color: var(--color-text); font-weight: 600; margin-top: 2px; }
    .actions { display: flex; gap: 12px; }
  `]
})
export class ComingSoonComponent {
  @Input() title = 'Module';
  @Input() icon = '🚀';
  @Input() phase = 'Upcoming Phase';
}
