import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LeadService } from '../../../core/services/lead.service';
import { ToastService } from '../../../core/services/toast.service';
import { Lead, LeadSource, LeadStatus } from '../../../core/models/lead.model';
import { LeadFormDrawerComponent } from '../lead-form-drawer/lead-form-drawer.component';
import { LeadDetailDrawerComponent } from '../lead-detail-drawer/lead-detail-drawer.component';

@Component({
  selector: 'app-lead-list',
  standalone: true,
  imports: [CommonModule, FormsModule, LeadFormDrawerComponent, LeadDetailDrawerComponent],
  template: `
    <div class="leads-workspace">
      <!-- Header -->
      <div class="workspace-header">
        <div>
          <h1>Leads & Prospect Intelligence</h1>
          <p class="subtitle">Manage, qualify, and convert your sales opportunities.</p>
        </div>
        <div class="actions">
          <button class="btn btn-primary" (click)="openCreateDrawer()">+ New Lead</button>
        </div>
      </div>

      <!-- Filter Bar -->
      <div class="card filter-card">
        <div class="filter-row">
          <div class="search-input-wrap">
            <span class="s-icon">🔍</span>
            <input 
              type="text" 
              placeholder="Search by name, company, email, phone, or Lead ID..." 
              [(ngModel)]="searchQuery"
              (keyup.enter)="loadLeads()"
            />
          </div>

          <div class="filter-selects">
            <select [(ngModel)]="selectedStatusId" (change)="loadLeads()">
              <option [ngValue]="null">All Statuses</option>
              @for (st of statuses(); track st.id) {
                <option [value]="st.id">{{ st.name }}</option>
              }
            </select>

            <select [(ngModel)]="selectedPriority" (change)="loadLeads()">
              <option value="">All Priorities</option>
              <option value="URGENT">🔴 Urgent</option>
              <option value="HIGH">🟠 High</option>
              <option value="MEDIUM">🟡 Medium</option>
              <option value="LOW">🟢 Low</option>
            </select>

            <button class="btn btn-secondary" (click)="resetFilters()">Clear Filters</button>
          </div>
        </div>

        <!-- Filter Chips -->
        <div class="active-chips" *ngIf="searchQuery || selectedStatusId || selectedPriority">
          <span class="chip-label">Active Filters:</span>
          <span class="chip" *ngIf="searchQuery">Search: {{ searchQuery }} <button (click)="searchQuery = ''; loadLeads()">✕</button></span>
          <span class="chip" *ngIf="selectedPriority">Priority: {{ selectedPriority }} <button (click)="selectedPriority = ''; loadLeads()">✕</button></span>
        </div>
      </div>

      <!-- Data Table Workspace -->
      <div class="card table-card">
        <table class="data-table">
          <thead>
            <tr>
              <th width="40"><input type="checkbox" (change)="toggleSelectAll($event)" /></th>
              <th>Lead & Company</th>
              <th>Status</th>
              <th>Priority</th>
              <th>Source</th>
              <th>Assigned To</th>
              <th>Expected Value</th>
              <th>Next Follow-up</th>
              <th width="100">Actions</th>
            </tr>
          </thead>
          <tbody>
            @for (lead of leads(); track lead.id) {
              <tr class="table-row" (click)="openDetailDrawer(lead)">
                <td (click)="$event.stopPropagation()">
                  <input type="checkbox" [checked]="isSelected(lead.id)" (change)="toggleSelect(lead.id)" />
                </td>
                <td>
                  <div class="lead-cell">
                    <div class="avatar-sm">{{ getInitials(lead.firstName, lead.lastName) }}</div>
                    <div class="cell-info">
                      <strong class="lead-name">{{ lead.firstName }} {{ lead.lastName }} <span class="lead-no">({{ lead.leadNumber }})</span></strong>
                      <span class="lead-meta">{{ lead.companyName }} • {{ lead.email }}</span>
                    </div>
                  </div>
                </td>
                <td>
                  <span class="badge" [ngStyle]="{'background-color': lead.status?.colorToken + '20', 'color': lead.status?.colorToken}">
                    {{ lead.status?.name || 'New' }}
                  </span>
                </td>
                <td>
                  <span class="priority-tag" [ngClass]="lead.priority.toLowerCase()">
                    @if (lead.priority === 'URGENT') { 🔴 Urgent }
                    @else if (lead.priority === 'HIGH') { 🟠 High }
                    @else if (lead.priority === 'MEDIUM') { 🟡 Medium }
                    @else { 🟢 Low }
                  </span>
                </td>
                <td>
                  <span class="source-lbl">{{ lead.source?.name || 'Website' }}</span>
                </td>
                <td>
                  <div class="owner-cell" *ngIf="lead.assignedTo">
                    <span class="owner-name">{{ lead.assignedTo.firstName }} {{ lead.assignedTo.lastName }}</span>
                  </div>
                  <span class="unassigned" *ngIf="!lead.assignedTo">Unassigned</span>
                </td>
                <td>
                  <strong class="val-text">₹{{ lead.expectedValue | number }}</strong>
                </td>
                <td>
                  <span class="followup-badge" *ngIf="lead.nextFollowupAt">📅 {{ lead.nextFollowupAt | date:'mediumDate' }}</span>
                  <span class="text-muted" *ngIf="!lead.nextFollowupAt">-</span>
                </td>
                <td (click)="$event.stopPropagation()">
                  <button class="btn btn-secondary icon-only-btn" (click)="openEditDrawer(lead)">✏️</button>
                </td>
              </tr>
            } @empty {
              <tr>
                <td colspan="9">
                  <div class="empty-workspace">
                    <span class="e-icon">🎯</span>
                    <h3>No leads found</h3>
                    <p>Start tracking prospects by creating your first lead.</p>
                    <button class="btn btn-primary" (click)="openCreateDrawer()">+ Create Lead</button>
                  </div>
                </td>
              </tr>
            }
          </tbody>
        </table>

        <!-- Server-side Pagination Bar -->
        <div class="pagination-bar">
          <span class="page-info">Showing page {{ currentPage() + 1 }} of {{ totalPages() }} ({{ totalElements() }} total leads)</span>
          <div class="page-controls">
            <button class="btn btn-secondary" [disabled]="currentPage() === 0" (click)="changePage(currentPage() - 1)">Previous</button>
            <button class="btn btn-secondary" [disabled]="currentPage() >= totalPages() - 1" (click)="changePage(currentPage() + 1)">Next</button>
          </div>
        </div>
      </div>

      <!-- Drawers -->
      @if (showFormDrawer()) {
        <app-lead-form-drawer 
          [lead]="editingLead()" 
          (close)="showFormDrawer.set(false)" 
          (saved)="onLeadSaved()"
        ></app-lead-form-drawer>
      }

      @if (showDetailDrawer() && activeDetailLead()) {
        <app-lead-detail-drawer 
          [lead]="activeDetailLead()!" 
          (close)="showDetailDrawer.set(false)"
          (leadUpdated)="loadLeads()"
        ></app-lead-detail-drawer>
      }
    </div>
  `,
  styles: [`
    .leads-workspace { display: flex; flex-direction: column; gap: 20px; }
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
    .active-chips { display: flex; align-items: center; gap: 8px; margin-top: 12px; font-size: 13px; }
    .chip-label { font-weight: 600; color: var(--color-text-subtle); }
    .chip {
      background: var(--color-primary-light); color: var(--color-primary); padding: 2px 8px;
      border-radius: var(--radius-full); font-weight: 600; font-size: 12px;
    }
    .chip button { background: none; border: none; color: inherit; cursor: pointer; margin-left: 4px; }

    .table-card { padding: 0; overflow: hidden; }
    .data-table { width: 100%; border-collapse: collapse; text-align: left; }
    .data-table th, .data-table td { padding: 14px 18px; border-bottom: 1px solid var(--color-border); font-size: 14px; }
    .data-table th { font-weight: 700; color: var(--color-text-subtle); background: var(--color-background); font-size: 12px; letter-spacing: 0.5px; }
    .table-row { cursor: pointer; transition: background-color 150ms ease; }
    .table-row:hover { background-color: var(--color-surface-hover); }

    .lead-cell { display: flex; align-items: center; gap: 12px; }
    .avatar-sm {
      width: 36px; height: 36px; border-radius: var(--radius-full); background: var(--color-primary-light);
      color: var(--color-primary); font-weight: 700; display: flex; align-items: center; justify-content: center; font-size: 13px;
    }
    .cell-info { display: flex; flex-direction: column; }
    .lead-name { font-size: 14px; color: var(--color-text); }
    .lead-no { font-size: 12px; color: var(--color-text-muted); font-weight: normal; }
    .lead-meta { font-size: 12px; color: var(--color-text-muted); }
    .priority-tag { font-weight: 600; font-size: 13px; }
    .val-text { font-size: 14px; color: var(--color-primary); }
    .followup-badge { font-size: 12px; font-weight: 600; color: var(--color-accent); }
    .unassigned { font-size: 12px; color: var(--color-text-subtle); font-style: italic; }
    .icon-only-btn { padding: 4px 8px; }

    .pagination-bar {
      display: flex; justify-content: space-between; align-items: center; padding: 14px 20px;
      background: var(--color-background); border-top: 1px solid var(--color-border); font-size: 13px; color: var(--color-text-muted);
    }
    .page-controls { display: flex; gap: 8px; }

    .empty-workspace { display: flex; flex-direction: column; align-items: center; padding: 48px; text-align: center; }
    .e-icon { font-size: 40px; margin-bottom: 12px; }
  `]
})
export class LeadListComponent implements OnInit {
  leadService = inject(LeadService);
  toastService = inject(ToastService);

  leads = signal<Lead[]>([]);
  statuses = signal<LeadStatus[]>([]);

  searchQuery = '';
  selectedStatusId: number | null = null;
  selectedPriority = '';

  currentPage = signal(0);
  totalPages = signal(1);
  totalElements = signal(0);

  selectedIds = signal<number[]>([]);
  showFormDrawer = signal(false);
  editingLead = signal<Lead | null>(null);

  showDetailDrawer = signal(false);
  activeDetailLead = signal<Lead | null>(null);

  ngOnInit() {
    this.loadMetadata();
    this.loadLeads();
  }

  loadMetadata() {
    this.leadService.getStatuses().subscribe(res => {
      if (res.success) this.statuses.set(res.data);
    });
  }

  loadLeads() {
    this.leadService.getLeads(
      this.searchQuery,
      this.selectedStatusId || undefined,
      undefined,
      this.selectedPriority,
      this.currentPage(),
      15
    ).subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.leads.set(res.data.content);
          this.currentPage.set(res.data.number);
          this.totalPages.set(res.data.totalPages);
          this.totalElements.set(res.data.totalElements);
        }
      },
      error: () => this.toastService.error('Failed to load leads')
    });
  }

  changePage(newPage: number) {
    this.currentPage.set(newPage);
    this.loadLeads();
  }

  resetFilters() {
    this.searchQuery = '';
    this.selectedStatusId = null;
    this.selectedPriority = '';
    this.currentPage.set(0);
    this.loadLeads();
  }

  getInitials(fn: string, ln: string): string {
    return ((fn?.charAt(0) || '') + (ln?.charAt(0) || '')).toUpperCase();
  }

  toggleSelectAll(e: Event) {
    const checked = (e.target as HTMLInputElement).checked;
    if (checked) {
      this.selectedIds.set(this.leads().map(l => l.id));
    } else {
      this.selectedIds.set([]);
    }
  }

  toggleSelect(id: number) {
    const current = this.selectedIds();
    if (current.includes(id)) {
      this.selectedIds.set(current.filter(i => i !== id));
    } else {
      this.selectedIds.set([...current, id]);
    }
  }

  isSelected(id: number): boolean {
    return this.selectedIds().includes(id);
  }

  openCreateDrawer() {
    this.editingLead.set(null);
    this.showFormDrawer.set(true);
  }

  openEditDrawer(lead: Lead) {
    this.editingLead.set(lead);
    this.showFormDrawer.set(true);
  }

  openDetailDrawer(lead: Lead) {
    this.activeDetailLead.set(lead);
    this.showDetailDrawer.set(true);
  }

  onLeadSaved() {
    this.showFormDrawer.set(false);
    this.loadLeads();
  }
}
