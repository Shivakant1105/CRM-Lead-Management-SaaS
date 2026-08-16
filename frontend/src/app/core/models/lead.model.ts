export interface LeadSource {
  id: number;
  name: string;
  code: string;
  active: boolean;
}

export interface LeadStatus {
  id: number;
  name: string;
  code: string;
  colorToken: string;
  active: boolean;
}

export interface Tag {
  id: number;
  name: string;
  colorToken: string;
}

export interface Lead {
  id: number;
  publicId: string;
  leadNumber: string;
  firstName: string;
  lastName: string;
  companyName: string;
  email: string;
  phone: string;
  jobTitle?: string;
  website?: string;
  source?: LeadSource;
  status?: LeadStatus;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  assignedTo?: { id: number; firstName: string; lastName: string; email: string };
  expectedValue: number;
  currency: string;
  industry?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  description?: string;
  nextFollowupAt?: string;
  lastContactedAt?: string;
  tags?: Tag[];
  createdAt: string;
}

export interface FollowUp {
  id: number;
  lead?: Lead;
  type: 'CALL' | 'EMAIL' | 'MEETING' | 'WHATSAPP' | 'DEMO' | 'SITE_VISIT' | 'OTHER';
  title: string;
  scheduledAt: string;
  status: 'PENDING' | 'COMPLETED' | 'MISSED' | 'CANCELLED' | 'OVERDUE';
  notes?: string;
}

export interface PipelineStage {
  id: number;
  publicId: string;
  name: string;
  displayOrder: number;
  colorToken: string;
  probability: number;
  won: boolean;
  lost: boolean;
}

export interface Pipeline {
  id: number;
  name: string;
  stages: PipelineStage[];
}

export interface Opportunity {
  id: number;
  opportunityNumber: string;
  name: string;
  lead?: Lead;
  pipeline: Pipeline;
  stage: PipelineStage;
  amount: number;
  probability: number;
  status: 'OPEN' | 'WON' | 'LOST';
}
