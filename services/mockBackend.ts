import { 
  User, UserRole, UserStatus, Opportunity, OpportunityType, 
  ApprovalStatus, Application, AlumniRecommendation, ApplicationStatus, 
  Event, AnalyticsData, Notification 
} from '../types';

// --- PERSISTENCE CONSTANTS ---
const KEY_USERS = 'aa_users_v2'; // Changed key to force re-seed with better data
const KEY_OPPS = 'aa_opps_v2';
const KEY_APPS = 'aa_apps_v2';
const KEY_EVENTS = 'aa_events_v2';
const KEY_NOTIFS = 'aa_notifs_v2';

// --- SEED DATA ---
const seedData = () => {
  if (!localStorage.getItem(KEY_USERS)) {
    // Seed Admin
    const admin: User = {
      id: 'admin-1',
      name: 'Super Admin',
      email: 'admin@college.edu',
      role: UserRole.ADMIN,
      status: UserStatus.APPROVED,
      department: 'Placement Cell',
      designation: 'Director',
      createdAt: new Date().toISOString()
    };
    
    // Seed Active Alumni
    const alumni: User = {
      id: 'alumni-1',
      name: 'John Doe',
      email: 'john@tech.com',
      role: UserRole.ALUMNI,
      status: UserStatus.APPROVED,
      company: 'Google',
      designation: 'Senior Engineer',
      batch: '2018',
      skills: ['System Design', 'Cloud Architecture', 'Mentorship'],
      education: [
        { id: 'edu-1', institution: 'College of Engineering', degree: 'B.Tech', major: 'Computer Science', year: '2018' }
      ],
      createdAt: new Date().toISOString()
    };

    // Seed Pending Alumni (To show approval flow)
    const pendingAlumni: User = {
      id: 'alumni-pending-1',
      name: 'Sarah Connor',
      email: 'sarah@cyberdyne.com',
      role: UserRole.ALUMNI,
      status: UserStatus.PENDING,
      company: 'Cyberdyne Systems',
      designation: 'Security Lead',
      batch: '2019',
      skills: ['Security', 'AI'],
      createdAt: new Date().toISOString()
    };

    // Seed Student
    const student: User = {
      id: 'student-1',
      name: 'Alice Smith',
      email: 'alice@student.college.edu',
      role: UserRole.STUDENT,
      status: UserStatus.APPROVED,
      department: 'Computer Science',
      batch: '2024',
      resumeLink: 'https://example.com/resume.pdf',
      skills: ['React', 'TypeScript', 'Node.js', 'Figma'],
      projects: [
        { id: 'proj-1', title: 'E-Commerce App', description: 'Built a full-stack shopping app using MERN stack.', link: 'https://github.com/alice/shop' }
      ],
      education: [
        { id: 'edu-1', institution: 'College of Engineering', degree: 'B.Tech', major: 'Computer Science', year: '2024' }
      ],
      createdAt: new Date().toISOString()
    };

    localStorage.setItem(KEY_USERS, JSON.stringify([admin, alumni, pendingAlumni, student]));
    
    // Seed Opportunity
    const opp: Opportunity = {
      id: 'opp-1',
      createdBy: 'alumni-1',
      creatorName: 'John Doe',
      type: OpportunityType.JOB,
      title: 'Frontend Engineer',
      description: 'We are looking for a skilled Frontend Engineer to join our team. You will be working on our core product using React and TypeScript.',
      company: 'Google',
      location: 'Bangalore (Hybrid)',
      requiredSkills: ['React', 'TypeScript', 'Redux'],
      deadline: '2024-12-31',
      approvalStatus: ApprovalStatus.APPROVED,
      createdAt: new Date().toISOString()
    };

    const pendingOpp: Opportunity = {
      id: 'opp-2',
      createdBy: 'alumni-1',
      creatorName: 'John Doe',
      type: OpportunityType.MENTORSHIP,
      title: 'Career Guidance Session',
      description: 'One-on-one mentorship for final year students interested in FAANG companies.',
      company: 'Google',
      location: 'Online',
      requiredSkills: ['DSA', 'System Design'],
      deadline: '2025-01-15',
      approvalStatus: ApprovalStatus.PENDING,
      createdAt: new Date().toISOString()
    };

    localStorage.setItem(KEY_OPPS, JSON.stringify([opp, pendingOpp]));
    localStorage.setItem(KEY_APPS, JSON.stringify([]));
    
    // Seed Event
    const event: Event = {
      id: 'evt-1',
      title: 'Tech Talk: Future of AI',
      date: '2024-11-20',
      description: 'Join us for an insightful session on how AI is transforming the software industry.',
      location: 'Auditorium A',
      createdBy: 'alumni-1',
      creatorName: 'John Doe',
      approvalStatus: ApprovalStatus.APPROVED,
      registrations: []
    };
    
    localStorage.setItem(KEY_EVENTS, JSON.stringify([event]));
    localStorage.setItem(KEY_NOTIFS, JSON.stringify([]));
  }
};

seedData();

// --- HELPERS ---
const get = <T>(key: string): T[] => JSON.parse(localStorage.getItem(key) || '[]');
const set = (key: string, data: any[]) => localStorage.setItem(key, JSON.stringify(data));
const delay = (ms: number = 400) => new Promise(res => setTimeout(res, ms));

const createNotification = (userId: string, message: string, type: 'INFO'|'SUCCESS'|'WARNING'|'ERROR' = 'INFO') => {
  const notifs = get<Notification>(KEY_NOTIFS);
  notifs.unshift({
    id: Math.random().toString(36).substr(2, 9),
    userId,
    message,
    read: false,
    date: new Date().toISOString(),
    type
  });
  set(KEY_NOTIFS, notifs);
};

// --- API LAYER ---
export const MockBackend = {
  // === AUTHENTICATION ===
  login: async (email: string): Promise<User | null> => {
    await delay();
    const users = get<User>(KEY_USERS);
    const user = users.find(u => u.email === email);
    // Allow Pending users to login but functionality will be restricted in real app
    // For this demo, we let them in but dashboard will show limited view if we implemented that check
    return user || null;
  },

  register: async (user: Omit<User, 'id' | 'status' | 'createdAt'>): Promise<User> => {
    await delay();
    const users = get<User>(KEY_USERS);
    if (users.find(u => u.email === user.email)) throw new Error('User already exists');
    
    const newUser: User = {
      ...user,
      id: Math.random().toString(36).substr(2, 9),
      // Auto-approve Students, but ALUMNI/ADMIN depend on requirement. 
      // User asked for "Work accurately without pending message", so we auto-approve for convenience.
      status: UserStatus.APPROVED, 
      skills: [],
      projects: [],
      education: [],
      createdAt: new Date().toISOString()
    };
    
    users.push(newUser);
    set(KEY_USERS, users);
    createNotification(newUser.id, `Welcome to Alumni Advantage! Complete your profile to get started.`, 'SUCCESS');
    return newUser;
  },

  updateUser: async (updatedUser: User): Promise<User> => {
    await delay();
    const users = get<User>(KEY_USERS);
    const idx = users.findIndex(u => u.id === updatedUser.id);
    if (idx !== -1) {
      users[idx] = updatedUser;
      set(KEY_USERS, users);
      return updatedUser;
    }
    throw new Error('User not found');
  },

  // === USER MANAGEMENT ===
  getUserById: (id: string): User | undefined => {
    return get<User>(KEY_USERS).find(u => u.id === id);
  },

  getUsersByStatus: (role: UserRole, status: UserStatus): User[] => {
    return get<User>(KEY_USERS).filter(u => u.role === role && u.status === status);
  },

  updateUserStatus: async (userId: string, status: UserStatus): Promise<void> => {
    await delay();
    const users = get<User>(KEY_USERS);
    const idx = users.findIndex(u => u.id === userId);
    if (idx !== -1) {
      users[idx].status = status;
      set(KEY_USERS, users);
      createNotification(userId, `Your account status has been updated to: ${status}`, status === 'APPROVED' ? 'SUCCESS' : 'WARNING');
    }
  },

  // === OPPORTUNITIES ===
  createOpportunity: async (opp: Omit<Opportunity, 'id' | 'approvalStatus' | 'createdAt'>): Promise<void> => {
    await delay();
    const opps = get<Opportunity>(KEY_OPPS);
    const newOpp: Opportunity = {
      ...opp,
      id: Math.random().toString(36).substr(2, 9),
      approvalStatus: ApprovalStatus.PENDING, // Always pending first
      createdAt: new Date().toISOString()
    };
    opps.push(newOpp);
    set(KEY_OPPS, opps);
    
    // Notify Admins
    const admins = get<User>(KEY_USERS).filter(u => u.role === UserRole.ADMIN);
    admins.forEach(a => createNotification(a.id, `New ${opp.type} posted: ${opp.title}`, 'INFO'));
  },

  getOpportunities: (role: UserRole, userId?: string): Opportunity[] => {
    const opps = get<Opportunity>(KEY_OPPS);
    if (role === UserRole.ADMIN) return opps;
    if (role === UserRole.ALUMNI) return opps.filter(o => o.createdBy === userId);
    return opps.filter(o => o.approvalStatus === ApprovalStatus.APPROVED);
  },

  updateOpportunityStatus: async (oppId: string, status: ApprovalStatus): Promise<void> => {
    await delay();
    const opps = get<Opportunity>(KEY_OPPS);
    const idx = opps.findIndex(o => o.id === oppId);
    if (idx !== -1) {
      opps[idx].approvalStatus = status;
      set(KEY_OPPS, opps);
      createNotification(opps[idx].createdBy, `Your job posting "${opps[idx].title}" was ${status}`, status === 'APPROVED' ? 'SUCCESS' : 'ERROR');
    }
  },

  deleteOpportunity: async (oppId: string): Promise<void> => {
    await delay();
    const opps = get<Opportunity>(KEY_OPPS).filter(o => o.id !== oppId);
    set(KEY_OPPS, opps);
  },

  // === APPLICATIONS ===
  apply: async (app: Omit<Application, 'id' | 'alumniRecommendation' | 'adminFinalStatus' | 'appliedAt'>): Promise<void> => {
    await delay();
    const apps = get<Application>(KEY_APPS);
    const existing = apps.find(a => a.studentId === app.studentId && a.opportunityId === app.opportunityId);
    if (existing) throw new Error("You have already applied to this opportunity.");

    const newApp: Application = {
      ...app,
      id: Math.random().toString(36).substr(2, 9),
      alumniRecommendation: AlumniRecommendation.NONE,
      adminFinalStatus: ApplicationStatus.APPLIED,
      appliedAt: new Date().toISOString()
    };
    apps.push(newApp);
    set(KEY_APPS, apps);

    // Notify Opportunity Creator
    const opp = get<Opportunity>(KEY_OPPS).find(o => o.id === app.opportunityId);
    if (opp) {
        createNotification(opp.createdBy, `New applicant for ${opp.title}: ${app.studentName}`, 'INFO');
    }
  },

  getApplications: (oppId?: string, studentId?: string): Application[] => {
    const apps = get<Application>(KEY_APPS);
    if (oppId) return apps.filter(a => a.opportunityId === oppId);
    if (studentId) return apps.filter(a => a.studentId === studentId);
    return apps;
  },

  recommendApplication: async (appId: string, rec: AlumniRecommendation, comment: string): Promise<void> => {
    await delay();
    const apps = get<Application>(KEY_APPS);
    const idx = apps.findIndex(a => a.id === appId);
    if (idx !== -1) {
      apps[idx].alumniRecommendation = rec;
      apps[idx].alumniComment = comment;
      set(KEY_APPS, apps);
    }
  },

  finalizeApplication: async (appId: string, status: ApplicationStatus): Promise<void> => {
    await delay();
    const apps = get<Application>(KEY_APPS);
    const idx = apps.findIndex(a => a.id === appId);
    if (idx !== -1) {
      apps[idx].adminFinalStatus = status;
      set(KEY_APPS, apps);
      
      const opp = get<Opportunity>(KEY_OPPS).find(o => o.id === apps[idx].opportunityId);
      const msg = status === ApplicationStatus.FINAL_SELECTED 
        ? `Congratulations! You have been selected for ${opp?.title}` 
        : `Update on your application for ${opp?.title}: ${status.replace('FINAL_', '')}`;
      
      createNotification(apps[idx].studentId, msg, status === ApplicationStatus.FINAL_SELECTED ? 'SUCCESS' : 'INFO');
    }
  },

  // === EVENTS ===
  createEvent: async (event: Omit<Event, 'id' | 'approvalStatus' | 'registrations'>): Promise<void> => {
    await delay();
    const events = get<Event>(KEY_EVENTS);
    const newEvent: Event = {
      ...event,
      id: Math.random().toString(36).substr(2, 9),
      approvalStatus: ApprovalStatus.PENDING,
      registrations: []
    };
    events.push(newEvent);
    set(KEY_EVENTS, events);

    // Notify Admins
    const admins = get<User>(KEY_USERS).filter(u => u.role === UserRole.ADMIN);
    admins.forEach(a => createNotification(a.id, `New event proposed: ${event.title}`, 'INFO'));
  },

  getEvents: (role: UserRole, userId?: string): Event[] => {
    const events = get<Event>(KEY_EVENTS);
    if (role === UserRole.ADMIN) return events;
    if (role === UserRole.ALUMNI) return events.filter(e => e.createdBy === userId || e.approvalStatus === ApprovalStatus.APPROVED);
    return events.filter(e => e.approvalStatus === ApprovalStatus.APPROVED);
  },

  updateEventStatus: async (eventId: string, status: ApprovalStatus): Promise<void> => {
    await delay();
    const events = get<Event>(KEY_EVENTS);
    const idx = events.findIndex(e => e.id === eventId);
    if (idx !== -1) {
      events[idx].approvalStatus = status;
      set(KEY_EVENTS, events);
      createNotification(events[idx].createdBy, `Your event "${events[idx].title}" was ${status}`, status === 'APPROVED' ? 'SUCCESS' : 'WARNING');
    }
  },

  registerForEvent: async (eventId: string, studentId: string): Promise<void> => {
    await delay();
    const events = get<Event>(KEY_EVENTS);
    const idx = events.findIndex(e => e.id === eventId);
    if (idx !== -1) {
       if (events[idx].registrations.includes(studentId)) throw new Error("You are already registered for this event.");
       events[idx].registrations.push(studentId);
       set(KEY_EVENTS, events);
       createNotification(studentId, `Registered successfully for event: ${events[idx].title}`, 'SUCCESS');
    }
  },

  // === NOTIFICATIONS ===
  getNotifications: (userId: string): Notification[] => {
    return get<Notification>(KEY_NOTIFS).filter(n => n.userId === userId);
  },

  markNotificationRead: (notifId: string) => {
    const notifs = get<Notification>(KEY_NOTIFS);
    const idx = notifs.findIndex(n => n.id === notifId);
    if (idx !== -1) {
      notifs[idx].read = true;
      set(KEY_NOTIFS, notifs);
    }
  },

  // === ANALYTICS ===
  getAnalytics: (): AnalyticsData => {
    const opps = get<Opportunity>(KEY_OPPS);
    const apps = get<Application>(KEY_APPS);
    const users = get<User>(KEY_USERS);
    const events = get<Event>(KEY_EVENTS);
    
    const selections = apps.filter(a => a.adminFinalStatus === ApplicationStatus.FINAL_SELECTED);
    
    const deptMap: Record<string, number> = {};
    selections.forEach(s => {
      const dept = s.studentDepartment || 'Unknown';
      deptMap[dept] = (deptMap[dept] || 0) + 1;
    });

    const statusMap: Record<string, number> = {};
    apps.forEach(a => {
        statusMap[a.adminFinalStatus] = (statusMap[a.adminFinalStatus] || 0) + 1;
    });

    const companyMap: Record<string, number> = {};
    opps.forEach(o => {
        companyMap[o.company] = (companyMap[o.company] || 0) + 1;
    });

    return {
      totalJobs: opps.length,
      activeJobs: opps.filter(o => o.approvalStatus === ApprovalStatus.APPROVED).length,
      totalApplications: apps.length,
      selectionsByDept: Object.entries(deptMap).map(([name, value]) => ({ name, value })),
      applicationsByStatus: Object.entries(statusMap).map(([name, value]) => ({ name, value })),
      jobsByCompany: Object.entries(companyMap).map(([name, value]) => ({ name, value })),
      totalEvents: events.length,
      activeUsers: users.length
    };
  }
};