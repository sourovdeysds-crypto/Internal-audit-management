export type UserRole = 'admin' | 'auditor' | 'manager' | 'staff';

export interface Profile {
  id: string;
  full_name: string;
  email: string;
  role: UserRole;
  created_at: string;
}

export interface Audit {
  id: string;
  audit_no: string;
  title: string;
  company?: string;
  department?: string;
  audit_type?: string;
  auditor?: string;
  start_date?: string;
  end_date?: string;
  audit_period?: string;
  objective?: string;
  scope?: string;
  risk_level?: string;
  status: string;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface Finding {
  id: string;
  audit_id: string;
  finding_no: string;
  title: string;
  criteria?: string;
  condition_text?: string;
  root_cause?: string;
  risk_impact?: string;
  financial_impact?: number;
  risk_rating?: string;
  recommendation?: string;
  management_response?: string;
  responsible_person?: string;
  target_date?: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export const AUDIT_TYPES = [
  'Process Audit',
  'Payroll Audit',
  'Inventory Audit',
  'Voucher Audit',
  'Procurement Audit',
  'Cash Audit',
  'Bank Audit',
  'Compliance Audit',
  'Special Investigation',
] as const;

export const AUDIT_STATUSES = [
  'Planned',
  'Ongoing',
  'Completed',
  'On Hold',
] as const;

export const RISK_LEVELS = [
  'High',
  'Medium',
  'Low',
] as const;

export const FINDING_STATUSES = [
  'Open',
  'Management Response Pending',
  'In Progress',
  'Closed',
] as const;
