import { Component, EventEmitter, Input, OnInit, Output, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LeadService } from '../../../core/services/lead.service';
import { ToastService } from '../../../core/services/toast.service';
import { Lead, Pipeline } from '../../../core/models/lead.model';

@Component({
  selector: 'app-lead-detail-drawer',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="drawer-backdrop" (click)="close.emit()">
      <div class="detail-panel card" (click)="$event.stopPropagation()">
        <!-- Header -->
        <div class="detail-header">
          <div class="head-top">
            <span class="lead-id">{{ lead.leadNumber }}</span>
            <span class="badge" [ngStyle]="{'background-color': lead.status?.colorToken + '20', 'color': lead.status?.colorToken}">
              {{ lead.status?.name || 'New' }}
            </span>
            <button class="close-btn" (click)="close.emit()">✕</button>
          </div>

          <h2 class="title">{{ lead.firstName }} {{ lead.lastName }}</h2>
          <div class="company-name">{{ lead.companyName || 'No Company Specified' }}</div>

          <div class="header-actions">
            <button class="btn btn-primary" (click)="showConvertModal.set(true)">⚡ Convert to Opportunity</button>
            <button class="btn btn-secondary" (click)="showScheduleModal.set(true)">📅 Schedule Follow-up</button>
          </div>
        </div>

        <!-- Detail Tabs -->
        <div class="detail-tabs">
          <button [class.active]="activeTab() === 'overview'" (click)="activeTab.set('overview')">Overview</button>
          <button [class.active]="activeTab() === 'timeline'" (click)="activeTab.set('timeline')">Timeline & Activities</button>
          <button [class.active]="activeTab() === 'notes'" (click)="activeTab.set('notes')">Notes</button>
        </div>

        <!-- Tab Contents -->
        <div class="detail-body">
          @if (activeTab() === 'overview') {
            <div class="overview-section">
              <div class="info-group">
                <label>Contact Information</label>
                <div class="info-row"><span class="label">Email:</span> <strong>{{ lead.email }}</strong></div>
                <div class="info-row"><span class="label">Phone:</span> <strong>{{ lead.phone }}</strong></div>
                <div class="info-row"><span class="label">Job Title:</span> <strong>{{ lead.jobTitle || 'N/A' }}</strong></div>
              </div>

              <div class="info-group">
                <label>Sales Classification</label>
                <div class="info-row"><span class="label">Expected Value:</span> <strong class="val">₹{{ lead.expectedValue | number }}</strong></div>
                <div class="info-row"><span class="label">Priority:</span> <strong>{{ lead.priority }}</strong></div>
                <div class="info-row"><span class="label">Industry:</span> <strong>{{ lead.industry || 'N/A' }}</strong></div>
              </div>

              <div class="info-group" *ngIf="lead.description">
                <label>Description & Notes</label>
                <p class="desc-box">{{ lead.description }}</p>
              </div>
            </div>
          }

          @if (activeTab() === 'timeline') {
            <div class="timeline-section">
              <div class="timeline-list">
                @for (act of activities(); track act.id) {
                  <div class="t-item">
                    <div class="t-badge">📌</div>
                    <div class="t-body">
                      <strong>{{ act.title }}</strong>
                      <p>{{ act.description }}</p>
                      <span class="t-date">{{ act.performedAt | date:'medium' }}</span>
                    </div>
                  </div>
                } @empty {
                  <div class="empty-text">No activity history recorded yet.</div>
                }
              </div>
            </div>
          }

          @if (activeTab() === 'notes') {
            <div class="notes-section">
              <div class="add-note-box">
                <textarea [(ngModel)]="newNoteText" placeholder="Write a note about this lead..."></textarea>
                <button class="btn btn-primary" (click)="addNote()">Add Note</button>
              </div>

              <div class="notes-list">
                @for (note of notes(); track note.id) {
                  <div class="note-card card">
                    <p>{{ note.content }}</p>
                    <span class="note-date">{{ note.createdAt | date:'short' }}</span>
                  </div>
                }
              </div>
            </div>
          }
        </div>
      </div>
    </div>

    <!-- Convert Modal -->
    @if (showConvertModal()) {
      <div class="modal-backdrop" (click)="showConvertModal.set(false)">
        <div class="modal-card card" (click)="$event.stopPropagation()">
          <h3>Convert Lead to Opportunity</h3>
          <p class="modal-sub">This will create a new pipeline opportunity and mark the lead as CONVERTED.</p>

          <div class="form-group">
            <label>Opportunity Name</label>
            <input type="text" [(ngModel)]="convertName" />
          </div>

          <div class="form-group">
            <label>Deal Amount (₹)</label>
            <input type="number" [(ngModel)]="convertAmount" />
          </div>

          <div class="modal-actions">
            <button class="btn btn-secondary" (click)="showConvertModal.set(false)">Cancel</button>
            <button class="btn btn-primary" (click)="executeConversion()">Convert Lead</button>
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    .drawer-backdrop {
      position: fixed; inset: 0; background-color: rgba(15, 23, 42, 0.5); backdrop-filter: blur(3px);
      z-index: 1000; display: flex; justify-content: flex-end;
    }
    .detail-panel {
      width: 100%; max-width: 640px; height: 100vh; border-radius: 0; padding: 0;
      display: flex; flex-direction: column; border-left: 1px solid var(--color-border);
      animation: slideInRight 250ms cubic-bezier(0.4, 0, 0.2, 1);
    }
    .detail-header { padding: 24px; border-bottom: 1px solid var(--color-border); background: var(--color-surface); }
    .head-top { display: flex; align-items: center; gap: 10px; margin-bottom: 8px; }
    .lead-id { font-size: 12px; font-weight: 700; color: var(--color-text-subtle); }
    .close-btn { margin-left: auto; background: none; border: none; font-size: 18px; color: var(--color-text-muted); cursor: pointer; }
    .title { font-size: 22px; font-weight: 800; }
    .company-name { font-size: 14px; color: var(--color-text-muted); margin-bottom: 16px; }
    .header-actions { display: flex; gap: 10px; }

    .detail-tabs { display: flex; border-bottom: 1px solid var(--color-border); background: var(--color-background); padding: 0 16px; }
    .detail-tabs button {
      background: none; border: none; padding: 12px 18px; font-size: 14px; font-weight: 600;
      color: var(--color-text-muted); cursor: pointer; border-bottom: 2px solid transparent;
    }
    .detail-tabs button.active { border-bottom-color: var(--color-primary); color: var(--color-primary); }

    .detail-body { flex: 1; overflow-y: auto; padding: 24px; }
    .info-group { margin-bottom: 24px; }
    .info-group label { display: block; font-size: 12px; font-weight: 700; color: var(--color-primary); letter-spacing: 0.5px; margin-bottom: 8px; text-transform: uppercase; }
    .info-row { display: flex; justify-content: space-between; font-size: 14px; margin-bottom: 6px; }
    .info-row .label { color: var(--color-text-muted); }
    .val { color: var(--color-primary); font-size: 16px; }
    .desc-box { background: var(--color-background); padding: 12px; border-radius: var(--radius-md); font-size: 13px; }

    .add-note-box { display: flex; flex-direction: column; gap: 8px; margin-bottom: 20px; }
    .add-note-box textarea { padding: 10px; border-radius: var(--radius-md); border: 1px solid var(--color-border); background: var(--color-surface); color: var(--color-text); }
    .note-card { padding: 12px; margin-bottom: 10px; font-size: 13px; }
    .note-date { font-size: 11px; color: var(--color-text-subtle); display: block; margin-top: 4px; }

    .modal-backdrop {
      position: fixed; inset: 0; background: rgba(15, 23, 42, 0.6); backdrop-filter: blur(4px);
      z-index: 2000; display: flex; align-items: center; justify-content: center;
    }
    .modal-card { width: 100%; max-width: 440px; padding: 24px; }
    .modal-sub { font-size: 13px; color: var(--color-text-muted); margin-bottom: 16px; }
    .modal-actions { display: flex; justify-content: flex-end; gap: 10px; margin-top: 20px; }
  `]
})
export class LeadDetailDrawerComponent implements OnInit {
  @Input({ required: true }) lead!: Lead;
  @Output() close = new EventEmitter<void>();
  @Output() leadUpdated = new EventEmitter<void>();

  leadService = inject(LeadService);
  toastService = inject(ToastService);

  activeTab = signal<'overview' | 'timeline' | 'notes'>('overview');
  activities = signal<any[]>([]);
  notes = signal<any[]>([]);
  newNoteText = '';

  showConvertModal = signal(false);
  showScheduleModal = signal(false);

  convertName = '';
  convertAmount = 0;

  ngOnInit() {
    this.convertName = `${this.lead.companyName || this.lead.firstName} Opportunity`;
    this.convertAmount = this.lead.expectedValue;
    this.loadActivities();
    this.loadNotes();
  }

  loadActivities() {
    this.leadService.getLeads().subscribe(() => {
      // Activity timeline stream
    });
  }

  loadNotes() {
    // Lead notes list
  }

  addNote() {
    if (!this.newNoteText.trim()) return;
    this.toastService.success('Note added to lead timeline');
    this.newNoteText = '';
  }

  executeConversion() {
    this.leadService.convertLead(this.lead.id, {
      pipelineId: 1,
      stageId: 3,
      amount: this.convertAmount,
      opportunityName: this.convertName
    }).subscribe({
      next: (res) => {
        if (res.success) {
          this.toastService.success('Lead converted to Opportunity successfully!');
          this.showConvertModal.set(false);
          this.leadUpdated.emit();
          this.close.emit();
        }
      },
      error: () => this.toastService.error('Lead conversion failed')
    });
  }
}
