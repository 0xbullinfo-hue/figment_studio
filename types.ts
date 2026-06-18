
export type AppView = 
  | 'landing' 
  | 'estimator' 
  | 'portfolio' 
  | 'about' 
  | 'contact' 
  | 'dashboard' 
  | 'auth'
  | 'markup' 
  | 'insights' 
  | 'feedback'
  | 'success'
  | 'project-details'
  | 'delivery'
  | 'billing'
  | 'payment'
  | 'assets'
  | 'support'
  | 'new-project'
  | 'admin-dashboard'
  | 'profile';

export interface Marker {
  id: number;
  x: number;
  y: number;
  label: string;
  comment: string;
}

export interface VisionChat {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export interface ProjectAsset {
  name: string;
  format: string;
  size: string;
  url: string;
}

export interface Project {
  id: string;
  title: string;
  category: string;
  location: string;
  imageUrl: string;
  status: 'In Progress' | 'Completed' | 'Pending' | 'Pending Approval';
  progress: number;
  description?: string;
  revLimit?: number;
  revUsed?: number;
  assets?: ProjectAsset[];
  notes?: string;
}

export interface ProposalAttachment {
  name: string;
  url: string;
  size: string;
}

export interface ProjectProposal {
  id: string;
  clientName: string;
  projectName: string;
  type: string;
  total: number;
  status: 'Received' | 'Approved' | 'Rejected';
  date: string;
  details: string;
  attachments?: ProposalAttachment[];
}

export interface PortfolioItem {
  id: number;
  type: string;
  title: string;
  url: string;
  class: string;
  hasPlay?: boolean;
}
