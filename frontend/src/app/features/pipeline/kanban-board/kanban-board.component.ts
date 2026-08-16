import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LeadService } from '../../../core/services/lead.service';
import { ToastService } from '../../../core/services/toast.service';
import { Opportunity, Pipeline, PipelineStage } from '../../../core/models/lead.model';

@Component({
  selector: 'app-kanban-board',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="kanban-page">
      <div class="kanban-header">
        <div>
          <h1>Sales Pipeline Kanban Board</h1>
          <p class="subtitle">Drag and drop opportunities between stages to update deal status.</p>
        </div>
        <div class="header-stats">
          <div class="stat-box">
            <span class="lbl">Total Pipeline</span>
            <strong class="val">₹{{ calculateTotalValue() | number }}</strong>
          </div>
          <div class="stat-box">
            <span class="lbl">Active Deals</span>
            <strong class="val">{{ opportunities().length }}</strong>
          </div>
        </div>
      </div>

      <!-- Kanban Column Grid -->
      <div class="kanban-grid">
        @for (stage of stages(); track stage.id) {
          <div 
            class="kanban-column"
            (dragover)="onDragOver($event)"
            (drop)="onDrop($event, stage.id)"
          >
            <div class="column-header" [style.border-top-color]="stage.colorToken">
              <div class="c-title">
                <span class="c-name">{{ stage.name }}</span>
                <span class="c-prob">{{ stage.probability }}%</span>
              </div>
              <div class="c-metrics">
                <span>{{ getStageOpps(stage.id).length }} deals</span>
                <strong>₹{{ getStageValue(stage.id) | number }}</strong>
              </div>
            </div>

            <div class="column-body">
              @for (opp of getStageOpps(stage.id); track opp.id) {
                <div 
                  class="kanban-card card" 
                  draggable="true"
                  (dragstart)="onDragStart($event, opp)"
                >
                  <div class="card-top">
                    <span class="opp-no">{{ opp.opportunityNumber }}</span>
                    <span class="priority-dot" [ngClass]="opp.lead?.priority?.toLowerCase() || 'medium'"></span>
                  </div>

                  <h4 class="opp-title">{{ opp.name }}</h4>
                  <div class="opp-company">{{ opp.lead?.companyName || 'Corporate Client' }}</div>

                  <div class="card-bottom">
                    <strong class="opp-amount">₹{{ opp.amount | number }}</strong>
                    <div class="owner-avatar" *ngIf="opp.lead?.assignedTo">
                      {{ getInitials(opp.lead?.assignedTo?.firstName, opp.lead?.assignedTo?.lastName) }}
                    </div>
                  </div>
                </div>
              } @empty {
                <div class="empty-column">No deals in this stage</div>
              }
            </div>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .kanban-page { display: flex; flex-direction: column; gap: 20px; height: calc(100vh - 110px); }
    .kanban-header { display: flex; justify-content: space-between; align-items: center; }
    .kanban-header h1 { font-size: 24px; font-weight: 800; }
    .subtitle { color: var(--color-text-muted); font-size: 14px; }
    .header-stats { display: flex; gap: 16px; }
    .stat-box {
      background: var(--color-surface); border: 1px solid var(--color-border);
      padding: 10px 18px; border-radius: var(--radius-md); text-align: right;
    }
    .lbl { font-size: 11px; font-weight: 700; color: var(--color-text-subtle); letter-spacing: 0.5px; display: block; }
    .val { font-size: 18px; font-weight: 800; color: var(--color-primary); }

    .kanban-grid {
      display: flex; gap: 16px; flex: 1; overflow-x: auto; padding-bottom: 12px;
    }
    .kanban-column {
      width: 290px; min-width: 290px; background: var(--color-surface);
      border: 1px solid var(--color-border); border-radius: var(--radius-lg);
      display: flex; flex-direction: column; height: 100%;
    }
    .column-header {
      padding: 14px 16px; border-bottom: 1px solid var(--color-border); border-top: 4px solid var(--color-primary);
      border-radius: var(--radius-lg) var(--radius-lg) 0 0; background: var(--color-background);
    }
    .c-title { display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px; }
    .c-name { font-weight: 700; font-size: 14px; }
    .c-prob { font-size: 11px; font-weight: 700; color: var(--color-primary); background: var(--color-primary-light); padding: 2px 6px; border-radius: 4px; }
    .c-metrics { display: flex; justify-content: space-between; font-size: 12px; color: var(--color-text-muted); }

    .column-body { flex: 1; overflow-y: auto; padding: 12px; display: flex; flex-direction: column; gap: 12px; }
    .kanban-card {
      padding: 14px; cursor: grab; transition: transform 150ms ease, box-shadow 150ms ease;
      border: 1px solid var(--color-border);
    }
    .kanban-card:active { cursor: grabbing; transform: scale(1.02); }
    .card-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px; }
    .opp-no { font-size: 11px; font-weight: 700; color: var(--color-text-subtle); }
    .priority-dot { width: 8px; height: 8px; border-radius: 50%; }
    .priority-dot.urgent, .priority-dot.high { background: var(--color-danger); }
    .priority-dot.medium { background: var(--color-warning); }
    .priority-dot.low { background: var(--color-success); }

    .opp-title { font-size: 14px; font-weight: 700; margin-bottom: 2px; }
    .opp-company { font-size: 12px; color: var(--color-text-muted); margin-bottom: 12px; }

    .card-bottom { display: flex; justify-content: space-between; align-items: center; }
    .opp-amount { font-size: 15px; font-weight: 800; color: var(--color-primary); }
    .owner-avatar {
      width: 26px; height: 26px; border-radius: 50%; background: var(--color-primary-light);
      color: var(--color-primary); font-size: 11px; font-weight: 700; display: flex; align-items: center; justify-content: center;
    }
    .empty-column { font-size: 12px; color: var(--color-text-subtle); text-align: center; padding: 24px 0; }
  `]
})
export class KanbanBoardComponent implements OnInit {
  leadService = inject(LeadService);
  toastService = inject(ToastService);

  stages = signal<PipelineStage[]>([]);
  opportunities = signal<Opportunity[]>([]);
  draggedOpp: Opportunity | null = null;

  ngOnInit() {
    this.loadPipeline();
  }

  loadPipeline() {
    this.leadService.getPipelines().subscribe(res => {
      if (res.success && res.data.length > 0) {
        this.stages.set(res.data[0].stages);
      }
    });

    this.leadService.getOpportunities(1).subscribe(res => {
      if (res.success) {
        this.opportunities.set(res.data);
      }
    });
  }

  getStageOpps(stageId: number): Opportunity[] {
    return this.opportunities().filter(o => o.stage?.id === stageId);
  }

  getStageValue(stageId: number): number {
    return this.getStageOpps(stageId).reduce((sum, o) => sum + (o.amount || 0), 0);
  }

  calculateTotalValue(): number {
    return this.opportunities().reduce((sum, o) => sum + (o.amount || 0), 0);
  }

  onDragStart(e: DragEvent, opp: Opportunity) {
    this.draggedOpp = opp;
  }

  onDragOver(e: DragEvent) {
    e.preventDefault();
  }

  onDrop(e: DragEvent, targetStageId: number) {
    e.preventDefault();
    if (!this.draggedOpp || this.draggedOpp.stage?.id === targetStageId) return;

    const oppId = this.draggedOpp.id;
    const targetStage = this.stages().find(s => s.id === targetStageId);
    if (!targetStage) return;

    // Optimistic Update
    const previousOppState = { ...this.draggedOpp };
    this.opportunities.update(list => list.map(o => o.id === oppId ? { ...o, stage: targetStage } : o));

    this.leadService.updateOpportunityStage(oppId, targetStageId).subscribe({
      next: (res) => {
        if (res.success) {
          this.toastService.success(`Moved ${previousOppState.name} to ${targetStage.name}`);
        }
      },
      error: () => {
        // Rollback on Failure
        this.opportunities.update(list => list.map(o => o.id === oppId ? previousOppState : o));
        this.toastService.error('Failed to update stage. Reverting movement.');
      }
    });

    this.draggedOpp = null;
  }

  getInitials(fn?: string, ln?: string): string {
    return ((fn?.charAt(0) || '') + (ln?.charAt(0) || '')).toUpperCase();
  }
}
