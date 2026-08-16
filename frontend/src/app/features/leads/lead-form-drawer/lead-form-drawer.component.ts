import { Component, EventEmitter, Input, OnInit, Output, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { LeadService } from '../../../core/services/lead.service';
import { ToastService } from '../../../core/services/toast.service';
import { Lead, LeadSource, LeadStatus } from '../../../core/models/lead.model';

@Component({
  selector: 'app-lead-form-drawer',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="drawer-backdrop" (click)="close.emit()">
      <div class="drawer-panel card" (click)="$event.stopPropagation()">
        <div class="drawer-header">
          <h2>{{ lead ? 'Edit Lead' : 'Create New Lead' }}</h2>
          <button class="close-btn" (click)="close.emit()">✕</button>
        </div>

        <div class="drawer-body">
          <form [formGroup]="leadForm" (ngSubmit)="onSubmit()">
            <div class="section-title">Contact & Basic Information</div>
            <div class="grid-2">
              <div class="form-group">
                <label>First Name *</label>
                <input type="text" formControlName="firstName" placeholder="Aarav" />
              </div>
              <div class="form-group">
                <label>Last Name *</label>
                <input type="text" formControlName="lastName" placeholder="Mehta" />
              </div>
            </div>

            <div class="grid-2">
              <div class="form-group">
                <label>Email Address</label>
                <input type="email" formControlName="email" placeholder="aarav@company.com" />
              </div>
              <div class="form-group">
                <label>Phone Number</label>
                <input type="text" formControlName="phone" placeholder="+91 9876543210" />
              </div>
            </div>

            <div class="grid-2">
              <div class="form-group">
                <label>Company Name</label>
                <input type="text" formControlName="companyName" placeholder="Acme Pvt Ltd" />
              </div>
              <div class="form-group">
                <label>Job Title</label>
                <input type="text" formControlName="jobTitle" placeholder="VP Engineering" />
              </div>
            </div>

            <div class="section-title">Sales Classification & Value</div>
            <div class="grid-2">
              <div class="form-group">
                <label>Lead Status</label>
                <select formControlName="statusId">
                  @for (st of statuses(); track st.id) {
                    <option [value]="st.id">{{ st.name }}</option>
                  }
                </select>
              </div>

              <div class="form-group">
                <label>Priority</label>
                <select formControlName="priority">
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                  <option value="URGENT">Urgent</option>
                </select>
              </div>
            </div>

            <div class="grid-2">
              <div class="form-group">
                <label>Expected Value (₹)</label>
                <input type="number" formControlName="expectedValue" placeholder="450000" />
              </div>

              <div class="form-group">
                <label>Industry</label>
                <input type="text" formControlName="industry" placeholder="Software & IT Services" />
              </div>
            </div>

            <div class="form-group">
              <label>Description / Notes</label>
              <textarea formControlName="description" rows="3" placeholder="Enter key requirements or discussion summary..."></textarea>
            </div>

            <div class="drawer-footer">
              <button type="button" class="btn btn-secondary" (click)="close.emit()">Cancel</button>
              <button type="submit" class="btn btn-primary" [disabled]="saving()">
                @if (saving()) { Saving... } @else { {{ lead ? 'Update Lead' : 'Save Lead' }} }
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .drawer-backdrop {
      position: fixed; inset: 0; background-color: rgba(15, 23, 42, 0.5); backdrop-filter: blur(3px);
      z-index: 1000; display: flex; justify-content: flex-end;
    }
    .drawer-panel {
      width: 100%; max-width: 580px; height: 100vh; border-radius: 0; padding: 0;
      display: flex; flex-direction: column; border-left: 1px solid var(--color-border);
      animation: slideInRight 250ms cubic-bezier(0.4, 0, 0.2, 1);
    }
    .drawer-header {
      display: flex; justify-content: space-between; align-items: center; padding: 20px 24px;
      border-bottom: 1px solid var(--color-border);
    }
    .drawer-header h2 { font-size: 20px; font-weight: 800; }
    .close-btn { background: none; border: none; font-size: 18px; color: var(--color-text-muted); cursor: pointer; }

    .drawer-body { flex: 1; overflow-y: auto; padding: 24px; }
    .section-title {
      font-size: 12px; font-weight: 700; color: var(--color-primary); letter-spacing: 0.5px;
      margin: 16px 0 12px 0; text-transform: uppercase;
    }
    .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
    .form-group { margin-bottom: 16px; }
    .form-group label { display: block; font-size: 13px; font-weight: 600; margin-bottom: 6px; }
    input, select, textarea {
      width: 100%; padding: 10px 14px; font-size: 14px; border-radius: var(--radius-md);
      border: 1px solid var(--color-border); background: var(--color-surface); color: var(--color-text); outline: none;
    }

    .drawer-footer { display: flex; justify-content: flex-end; gap: 12px; margin-top: 24px; padding-top: 16px; border-top: 1px solid var(--color-border); }
    @keyframes slideInRight {
      from { transform: translateX(100%); }
      to { transform: translateX(0); }
    }
  `]
})
export class LeadFormDrawerComponent implements OnInit {
  @Input() lead: Lead | null = null;
  @Output() close = new EventEmitter<void>();
  @Output() saved = new EventEmitter<void>();

  leadService = inject(LeadService);
  toastService = inject(ToastService);
  fb = inject(FormBuilder);

  statuses = signal<LeadStatus[]>([]);
  saving = signal(false);

  leadForm = this.fb.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    email: ['', [Validators.email]],
    phone: [''],
    companyName: [''],
    jobTitle: [''],
    statusId: [1],
    priority: ['MEDIUM'],
    expectedValue: [0],
    industry: [''],
    description: ['']
  });

  ngOnInit() {
    this.leadService.getStatuses().subscribe(res => {
      if (res.success) this.statuses.set(res.data);
    });

    if (this.lead) {
      this.leadForm.patchValue({
        firstName: this.lead.firstName,
        lastName: this.lead.lastName,
        email: this.lead.email,
        phone: this.lead.phone,
        companyName: this.lead.companyName,
        jobTitle: this.lead.jobTitle,
        statusId: this.lead.status?.id || 1,
        priority: this.lead.priority,
        expectedValue: this.lead.expectedValue,
        industry: this.lead.industry,
        description: this.lead.description
      });
    }
  }

  onSubmit() {
    if (this.leadForm.invalid) {
      this.leadForm.markAllAsTouched();
      return;
    }

    this.saving.set(true);
    const formVal = this.leadForm.value;

    if (this.lead) {
      this.leadService.updateLead(this.lead.id, formVal).subscribe({
        next: (res) => {
          this.saving.set(false);
          if (res.success) {
            this.toastService.success('Lead updated successfully');
            this.saved.emit();
          }
        },
        error: () => {
          this.saving.set(false);
          this.toastService.error('Failed to update lead');
        }
      });
    } else {
      this.leadService.createLead(formVal).subscribe({
        next: (res) => {
          this.saving.set(false);
          if (res.success) {
            this.toastService.success('Lead created successfully');
            this.saved.emit();
          }
        },
        error: () => {
          this.saving.set(false);
          this.toastService.error('Failed to create lead');
        }
      });
    }
  }
}
