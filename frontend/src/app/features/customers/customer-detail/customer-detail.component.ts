import { Component, EventEmitter, Input, OnInit, Output, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CustomerService } from '../../../core/services/customer.service';
import { ToastService } from '../../../core/services/toast.service';
import { Contact, Customer360 } from '../../../core/models/customer.model';

@Component({
  selector: 'app-customer-detail',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="drawer-backdrop" (click)="close.emit()">
      <div class="customer-360-panel card" (click)="$event.stopPropagation()">
        @if (data()) {
          <!-- Header -->
          <div class="c360-header">
            <div class="header-top">
              <span class="cust-no">{{ data()!.customer.customerNumber }}</span>
              <span class="health-badge" [ngClass]="data()!.healthIndicator.toLowerCase().replace(' ', '-')">
                ⚡ {{ data()!.healthIndicator }}
              </span>
              <button class="close-btn" (click)="close.emit()">✕</button>
            </div>

            <h2 class="title">{{ data()!.customer.displayName }}</h2>
            <div class="company-name">{{ data()!.customer.companyName || 'Individual Client' }}</div>

            <!-- Quick Metrics Row -->
            <div class="metrics-row">
              <div class="m-box">
                <span class="lbl">Account Status</span>
                <strong class="val active">{{ data()!.customer.customerStatus }}</strong>
              </div>
              <div class="m-box">
                <span class="lbl">Industry</span>
                <strong class="val">{{ data()!.customer.industry || 'N/A' }}</strong>
              </div>
              <div class="m-box">
                <span class="lbl">Contacts Count</span>
                <strong class="val">{{ data()!.contacts.length }}</strong>
              </div>
            </div>
          </div>

          <!-- Customer 360 Tabs -->
          <div class="c360-tabs">
            <button [class.active]="activeTab() === 'overview'" (click)="activeTab.set('overview')">Overview</button>
            <button [class.active]="activeTab() === 'contacts'" (click)="activeTab.set('contacts')">Contacts ({{ data()!.contacts.length }})</button>
            <button [class.active]="activeTab() === 'activities'" (click)="activeTab.set('activities')">Activities & Timeline</button>
            <button [class.active]="activeTab() === 'quotations'" (click)="activeTab.set('quotations')">Quotations</button>
            <button [class.active]="activeTab() === 'invoices'" (click)="activeTab.set('invoices')">Invoices</button>
          </div>

          <!-- Tab Contents -->
          <div class="c360-body">
            @if (activeTab() === 'overview') {
              <div class="overview-section">
                <div class="info-group">
                  <label>Company & Billing Details</label>
                  <div class="info-row"><span class="lbl">Email:</span> <strong>{{ data()!.customer.email || 'N/A' }}</strong></div>
                  <div class="info-row"><span class="lbl">Phone:</span> <strong>{{ data()!.customer.phone || 'N/A' }}</strong></div>
                  <div class="info-row"><span class="lbl">Website:</span> <strong>{{ data()!.customer.website || 'N/A' }}</strong></div>
                  <div class="info-row"><span class="lbl">Tax / GST Number:</span> <strong>{{ data()!.customer.taxNumber || 'N/A' }}</strong></div>
                  <div class="info-row"><span class="lbl">Billing City:</span> <strong>{{ data()!.customer.billingCity || 'Mumbai' }}</strong></div>
                </div>
              </div>
            }

            @if (activeTab() === 'contacts') {
              <div class="contacts-section">
                <div class="c-header">
                  <h3>Associated Account Contacts</h3>
                  <button class="btn btn-primary btn-sm" (click)="showAddContact.set(true)">+ Add Contact</button>
                </div>

                <div class="contacts-grid">
                  @for (cnt of data()!.contacts; track cnt.id) {
                    <div class="contact-card card">
                      <div class="cnt-top">
                        <strong>{{ cnt.firstName }} {{ cnt.lastName }}</strong>
                        <span class="badge badge-primary" *ngIf="cnt.primary">Primary Contact</span>
                      </div>
                      <div class="cnt-title">{{ cnt.designation || 'Key Contact' }} ({{ cnt.department || 'Management' }})</div>
                      <div class="cnt-meta">📧 {{ cnt.email }} • 📞 {{ cnt.phone }}</div>
                    </div>
                  } @empty {
                    <div class="empty-text">No contacts associated with this customer account yet.</div>
                  }
                </div>
              </div>
            }

            @if (activeTab() === 'quotations' || activeTab() === 'invoices') {
              <div class="coming-soon-box card">
                <span class="cs-icon">📄</span>
                <h3>Quotation & Invoice Ledger</h3>
                <p>Commercial financial ledger modules will attach naturally to this Customer 360 view in Phase 7 (Quotations) and Phase 11 (Invoices).</p>
              </div>
            }
          </div>
        }
      </div>
    </div>

    <!-- Add Contact Modal -->
    @if (showAddContact()) {
      <div class="modal-backdrop" (click)="showAddContact.set(false)">
        <div class="modal-card card" (click)="$event.stopPropagation()">
          <h3>Add Account Contact</h3>
          <div class="form-group">
            <label>First Name *</label>
            <input type="text" [(ngModel)]="newContactFirst" />
          </div>
          <div class="form-group">
            <label>Last Name *</label>
            <input type="text" [(ngModel)]="newContactLast" />
          </div>
          <div class="form-group">
            <label>Email Address</label>
            <input type="email" [(ngModel)]="newContactEmail" />
          </div>
          <div class="form-group">
            <label>Phone Number</label>
            <input type="text" [(ngModel)]="newContactPhone" />
          </div>
          <div class="form-group checkbox-group">
            <input type="checkbox" id="isPrimary" [(ngModel)]="newContactIsPrimary" />
            <label for="isPrimary">Set as Primary Account Contact</label>
          </div>
          <div class="modal-actions">
            <button class="btn btn-secondary" (click)="showAddContact.set(false)">Cancel</button>
            <button class="btn btn-primary" (click)="saveContact()">Save Contact</button>
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
    .customer-360-panel {
      width: 100%; max-width: 680px; height: 100vh; border-radius: 0; padding: 0;
      display: flex; flex-direction: column; border-left: 1px solid var(--color-border);
      animation: slideInRight 250ms cubic-bezier(0.4, 0, 0.2, 1);
    }
    .c360-header { padding: 24px; border-bottom: 1px solid var(--color-border); background: var(--color-surface); }
    .header-top { display: flex; align-items: center; gap: 10px; margin-bottom: 8px; }
    .cust-no { font-size: 12px; font-weight: 700; color: var(--color-text-subtle); }
    .health-badge { font-size: 11px; font-weight: 700; padding: 3px 8px; border-radius: var(--radius-full); }
    .health-badge.healthy { background: var(--color-success-bg); color: var(--color-success); }
    .health-badge.needs-attention { background: var(--color-warning-bg); color: var(--color-warning); }
    .close-btn { margin-left: auto; background: none; border: none; font-size: 18px; color: var(--color-text-muted); cursor: pointer; }
    .title { font-size: 24px; font-weight: 800; }
    .company-name { font-size: 14px; color: var(--color-text-muted); margin-bottom: 16px; }

    .metrics-row { display: flex; gap: 16px; margin-top: 12px; }
    .m-box { flex: 1; background: var(--color-background); border: 1px solid var(--color-border); padding: 10px 14px; border-radius: var(--radius-md); }
    .m-box .lbl { font-size: 11px; font-weight: 700; color: var(--color-text-subtle); letter-spacing: 0.5px; display: block; }
    .m-box .val { font-size: 15px; font-weight: 700; display: block; margin-top: 2px; }
    .m-box .val.active { color: var(--color-success); }

    .c360-tabs { display: flex; border-bottom: 1px solid var(--color-border); background: var(--color-background); padding: 0 16px; overflow-x: auto; }
    .c360-tabs button {
      background: none; border: none; padding: 12px 16px; font-size: 14px; font-weight: 600;
      color: var(--color-text-muted); cursor: pointer; border-bottom: 2px solid transparent; white-space: nowrap;
    }
    .c360-tabs button.active { border-bottom-color: var(--color-primary); color: var(--color-primary); }

    .c360-body { flex: 1; overflow-y: auto; padding: 24px; }
    .info-group label { font-size: 12px; font-weight: 700; color: var(--color-primary); text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 10px; display: block; }
    .info-row { display: flex; justify-content: space-between; font-size: 14px; margin-bottom: 8px; }
    .info-row .lbl { color: var(--color-text-muted); }

    .c-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
    .contacts-grid { display: flex; flex-direction: column; gap: 12px; }
    .contact-card { padding: 14px; }
    .cnt-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px; }
    .cnt-title { font-size: 12px; color: var(--color-text-muted); margin-bottom: 6px; }
    .cnt-meta { font-size: 13px; color: var(--color-text); }
    .btn-sm { font-size: 12px; padding: 6px 12px; }

    .coming-soon-box { text-align: center; padding: 36px 20px; }
    .cs-icon { font-size: 32px; display: block; margin-bottom: 8px; }

    .modal-backdrop { position: fixed; inset: 0; background: rgba(15, 23, 42, 0.6); backdrop-filter: blur(4px); z-index: 2000; display: flex; align-items: center; justify-content: center; }
    .modal-card { width: 100%; max-width: 420px; padding: 24px; }
    .form-group { margin-bottom: 12px; }
    .form-group label { display: block; font-size: 12px; font-weight: 600; margin-bottom: 4px; }
    input { width: 100%; padding: 8px 12px; border-radius: var(--radius-md); border: 1px solid var(--color-border); background: var(--color-surface); color: var(--color-text); outline: none; }
    .checkbox-group { display: flex; align-items: center; gap: 8px; font-size: 13px; }
    .modal-actions { display: flex; justify-content: flex-end; gap: 10px; margin-top: 16px; }
  `]
})
export class CustomerDetailComponent implements OnInit {
  @Input({ required: true }) customerId!: number;
  @Output() close = new EventEmitter<void>();

  customerService = inject(CustomerService);
  toastService = inject(ToastService);

  data = signal<Customer360 | null>(null);
  activeTab = signal<'overview' | 'contacts' | 'activities' | 'quotations' | 'invoices'>('overview');

  showAddContact = signal(false);
  newContactFirst = '';
  newContactLast = '';
  newContactEmail = '';
  newContactPhone = '';
  newContactIsPrimary = false;

  ngOnInit() {
    this.load360();
  }

  load360() {
    this.customerService.getCustomer360(this.customerId).subscribe({
      next: (res) => {
        if (res.success) this.data.set(res.data);
      }
    });
  }

  saveContact() {
    if (!this.newContactFirst || !this.newContactLast) {
      this.toastService.error('First and last name are required');
      return;
    }

    this.customerService.addContact(this.customerId, {
      firstName: this.newContactFirst,
      lastName: this.newContactLast,
      email: this.newContactEmail,
      phone: this.newContactPhone,
      primary: this.newContactIsPrimary
    }).subscribe({
      next: (res) => {
        if (res.success) {
          this.toastService.success('Contact added successfully');
          this.showAddContact.set(false);
          this.load360();
        }
      }
    });
  }
}
