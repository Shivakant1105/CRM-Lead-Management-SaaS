import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponseEnvelope } from '../models/auth.model';
import { Customer, Customer360, Contact } from '../models/customer.model';
import { PageResponse } from './lead.service';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  private readonly API_BASE = '/api/v1/customers';

  constructor(private http: HttpClient) {}

  getCustomers(search?: string, type?: string, status?: string, page = 0, size = 20): Observable<ApiResponseEnvelope<PageResponse<Customer>>> {
    let params = new HttpParams().set('page', page.toString()).set('size', size.toString());
    if (search) params = params.set('search', search);
    if (type) params = params.set('type', type);
    if (status) params = params.set('status', status);

    return this.http.get<ApiResponseEnvelope<PageResponse<Customer>>>(this.API_BASE, { params });
  }

  getCustomer360(id: number): Observable<ApiResponseEnvelope<Customer360>> {
    return this.http.get<ApiResponseEnvelope<Customer360>>(`${this.API_BASE}/${id}`);
  }

  createCustomer(data: any): Observable<ApiResponseEnvelope<Customer>> {
    return this.http.post<ApiResponseEnvelope<Customer>>(this.API_BASE, data);
  }

  updateCustomer(id: number, data: any): Observable<ApiResponseEnvelope<Customer>> {
    return this.http.put<ApiResponseEnvelope<Customer>>(`${this.API_BASE}/${id}`, data);
  }

  archiveCustomer(id: number): Observable<ApiResponseEnvelope<void>> {
    return this.http.patch<ApiResponseEnvelope<void>>(`${this.API_BASE}/${id}/archive`, {});
  }

  restoreCustomer(id: number): Observable<ApiResponseEnvelope<void>> {
    return this.http.patch<ApiResponseEnvelope<void>>(`${this.API_BASE}/${id}/restore`, {});
  }

  addContact(customerId: number, data: any): Observable<ApiResponseEnvelope<Contact>> {
    return this.http.post<ApiResponseEnvelope<Contact>>(`${this.API_BASE}/${customerId}/contacts`, data);
  }

  checkDuplicates(data: { email?: string; phone?: string; taxNumber?: string; companyName?: string }): Observable<ApiResponseEnvelope<Customer[]>> {
    return this.http.post<ApiResponseEnvelope<Customer[]>>(`${this.API_BASE}/duplicate-check`, data);
  }
}
