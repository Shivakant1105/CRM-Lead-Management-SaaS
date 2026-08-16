import { HttpInterceptorFn, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { catchError, of, throwError } from 'rxjs';

const MOCK_USER = {
  accessToken: 'mock-jwt-access-token-flowcrm-demo-2026',
  tokenType: 'Bearer',
  userPublicId: '11111111-1111-1111-1111-111111111111',
  firstName: 'Shiva',
  lastName: 'Admin',
  email: 'demo.admin@flowcrm.local',
  tenantId: 1,
  tenantSlug: 'flowcrm-demo',
  companyName: 'FlowCRM Demo Technologies',
  roles: ['TENANT_ADMIN'],
  permissions: ['DASHBOARD_VIEW', 'USER_VIEW', 'USER_CREATE', 'LEAD_VIEW', 'LEAD_CREATE', 'LEAD_UPDATE', 'CUSTOMER_VIEW', 'SETTINGS_MANAGE']
};

const MOCK_LEADS = [
  {
    id: 1,
    publicId: 'l1111111-1111-1111-1111-111111111111',
    leadNumber: 'LD-000001',
    firstName: 'Aarav',
    lastName: 'Mehta',
    companyName: 'Acme Technologies Pvt Ltd',
    email: 'aarav.mehta@acmetech.in',
    phone: '+91 9820011223',
    priority: 'HIGH',
    expectedValue: 450000,
    currency: 'INR',
    industry: 'Software & IT Services',
    city: 'Mumbai',
    status: { id: 3, name: 'Qualified', code: 'QUALIFIED', colorToken: '#10B981', active: true },
    source: { id: 1, name: 'Website', code: 'WEBSITE', active: true },
    assignedTo: { id: 1, firstName: 'Shiva', lastName: 'Admin', email: 'demo.admin@flowcrm.local' },
    createdAt: new Date().toISOString()
  },
  {
    id: 2,
    publicId: 'l2222222-2222-2222-2222-222222222222',
    leadNumber: 'LD-000002',
    firstName: 'Rohan',
    lastName: 'Deshmukh',
    companyName: 'BrightEdge Solutions',
    email: 'rohan@brightedge.io',
    phone: '+91 9811099887',
    priority: 'URGENT',
    expectedValue: 780000,
    currency: 'INR',
    industry: 'Consulting',
    city: 'Bangalore',
    status: { id: 4, name: 'Proposal', code: 'PROPOSAL', colorToken: '#7C3AED', active: true },
    source: { id: 2, name: 'Google Search', code: 'GOOGLE', active: true },
    assignedTo: { id: 2, firstName: 'Priya', lastName: 'Sharma', email: 'sales.executive@flowcrm.local' },
    createdAt: new Date().toISOString()
  }
];

const MOCK_PIPELINES = [
  {
    id: 1,
    name: 'Standard Sales Pipeline',
    stages: [
      { id: 1, publicId: 's1', name: 'New Prospect', displayOrder: 1, colorToken: '#4F46E5', probability: 10, won: false, lost: false },
      { id: 2, publicId: 's2', name: 'Discovery Call', displayOrder: 2, colorToken: '#06B6D4', probability: 25, won: false, lost: false },
      { id: 3, publicId: 's3', name: 'Proposal / Demo', displayOrder: 3, colorToken: '#7C3AED', probability: 50, won: false, lost: false },
      { id: 4, publicId: 's4', name: 'Negotiation', displayOrder: 4, colorToken: '#F59E0B', probability: 80, won: false, lost: false },
      { id: 5, publicId: 's5', name: 'Closed Won', displayOrder: 5, colorToken: '#10B981', probability: 100, won: true, lost: false },
      { id: 6, publicId: 's6', name: 'Closed Lost', displayOrder: 6, colorToken: '#EF4444', probability: 0, won: false, lost: true }
    ]
  }
];

const MOCK_OPPORTUNITIES = [
  {
    id: 1,
    opportunityNumber: 'OPP-000001',
    name: 'Acme Enterprise CRM Deal',
    amount: 450000,
    probability: 50,
    status: 'OPEN',
    stage: MOCK_PIPELINES[0].stages[2],
    lead: MOCK_LEADS[0]
  },
  {
    id: 2,
    opportunityNumber: 'OPP-000002',
    name: 'BrightEdge SaaS Subscription',
    amount: 780000,
    probability: 80,
    status: 'OPEN',
    stage: MOCK_PIPELINES[0].stages[3],
    lead: MOCK_LEADS[1]
  }
];

const MOCK_CUSTOMERS = [
  {
    id: 1,
    publicId: 'c1',
    customerNumber: 'CUS-000001',
    customerType: 'COMPANY',
    displayName: 'Acme Technologies Pvt Ltd',
    companyName: 'Acme Technologies Pvt Ltd',
    email: 'contact@acmetech.in',
    phone: '+91 9820011223',
    industry: 'Software & IT Services',
    customerStatus: 'ACTIVE',
    billingCity: 'Mumbai',
    billingCountry: 'India',
    archived: false,
    createdAt: new Date().toISOString()
  }
];

export const mockApiInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      // If backend endpoint is missing (404 / 504 / Network error on static Netlify deployment)
      if (error.status === 404 || error.status === 0 || error.status === 504) {
        const url = req.url;

        // Login endpoint
        if (url.endsWith('/api/v1/auth/login')) {
          return of(new HttpResponse({
            status: 200,
            body: {
              success: true,
              message: 'Demo session login successful.',
              data: MOCK_USER
            }
          }));
        }

        // Refresh endpoint
        if (url.endsWith('/api/v1/auth/refresh') || url.endsWith('/api/v1/auth/me')) {
          return of(new HttpResponse({
            status: 200,
            body: {
              success: true,
              message: 'Session verified.',
              data: MOCK_USER
            }
          }));
        }

        // Register endpoint
        if (url.endsWith('/api/v1/auth/register')) {
          return of(new HttpResponse({
            status: 200,
            body: {
              success: true,
              message: 'Workspace registered successfully.',
              data: MOCK_USER
            }
          }));
        }

        // Leads endpoint
        if (url.endsWith('/api/v1/leads')) {
          return of(new HttpResponse({
            status: 200,
            body: {
              success: true,
              message: 'Leads loaded.',
              data: {
                content: MOCK_LEADS,
                number: 0,
                size: 20,
                totalElements: MOCK_LEADS.length,
                totalPages: 1
              }
            }
          }));
        }

        // Pipelines endpoint
        if (url.endsWith('/api/v1/pipelines')) {
          return of(new HttpResponse({
            status: 200,
            body: {
              success: true,
              message: 'Pipelines loaded.',
              data: MOCK_PIPELINES
            }
          }));
        }

        // Opportunities endpoint
        if (url.includes('/api/v1/opportunities')) {
          return of(new HttpResponse({
            status: 200,
            body: {
              success: true,
              message: 'Opportunities loaded.',
              data: MOCK_OPPORTUNITIES
            }
          }));
        }

        // Customers endpoint
        if (url.includes('/api/v1/customers')) {
          if (req.method === 'GET' && url.match(/\/customers\/\d+$/)) {
            return of(new HttpResponse({
              status: 200,
              body: {
                success: true,
                message: 'Customer 360 loaded.',
                data: {
                  customer: MOCK_CUSTOMERS[0],
                  contacts: [
                    { id: 1, customerId: 1, firstName: 'Aarav', lastName: 'Mehta', designation: 'CTO', email: 'aarav@acmetech.in', phone: '+91 9820011223', contactType: 'PRIMARY', primary: true, decisionMaker: true }
                  ],
                  healthIndicator: 'Healthy'
                }
              }
            }));
          }

          return of(new HttpResponse({
            status: 200,
            body: {
              success: true,
              message: 'Customers loaded.',
              data: {
                content: MOCK_CUSTOMERS,
                number: 0,
                size: 20,
                totalElements: MOCK_CUSTOMERS.length,
                totalPages: 1
              }
            }
          }));
        }

        // Health endpoint
        if (url.endsWith('/actuator/health')) {
          return of(new HttpResponse({
            status: 200,
            body: {
              status: 'UP',
              database: 'UP',
              redis: 'UP',
              timestamp: new Date().toISOString()
            }
          }));
        }
      }

      return throwError(() => error);
    })
  );
};
