export type Role = 'Admin' | 'General User';
export type UserStatus = 'Active' | 'Suspended';
export type Clearance = 'Public' | 'Internal' | 'Confidential';
export type StageName = 'Initiated' | 'Queried' | 'Verified' | 'Cleared';

export interface User {
  id: string;
  name: string;
  role: Role;
  accessLevel: string;
  status: UserStatus;
}

export interface AuthSession {
  token: string;
  user: User;
}

export interface RecordItem {
  id: string;
  title: string;
  level: Clearance;
  status: 'Encrypted' | 'Decrypted' | 'Locked';
  size: string;
  candidateId: string;
}

export interface Candidate {
  id: string;
  name: string;
  role: string;
  score: number;
  stage: number;
  aadhaar: string;
  phone: string;
  canReveal: boolean;
}

export interface AuditEvent {
  i: number;
  time: string;
  evt: string;
  user: string;
  ip: string;
  hash?: string;
}

export interface ApiError {
  status: number;
  message: string;
}
