export interface UserProfile {
  userPublicId: string;
  firstName: string;
  lastName: string;
  email: string;
  tenantId: number;
  tenantSlug: string;
  companyName: string;
  roles: string[];
  permissions: string[];
}

export interface AuthResponseData {
  accessToken: string;
  tokenType: string;
  userPublicId: string;
  firstName: string;
  lastName: string;
  email: string;
  tenantId: number;
  tenantSlug: string;
  companyName: string;
  roles: string[];
  permissions: string[];
}

export interface ApiResponseEnvelope<T> {
  success: boolean;
  message: string;
  data: T;
  code?: string;
  errors?: Array<{ field: string; message: string }>;
}
