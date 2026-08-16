import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="dashboard-container">
      <!-- Hero Header Banner -->
      <div class="hero-banner card">
        <div class="banner-left">
          <h1>Good morning, {{ authService.currentUser()?.firstName || 'Shiva' }} 👋</h1>
          <p>Your sales pipeline is performing strong. Conversion rate is up <span class="trend-up">+12.8%</span> this month.</p>
          
          <div class="quick-actions">
            <a routerLink="/app/leads" class="btn btn-primary">+ New Lead</a>
            <a routerLink="/app/activities" class="btn btn-secondary">Schedule Follow-up</a>
            <a routerLink="/app/pipeline" class="btn btn-secondary">Pipeline Kanban</a>
          </div>
        </div>

        <div class="banner-right">
          <div class="revenue-box">
            <span class="rev-label">MONTHLY REVENUE</span>
            <span class="rev-value">₹8,42,500</span>
            <span class="rev-sub">+18.4% vs target</span>
          </div>
        </div>
      </div>

      <!-- Advanced KPI Cards -->
      <div class="kpi-grid">
        <div class="kpi-card card">
          <div class="kpi-top">
            <span class="kpi-icon">💰</span>
            <span class="kpi-trend up">↑ 18.4%</span>
          </div>
          <span class="kpi-num">₹24.8L</span>
          <span class="kpi-lbl">Total Pipeline Value</span>
          <div class="sparkline-bar"><div class="fill" style="width: 78%"></div></div>
        </div>

        <div class="kpi-card card">
          <div class="kpi-top">
            <span class="kpi-icon">🎯</span>
            <span class="kpi-trend up">↑ 12.5%</span>
          </div>
          <span class="kpi-num">142</span>
          <span class="kpi-lbl">Total Leads Tracked</span>
          <div class="sparkline-bar"><div class="fill" style="width: 65%"></div></div>
        </div>

        <div class="kpi-card card">
          <div class="kpi-top">
            <span class="kpi-icon">⚡</span>
            <span class="kpi-trend up">↑ 4.2%</span>
          </div>
          <span class="kpi-num">28.4%</span>
          <span class="kpi-lbl">Lead-to-Won Conversion</span>
          <div class="sparkline-bar"><div class="fill" style="width: 54%"></div></div>
        </div>

        <div class="kpi-card card">
          <div class="kpi-top">
            <span class="kpi-icon">📈</span>
            <span class="kpi-trend up">↑ 8.1%</span>
          </div>
          <span class="kpi-num">38</span>
          <span class="kpi-lbl">Active Deals / Opps</span>
          <div class="sparkline-bar"><div class="fill" style="width: 82%"></div></div>
        </div>
      </div>

      <!-- Main Layout 2 Columns -->
      <div class="dashboard-body-grid">
        <!-- Left: Pipeline & Follow-up Intelligence -->
        <div class="left-column">
          <!-- Sales Pipeline Stage Breakdown -->
          <div class="card section-card">
            <div class="section-header">
              <h3>Sales Pipeline Velocity</h3>
              <a routerLink="/app/pipeline" class="link-btn">View Kanban →</a>
            </div>

            <div class="pipeline-stages">
              <div class="stage-item">
                <div class="stage-info"><span>New Leads</span><strong>42 deals (₹8.5L)</strong></div>
                <div class="progress-bar"><div class="bar-fill" style="width: 45%; background: #4F46E5;"></div></div>
              </div>
              <div class="stage-item">
                <div class="stage-info"><span>Contacted</span><strong>28 deals (₹5.2L)</strong></div>
                <div class="progress-bar"><div class="bar-fill" style="width: 35%; background: #06B6D4;"></div></div>
              </div>
              <div class="stage-item">
                <div class="stage-info"><span>Proposal / Demo</span><strong>18 deals (₹6.8L)</strong></div>
                <div class="progress-bar"><div class="bar-fill" style="width: 60%; background: #7C3AED;"></div></div>
              </div>
              <div class="stage-item">
                <div class="stage-info"><span>Negotiation</span><strong>12 deals (₹4.3L)</strong></div>
                <div class="progress-bar"><div class="bar-fill" style="width: 75%; background: #F59E0B;"></div></div>
              </div>
            </div>
          </div>

          <!-- Today's Focus Panel -->
          <div class="card section-card focus-card">
            <div class="section-header">
              <h3>Today's Focus (Follow-up Intelligence)</h3>
              <div class="focus-pills">
                <span class="pill danger">🔴 3 Overdue</span>
                <span class="pill warning">🟡 5 Today</span>
                <span class="pill success">🟢 8 Upcoming</span>
              </div>
            </div>

            <div class="focus-list">
              <div class="focus-item">
                <div class="f-type call">📞 CALL</div>
                <div class="f-detail">
                  <strong>Rahul Sharma (ABC Tech)</strong>
                  <span>Discuss enterprise pricing proposal</span>
                </div>
                <span class="f-time danger-text">Overdue 2h</span>
              </div>

              <div class="focus-item">
                <div class="f-type meeting">🤝 MEETING</div>
                <div class="f-detail">
                  <strong>Priya Verma (Nova Edu)</strong>
                  <span>Software demo & requirements walkthrough</span>
                </div>
                <span class="f-time">Today 3:30 PM</span>
              </div>

              <div class="focus-item">
                <div class="f-type email">✉️ EMAIL</div>
                <div class="f-detail">
                  <strong>Amit Patel (CloudBridge)</strong>
                  <span>Send updated quotation PDF</span>
                </div>
                <span class="f-time">Today 5:00 PM</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Column: Recent Activity Feed -->
        <div class="right-column">
          <div class="card section-card">
            <div class="section-header">
              <h3>Recent Activity Timeline</h3>
            </div>

            <div class="timeline">
              <div class="timeline-item">
                <div class="t-icon success">💳</div>
                <div class="t-content">
                  <strong>Payment Received</strong>
                  <p>ABC Technologies paid ₹45,000 against INV-000042</p>
                  <span class="t-time">12 minutes ago</span>
                </div>
              </div>

              <div class="timeline-item">
                <div class="t-icon primary">📄</div>
                <div class="t-content">
                  <strong>Quotation Accepted</strong>
                  <p>XYZ Solutions accepted QUO-000018 for ₹1,20,000</p>
                  <span class="t-time">35 minutes ago</span>
                </div>
              </div>

              <div class="timeline-item">
                <div class="t-icon accent">🎯</div>
                <div class="t-content">
                  <strong>New Lead Assigned</strong>
                  <p>Rahul -> Enterprise Cloud Lead assigned to Priya</p>
                  <span class="t-time">1 hour ago</span>
                </div>
              </div>

              <div class="timeline-item">
                <div class="t-icon warning">📅</div>
                <div class="t-content">
                  <strong>Follow-up Scheduled</strong>
                  <p>Call scheduled with BrightEdge Solutions</p>
                  <span class="t-time">2 hours ago</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-container { display: flex; flex-direction: column; gap: 24px; }
    .hero-banner {
      display: flex; justify-content: space-between; align-items: center; padding: 32px;
      background: linear-gradient(135deg, var(--color-surface) 0%, var(--color-primary-light) 100%);
      border-color: var(--color-border);
    }
    .banner-left h1 { font-size: 26px; font-weight: 800; margin-bottom: 6px; }
    .banner-left p { color: var(--color-text-muted); font-size: 15px; margin-bottom: 20px; }
    .trend-up { color: var(--color-success); font-weight: 700; }
    .quick-actions { display: flex; gap: 12px; }
    .revenue-box {
      background: var(--color-surface); padding: 20px 28px; border-radius: var(--radius-lg);
      border: 1px solid var(--color-border); box-shadow: var(--shadow-md); text-align: right;
    }
    .rev-label { font-size: 11px; font-weight: 700; color: var(--color-text-subtle); letter-spacing: 0.5px; }
    .rev-value { display: block; font-size: 32px; font-weight: 800; color: var(--color-primary); margin: 4px 0; }
    .rev-sub { font-size: 12px; color: var(--color-success); font-weight: 600; }

    .kpi-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; }
    .kpi-card { padding: 20px; }
    .kpi-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
    .kpi-icon { font-size: 24px; }
    .kpi-trend { font-size: 13px; font-weight: 700; color: var(--color-success); }
    .kpi-num { display: block; font-size: 28px; font-weight: 800; margin-bottom: 2px; }
    .kpi-lbl { font-size: 13px; color: var(--color-text-muted); margin-bottom: 12px; display: block; }
    .sparkline-bar { height: 6px; background: var(--color-background); border-radius: 3px; overflow: hidden; }
    .sparkline-bar .fill { height: 100%; background: var(--color-primary); border-radius: 3px; }

    .dashboard-body-grid { display: grid; grid-template-columns: 2fr 1fr; gap: 24px; }
    .left-column, .right-column { display: flex; flex-direction: column; gap: 24px; }
    .section-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
    .section-header h3 { font-size: 17px; font-weight: 700; }
    .link-btn { font-size: 13px; font-weight: 600; color: var(--color-primary); text-decoration: none; }

    .pipeline-stages { display: flex; flex-direction: column; gap: 16px; }
    .stage-info { display: flex; justify-content: space-between; font-size: 14px; margin-bottom: 6px; }
    .progress-bar { height: 10px; background: var(--color-background); border-radius: 5px; overflow: hidden; }
    .bar-fill { height: 100%; border-radius: 5px; }

    .focus-pills { display: flex; gap: 8px; }
    .pill { font-size: 12px; font-weight: 600; padding: 4px 10px; border-radius: var(--radius-full); }
    .pill.danger { background: var(--color-danger-bg); color: var(--color-danger); }
    .pill.warning { background: var(--color-warning-bg); color: var(--color-warning); }
    .pill.success { background: var(--color-success-bg); color: var(--color-success); }

    .focus-list { display: flex; flex-direction: column; gap: 12px; }
    .focus-item {
      display: flex; align-items: center; gap: 14px; padding: 12px;
      border-radius: var(--radius-md); background: var(--color-background); border: 1px solid var(--color-border);
    }
    .f-type { font-size: 11px; font-weight: 700; padding: 4px 8px; border-radius: 4px; background: var(--color-surface); }
    .f-detail { flex: 1; display: flex; flex-direction: column; font-size: 13px; }
    .f-detail strong { font-size: 14px; }
    .f-detail span { color: var(--color-text-muted); }
    .f-time { font-size: 12px; font-weight: 600; color: var(--color-text-muted); }
    .danger-text { color: var(--color-danger); font-weight: 700; }

    .timeline { display: flex; flex-direction: column; gap: 20px; }
    .timeline-item { display: flex; gap: 14px; }
    .t-icon {
      width: 36px; height: 36px; border-radius: var(--radius-full);
      display: flex; align-items: center; justify-content: center; font-size: 16px;
    }
    .t-icon.success { background: var(--color-success-bg); }
    .t-icon.primary { background: var(--color-primary-light); }
    .t-icon.accent { background: var(--color-accent-light); }
    .t-icon.warning { background: var(--color-warning-bg); }
    .t-content { flex: 1; font-size: 13px; }
    .t-content strong { font-size: 14px; display: block; margin-bottom: 2px; }
    .t-content p { color: var(--color-text-muted); margin-bottom: 4px; }
    .t-time { font-size: 11px; color: var(--color-text-subtle); }
  `]
})
export class DashboardComponent {
  authService = inject(AuthService);
}
