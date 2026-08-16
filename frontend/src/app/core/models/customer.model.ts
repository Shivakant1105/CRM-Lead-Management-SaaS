export interface Customer {
  id: number;
  publicId: string;
  customerNumber: string;
  customerType: 'INDIVIDUAL' | 'COMPANY';
  displayName: string;
  firstName?: string;
  lastName?: string;
  companyName?: string;
  email?: string;
  phone?: string;
  website?: string;
  taxNumber?: string;
  industry?: string;
  customerStatus: 'ACTIVE' | 'INACTIVE' | 'PROSPECT' | 'BLOCKED';
  billingAddress?: string;
  billingCity?: string;
  billingCountry?: string;
  archived: boolean;
  createdAt: string;
}

export interface Contact {
  id: number;
  customerId: number;
  firstName: string;
  lastName: string;
  designation?: string;
  department?: string;
  email?: string;
  phone?: string;
  contactType: 'PRIMARY' | 'DECISION_MAKER' | 'FINANCE' | 'TECHNICAL' | 'OPERATIONS' | 'OTHER';
  primary: boolean;
  decisionMaker: boolean;
}

export interface Customer360 {
  customer: Customer;
  contacts: Contact[];
  healthIndicator: 'Healthy' | 'Needs Attention' | 'At Risk' | 'No Activity';
}
