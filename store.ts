import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Project, ProjectProposal, PortfolioItem, AcademyRegistration } from './types';
import { INITIAL_PROJECTS, IMAGES } from './constants';

type UserRole = 'guest' | 'client' | 'admin';
type SubscriptionPlan = 'trial' | 'pro';

interface AuthSession {
  isAuthenticated: boolean;
  role: UserRole;
  plan: SubscriptionPlan;
  name: string;
}

interface StudioState {
  auth: AuthSession;
  arcvizTrialUsed: number;
  projects: Project[];
  proposals: ProjectProposal[];
  portfolioItems: PortfolioItem[];
  academyRegistrations: AcademyRegistration[];
  login: (role: 'client' | 'admin', plan?: SubscriptionPlan, name?: string) => void;
  logout: () => void;
  setPlan: (plan: SubscriptionPlan) => void;
  incrementArcvizTrial: () => void;
  resetArcvizTrial: () => void;
  addProject: (project: Project) => void;
  updateProject: (project: Project) => void;
  addProposal: (proposal: ProjectProposal) => void;
  updateProposalStatus: (id: string, status: 'Approved' | 'Rejected') => void;
  addPortfolioItem: (item: PortfolioItem) => void;
  commitRevision: (projectId: string, comments: string) => void;
  addAcademyRegistration: (reg: AcademyRegistration) => void;
  updateAcademyRegistrationStatus: (id: string, status: AcademyRegistration['status']) => void;
  updateAcademyRegistrationNotes: (id: string, notes: string) => void;
}

export const useStudioStore = create<StudioState>()(persist((set) => ({
  auth: {
    isAuthenticated: false,
    role: 'guest',
    plan: 'trial',
    name: 'Guest User',
  },
  arcvizTrialUsed: 0,
  projects: INITIAL_PROJECTS,
  proposals: [
    { 
      id: 'PROP-901', 
      clientName: 'Sarah Jenkins', 
      projectName: 'Maitama Office Complex', 
      type: 'Commercial', 
      total: 12500, 
      status: 'Received', 
      date: new Date().toISOString().split('T')[0], 
      details: 'High-end 3D walkthrough requested for a 12-story commercial tower.',
      attachments: [{ name: 'Complex_Brief.pdf', url: '#', size: '2.4 MB' }]
    }
  ],
  portfolioItems: IMAGES.gallery,
  academyRegistrations: [
    {
      id: 'REG-101',
      name: 'Chinedu Okafor',
      email: 'chinedu@example.com',
      phone: '+234 803 123 4567',
      experienceLevel: 'Intermediate',
      preferredFormat: 'Onsite Abuja Studio',
      courseInterest: 'Revit + D5 rendering (interior/exterior)',
      status: 'Pending',
      date: '2026-06-20',
      message: 'I want to master realism in architectural visualisations using Revit and D5 Render.',
      notes: 'Awaiting portfolio review.'
    },
    {
      id: 'REG-102',
      name: 'Amina Yusuf',
      email: 'amina.y@example.com',
      phone: '+234 812 987 6543',
      experienceLevel: 'Beginner',
      preferredFormat: 'Live Online Interactive',
      courseInterest: 'D5 Rendering only (interior/exterior ) + Animation',
      status: 'Contacted',
      date: '2026-06-19',
      message: 'Looking to transition from architecture to full-time real-time D5 rendering and animation.',
      notes: 'Spoke on WhatsApp. Planning to join the upcoming July cohort.'
    }
  ],

  login: (role, plan = 'trial', name = role === 'admin' ? 'Studio Admin' : 'Client User') => set(() => ({
    auth: {
      isAuthenticated: true,
      role,
      plan: role === 'admin' ? 'pro' : plan,
      name,
    },
  })),

  logout: () => set(() => ({
    auth: {
      isAuthenticated: false,
      role: 'guest',
      plan: 'trial',
      name: 'Guest User',
    },
  })),

  setPlan: (plan) => set((state) => ({
    auth: {
      ...state.auth,
      plan,
    },
  })),

  incrementArcvizTrial: () => set((state) => ({
    arcvizTrialUsed: state.arcvizTrialUsed + 1,
  })),

  resetArcvizTrial: () => set(() => ({
    arcvizTrialUsed: 0,
  })),

  addProject: (project) => set((state) => ({ 
    projects: [project, ...state.projects] 
  })),

  updateProject: (updatedProject) => set((state) => ({ 
    projects: state.projects.map(p => p.id === updatedProject.id ? { ...updatedProject } : p) 
  })),

  addProposal: (proposal) => set((state) => ({ 
    proposals: [proposal, ...state.proposals] 
  })),

  updateProposalStatus: (id, status) => set((state) => {
    const updatedProposals = state.proposals.map(p => p.id === id ? { ...p, status } : p);
    
    // Auto-create project if approved
    if (status === 'Approved') {
      const prop = state.proposals.find(p => p.id === id);
      if (prop) {
        const newProject: Project = {
          id: `FS-${Math.floor(Math.random() * 1000)}`,
          title: prop.projectName,
          category: prop.type,
          location: 'Abuja (TBD)',
          status: 'Pending',
          progress: 0,
          imageUrl: IMAGES.hero, // Placeholder
          description: prop.details,
          revLimit: 3,
          revUsed: 0,
          assets: []
        };
        return { proposals: updatedProposals, projects: [newProject, ...state.projects] };
      }
    }
    
    return { proposals: updatedProposals };
  }),

  addPortfolioItem: (item) => set((state) => ({ 
    portfolioItems: [item, ...state.portfolioItems] 
  })),

  commitRevision: (projectId, comments) => set((state) => ({
    projects: state.projects.map(p => {
      if (p.id === projectId) {
        return {
          ...p,
          revUsed: (p.revUsed || 0) + 1,
          status: 'In Progress',
          notes: (p.notes ? p.notes + '\n' : '') + `Client Feedback: ${comments}`
        };
      }
      return p;
    })
  })),

  addAcademyRegistration: (reg) => set((state) => ({
    academyRegistrations: [reg, ...state.academyRegistrations]
  })),

  updateAcademyRegistrationStatus: (id, status) => set((state) => ({
    academyRegistrations: state.academyRegistrations.map(r => r.id === id ? { ...r, status } : r)
  })),

  updateAcademyRegistrationNotes: (id, notes) => set((state) => ({
    academyRegistrations: state.academyRegistrations.map(r => r.id === id ? { ...r, notes } : r)
  }))
}), {
  name: 'figment-studio-store',
  partialize: (state) => ({
    auth: state.auth,
    arcvizTrialUsed: state.arcvizTrialUsed,
    academyRegistrations: state.academyRegistrations,
  }),
}));
