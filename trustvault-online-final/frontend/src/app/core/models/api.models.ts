export type UserRole = 'Admin' | 'General User';
export type AccessLevel = 'Alpha (Public)' | 'Beta (Internal)' | 'Omega (Full)';
export type UserStatus = 'Active' | 'Suspended';
export type VerificationStage = 0 | 1 | 2 | 3;

export interface User {
  id: string;
  name: string;
  role: UserRole;
  accessLevel: AccessLevel;
  status: UserStatus;
  createdAt?: string;
}

export interface LoginRequest {
  userId: string;
  password: string;
  role: UserRole;
}

export interface LoginResponse {
  mfaToken: string;
  user: User;
  otpDemo: string;
  expiresInSeconds: number;
}

export interface MfaResponse {
  token: string;
  user: User;
}

export interface RecordItem {
  id: string;
  title: string;
  level: 'Public' | 'Internal' | 'Confidential';
  status: 'Decrypted' | 'Locked';
  size: string;
  candidateId: string;
}

export interface Candidate {
  id: string;
  name: string;
  role: string;
  score: number;
  stage: VerificationStage;
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
