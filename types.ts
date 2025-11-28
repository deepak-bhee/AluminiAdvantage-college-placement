export enum UserRole {
  ADMIN = 'ADMIN',
  ALUMNI = 'ALUMNI',
  STUDENT = 'STUDENT'
}

export enum UserStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  INACTIVE = 'INACTIVE'
}

export interface Project {
  id: string;
  title: string;
  description: string;
  link?: string;
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  major: string;
  year: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  department?: string;
  batch?: string;
  designation?: string;
  company?: string;
  location?: string;
  bio?: string;
  linkedin?: string;
  resumeLink?: string;
  skills?: string[];
  projects?: Project[];
  education?: Education[];
  createdAt: string;
}

export enum OpportunityType {
  JOB = 'JOB',
  MENTORSHIP = 'MENTORSHIP'
}

export enum ApprovalStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED'
}

export interface Opportunity {
  id: string;
  createdBy: string; // alumniId
  creatorName: string;
  type: OpportunityType;
  title: string;
  description: string;
  company: string;
  location: string;
  requiredSkills: string[];
  deadline: string;
  approvalStatus: ApprovalStatus;
  createdAt: string;
}

export enum AlumniRecommendation {
  NONE = 'NONE',
  RECOMMENDED = 'RECOMMENDED',
  NOT_RECOMMENDED = 'NOT_RECOMMENDED'
}

export enum ApplicationStatus {
  APPLIED = 'APPLIED',
  SHORTLISTED = 'SHORTLISTED',
  FINAL_SELECTED = 'FINAL_SELECTED',
  FINAL_REJECTED = 'FINAL_REJECTED'
}

export interface Application {
  id: string;
  opportunityId: string;
  studentId: string;
  studentName: string;
  studentDepartment: string;
  alumniRecommendation: AlumniRecommendation;
  alumniComment?: string;
  adminFinalStatus: ApplicationStatus;
  appliedAt: string;
}

export interface Event {
  id: string;
  title: string;
  date: string;
  description: string;
  location: string; // 'Online' or physical address
  createdBy: string; // userId
  creatorName: string;
  approvalStatus: ApprovalStatus;
  registrations: string[]; // array of student IDs
}

export interface Notification {
  id: string;
  userId: string;
  message: string;
  read: boolean;
  date: string;
  type: 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR';
}

export interface AnalyticsData {
  totalJobs: number;
  activeJobs: number;
  totalApplications: number;
  selectionsByDept: { name: string; value: number }[];
  applicationsByStatus: { name: string; value: number }[];
  jobsByCompany: { name: string; value: number }[];
  totalEvents: number;
  activeUsers: number;
}