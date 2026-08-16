import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponseEnvelope } from '../models/auth.model';
import { Lead, LeadSource, LeadStatus, FollowUp, Pipeline, Opportunity } from '../models/lead.model';

export interface PageResponse<T> {
  content: T[];
  number: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

@Injectable({
  providedIn: 'root'
})
export class LeadService {
  private readonly API_BASE = '/api/v1';

  constructor(private http: HttpClient) {}

  getLeads(
    search?: string,
    statusId?: number,
    sourceId?: number,
    priority?: string,
    page = 0,
    size = 20
  ): Observable<ApiResponseEnvelope<PageResponse<Lead>>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    if (search) params = params.set('search', search);
    if (statusId) params = params.set('statusId', statusId.toString());
    if (sourceId) params = params.set('sourceId', sourceId.toString());
    if (priority) params = params.set('priority', priority);

    return this.http.get<ApiResponseEnvelope<PageResponse<Lead>>>(`${this.API_BASE}/leads`, { params });
  }

  getLeadById(id: number): Observable<ApiResponseEnvelope<Lead>> {
    return this.http.get<ApiResponseEnvelope<Lead>>(`${this.API_BASE}/leads/${id}`);
  }

  createLead(data: any): Observable<ApiResponseEnvelope<Lead>> {
    return this.http.post<ApiResponseEnvelope<Lead>>(`${this.API_BASE}/leads`, data);
  }

  updateLead(id: number, data: any): Observable<ApiResponseEnvelope<Lead>> {
    return this.http.put<ApiResponseEnvelope<Lead>>(`${this.API_BASE}/leads/${id}`, data);
  }

  deleteLead(id: number): Observable<ApiResponseEnvelope<void>> {
    return this.http.delete<ApiResponseEnvelope<void>>(`${this.API_BASE}/leads/${id}`);
  }

  bulkAssign(leadIds: number[], assignedUserId: number): Observable<ApiResponseEnvelope<void>> {
    return this.http.post<ApiResponseEnvelope<void>>(`${this.API_BASE}/leads/bulk/assign`, { leadIds, assignedUserId });
  }

  convertLead(leadId: number, data: { pipelineId: number; stageId: number; amount: number; opportunityName: string }): Observable<ApiResponseEnvelope<Opportunity>> {
    return this.http.post<ApiResponseEnvelope<Opportunity>>(`${this.API_BASE}/leads/${leadId}/convert`, data);
  }

  getSources(): Observable<ApiResponseEnvelope<LeadSource[]>> {
    return this.http.get<ApiResponseEnvelope<LeadSource[]>>(`${this.API_BASE}/leads/sources`);
  }

  getStatuses(): Observable<ApiResponseEnvelope<LeadStatus[]>> {
    return this.http.get<ApiResponseEnvelope<LeadStatus[]>>(`${this.API_BASE}/leads/statuses`);
  }

  getFollowUps(filter?: string): Observable<ApiResponseEnvelope<FollowUp[]>> {
    let params = new HttpParams();
    if (filter) params = params.set('filter', filter);
    return this.http.get<ApiResponseEnvelope<FollowUp[]>>(`${this.API_BASE}/follow-ups`, { params });
  }

  createFollowUp(data: any): Observable<ApiResponseEnvelope<FollowUp>> {
    return this.http.post<ApiResponseEnvelope<FollowUp>>(`${this.API_BASE}/follow-ups`, data);
  }

  completeFollowUp(id: number, notes?: string): Observable<ApiResponseEnvelope<FollowUp>> {
    return this.http.post<ApiResponseEnvelope<FollowUp>>(`${this.API_BASE}/follow-ups/${id}/complete`, { notes });
  }

  rescheduleFollowUp(id: number, newScheduledAt: string): Observable<ApiResponseEnvelope<FollowUp>> {
    return this.http.put<ApiResponseEnvelope<FollowUp>>(`${this.API_BASE}/follow-ups/${id}/reschedule`, { newScheduledAt });
  }

  getPipelines(): Observable<ApiResponseEnvelope<Pipeline[]>> {
    return this.http.get<ApiResponseEnvelope<Pipeline[]>>(`${this.API_BASE}/pipelines`);
  }

  getOpportunities(pipelineId = 1): Observable<ApiResponseEnvelope<Opportunity[]>> {
    const params = new HttpParams().set('pipelineId', pipelineId.toString());
    return this.http.get<ApiResponseEnvelope<Opportunity[]>>(`${this.API_BASE}/opportunities`, { params });
  }

  updateOpportunityStage(opportunityId: number, stageId: number): Observable<ApiResponseEnvelope<Opportunity>> {
    return this.http.patch<ApiResponseEnvelope<Opportunity>>(`${this.API_BASE}/opportunities/${opportunityId}/stage`, { stageId });
  }
}
