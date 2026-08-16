import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CustomerService } from '../../../core/services/customer.service';
import { ToastService } from '../../../core/services/toast.service';
import { Customer } from '../../../core/models/customer.model';
import { CustomerDetailComponent } from '../customer-detail/customer-detail.component';

@Component({
  selector: 'app-customer-list',
  standalone: true,
  imports: [CommonModule, FormsModule, CustomerDetailComponent],
  template: `
    <div class="customers-workspace">
      <!-- Header -->
      <div class="workspace-header">
        <div>
          <h1>Customer Management & 360 Accounts</h1>
          <p class="subtitle">Manage customer relationships, contacts, and account engagement.</p>
        </div>
        <div class="actions">
          <button class="btn btn-primary" (click)="showCreateModal.set(true)">+ New Customer</button>
        </div>
      </div>

      <!-- Filters -->
      <div class="card filter-card">
        <div class="filter-row">
          <div class="search-input-wrap">
            <span class="s-icon">🔍</span>
            <input 
              type="text" 
              placeholder="Search by customer name, company, email, phone, or Customer ID..." 
              [(ngModel)]="searchQuery"
              (keyup.enter)="loadCustomers()"
            />
          </div>

          <div class="filter-selects">
            <select [(ngModel)]="selectedType" (change)="loadCustomers()">
              <option value="">All Account Types</option>
              <option value="COMPANY">🏢 Company</option>
              <option value="INDIVIDUAL">👤 Individual</option>
            </select>

            <select [(ngModel)]="selectedStatus" (change)="loadCustomers()">
              <option value="">All Statuses</option>
              <option value="ACTIVE">🟢 Active</option>
              <option value="PROSPECT">🟡 Prospect</option>
              <option value="INACTIVE">⚪ Inactive</option>
              <option value="BLOCKED">🔴 Blocked</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Customer Data Table -->
      <div class="card table-card">
        <table class="data-table">
          <thead>
            <tr>
              <th>Customer & Company</th>
              <th>Type</th>
              <th>Status</th>
              <th>Industry</th>
              <th>Contact Details</th>
              <th>City / Country</th>
              <th>Created Date</th>
              <th width="100">Actions</th>
            </tr>
          </thead>
          <tbody>
            @for (cust of customers(); track cust.id) {
              <tr class="table-row" (click)="openCustomer360(cust.id)">
                <td>
                  <div class="cust-cell">
                    <div class="avatar-sm">{{ getInitials(cust.displayName) }}</div>
                    <div class="cell-info">
                      <strong class="cust-name">{{ cust.displayName }} <span class="cust-no">({{ cust.customerNumber }})</span></strong>
                      <span class="cust-meta" *ngIf="cust.companyName && cust.customerType === 'COMPANY'">{{ cust.companyName }}</span>
                    </div>
                  </div>
                </td>
                <td>
                  <span class="badge" [ngClass]="cust.customerType === 'COMPANY' ? 'badge-primary' : 'badge-accent'">
                    {{ cust.customerType }}
                  </span>
                </td>
                <td>
                  <span class="badge" [ngClass]="{
                    'badge-success': cust.customerStatus === 'ACTIVE',
                    'badge-warning': cust.customerStatus === 'PROSPECT',
                    'badge-danger': cust.customerStatus === 'BLOCKED'
                  }">
                    {{ cust.customerStatus }}
                  </span>
                </td>
                <td>{{ cust.industry || 'N/A' }}</td>
                <td>
                  <div class="contact-info">
                    <span>{{ cust.email || '-' }}</span>
                    <span class="sub-phone">{{ cust.phone || '-' }}</span>
                  </div>
                </td>
                <td>{{ cust.billingCity || 'Mumbai' }}, {{ cust.billingCountry || 'India' }}</td>
                <td>{{ cust.createdAt | date:'mediumDate' }}</td>
                <td (click)="$event.stopPropagation()">
                  <button class="btn btn-secondary icon-only" (click)="openCustomer360(cust.id)">👁 View 360</button>
                </td>
              </tr>
            } @empty {
              <tr>
                <td colspan="8">
                  <div class="empty-workspace">
                    <span class="e-icon">👥</span>
                    <h3>No customer records found</h3>
                    <p>Onboard new customers or convert qualified leads.</p>
                    <button class="btn btn-primary" (click)="showCreateModal.set(true)">+ Create Customer</button>
                  </div>
                </td>
              </tr>
            }
          </tbody>
        </table>
      </div>

      <!-- Customer 360 View Drawer -->
      @if (selectedCustomerId()) {
        <app-customer-detail 
          [customerId]="selectedCustomerId()!" 
          (close)="selectedCustomerId.set(null)"
        ></app-customer-detail>
      }
    </div>
  `,
  styles: [`
    .customers-workspace { display: flex; flex-direction: column; gap: 20px; }
    .workspace-header { display: flex; justify-content: space-between; align-items: center; }
    .workspace-header h1 { font-size: 24px; font-weight: 800; }
    .subtitle { color: var(--color-text-muted); font-size: 14px; }
    .filter-card { padding: 16px; }
    .filter-row { display: flex; justify-content: space-between; gap: 16px; align-items: center; }
    .search-input-wrap {
      flex: 1; display: flex; align-items: center; gap: 8px; background: var(--color-background);
      border: 1px solid var(--color-border); border-radius: var(--radius-md); padding: 8px 14px;
    }
    .search-input-wrap input { border: none; background: transparent; outline: none; width: 100%; color: var(--color-text); }
    .filter-selects { display: flex; gap: 10px; }
    select {
      padding: 8px 12px; border-radius: var(--radius-md); border: 1px solid var(--color-border);
      background: var(--color-surface); color: var(--color-text); outline: none; font-size: 14px;
    }

    .table-card { padding: 0; overflow: hidden; }
    .data-table { width: 100%; border-collapse: collapse; text-align: left; }
    .data-table th, .data-table td { padding: 14px 18px; border-bottom: 1px solid var(--color-border); font-size: 14px; }
    .data-table th { font-weight: 700; color: var(--color-text-subtle); background: var(--color-background); font-size: 12px; letter-spacing: 0.5px; }
    .table-row { cursor: pointer; transition: background-color 150ms ease; }
    .table-row:hover { background-color: var(--color-surface-hover); }

    .cust-cell { display: flex; align-items: center; gap: 12px; }
    .avatar-sm {
      width: 36px; height: 36px; border-radius: var(--radius-full); background: var(--color-primary-light);
      color: var(--color-primary); font-weight: 700; display: flex; align-items: center; justify-content: center; font-size: 13px;
    }
    .cell-info { display: flex; flex-direction: column; }
    .cust-name { font-size: 14px; color: var(--color-text); }
    .cust-no { font-size: 12px; color: var(--color-text-muted); font-weight: normal; }
    .cust-meta { font-size: 12px; color: var(--color-text-muted); }
    .contact-info { display: flex; flex-direction: column; }
    .sub-phone { font-size: 12px; color: var(--color-text-muted); }
    .badge-accent { background: var(--color-accent-light); color: var(--color-accent); }
    .icon-only { font-size: 13px; padding: 4px 10px; }

    .empty-workspace { display: flex; flex-direction: column; align-items: center; padding: 48px; text-align: center; }
    .e-icon { font-size: 40px; margin-bottom: 12px; }
  `]
})
export class CustomerListComponent implements OnInit {
  customerService = inject(CustomerService);
  toastService = inject(ToastService);

  customers = signal<Customer[]>([]);
  searchQuery = '';
  selectedType = '';
  selectedStatus = '';

  selectedCustomerId = signal<number | null>(null);
  showCreateModal = signal(false);

  ngOnInit() {
    this.loadCustomers();
  }

  loadCustomers() {
    this.customerService.getCustomers(this.searchQuery, this.selectedType, this.selectedStatus).subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.customers.set(res.data.content);
        }
      },
      error: () => this.toastService.error('Failed to load customers')
    });
  }

  getInitials(name: string): string {
    if (!name) return 'CU';
    const parts = name.split(' ');
    if (parts.length >= 2) return (parts[0].charAt(0) + parts[1].charAt(0)).toUpperCase();
    return name.substring(0, 2).toUpperCase();
  }

  openCustomer360(id: number) {
    this.selectedCustomerId.set(id);
  }
}
