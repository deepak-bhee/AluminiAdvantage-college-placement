import React, { useState, useEffect } from 'react';
import { User, UserRole, UserStatus, Opportunity, ApprovalStatus, Application, ApplicationStatus, AnalyticsData, AlumniRecommendation, Event } from '../types';
import { MockBackend } from '../services/mockBackend';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Check, X, Eye, FileText, Briefcase, GraduationCap, ChevronDown, ChevronUp, Calendar, MapPin, Search } from 'lucide-react';

export const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'jobs' | 'events' | 'placements'>('overview');
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [pendingUsers, setPendingUsers] = useState<User[]>([]);
  const [pendingOpps, setPendingOpps] = useState<Opportunity[]>([]);
  const [pendingEvents, setPendingEvents] = useState<Event[]>([]);
  const [activeOpps, setActiveOpps] = useState<Opportunity[]>([]);
  const [selectedOppForPlacement, setSelectedOppForPlacement] = useState<string | null>(null);
  const [applications, setApplications] = useState<Application[]>([]);
  
  // UI State
  const [expandedAppId, setExpandedAppId] = useState<string | null>(null);
  const [expandedUser, setExpandedUser] = useState<User | null>(null);

  useEffect(() => {
    loadData();
  }, [activeTab]);

  useEffect(() => {
    if (selectedOppForPlacement) {
        loadApplications(selectedOppForPlacement);
    }
  }, [selectedOppForPlacement]);

  const loadData = async () => {
    setAnalytics(MockBackend.getAnalytics());
    setPendingUsers([...MockBackend.getUsersByStatus(UserRole.ALUMNI, UserStatus.PENDING), ...MockBackend.getUsersByStatus(UserRole.ADMIN, UserStatus.PENDING)]);
    
    const allOpps = MockBackend.getOpportunities(UserRole.ADMIN);
    setPendingOpps(allOpps.filter(o => o.approvalStatus === ApprovalStatus.PENDING));
    setActiveOpps(allOpps.filter(o => o.approvalStatus === ApprovalStatus.APPROVED));

    const allEvents = MockBackend.getEvents(UserRole.ADMIN);
    setPendingEvents(allEvents.filter(e => e.approvalStatus === ApprovalStatus.PENDING));
  };

  const loadApplications = (oppId: string) => {
      setApplications(MockBackend.getApplications(oppId));
  };

  const handleUserApproval = async (id: string, status: UserStatus) => {
    await MockBackend.updateUserStatus(id, status);
    loadData();
  };

  const handleOppApproval = async (id: string, status: ApprovalStatus) => {
    await MockBackend.updateOpportunityStatus(id, status);
    loadData();
  };

  const handleEventApproval = async (id: string, status: ApprovalStatus) => {
    await MockBackend.updateEventStatus(id, status);
    loadData();
  };

  const handleFinalDecision = async (appId: string, status: ApplicationStatus) => {
    await MockBackend.finalizeApplication(appId, status);
    if(selectedOppForPlacement) loadApplications(selectedOppForPlacement);
    loadData();
  };

  const toggleExpandUser = (appId: string, userId: string) => {
    if (expandedAppId === appId) {
      setExpandedAppId(null);
      setExpandedUser(null);
    } else {
      setExpandedAppId(appId);
      const user = MockBackend.getUserById(userId);
      setExpandedUser(user || null);
    }
  };

  const COLORS = ['#0ea5e9', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6'];

  // --- SUB-COMPONENTS ---

  const Overview = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500 font-medium">Total Users</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{analytics?.activeUsers || 0}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500 font-medium">Active Jobs</p>
          <p className="text-3xl font-bold text-green-600 mt-2">{analytics?.activeJobs || 0}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500 font-medium">Applications</p>
          <p className="text-3xl font-bold text-blue-600 mt-2">{analytics?.totalApplications || 0}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500 font-medium">Events</p>
          <p className="text-3xl font-bold text-purple-600 mt-2">{analytics?.totalEvents || 0}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">Selections by Department</h3>
          <div className="h-64">
             <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analytics?.selectionsByDept || []}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} />
                  <YAxis allowDecimals={false} axisLine={false} tickLine={false} />
                  <Tooltip cursor={{fill: 'transparent'}} />
                  <Bar dataKey="value" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
                </BarChart>
             </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">Application Funnel</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={analytics?.applicationsByStatus || []}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {(analytics?.applicationsByStatus || []).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );

  const UserApprovals = () => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
        <h3 className="text-lg font-semibold text-gray-800">Pending User Approvals</h3>
      </div>
      {pendingUsers.length === 0 ? (
        <div className="p-12 text-center text-gray-500 flex flex-col items-center">
            <div className="bg-gray-100 p-4 rounded-full mb-3"><Check size={24} className="text-gray-400"/></div>
            <p>All users approved</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-600 font-medium text-xs uppercase tracking-wider">
              <tr>
                <th className="px-6 py-3">Name</th>
                <th className="px-6 py-3">Role</th>
                <th className="px-6 py-3">Email</th>
                <th className="px-6 py-3">Details</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {pendingUsers.map(u => (
                <tr key={u.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium">{u.name}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs rounded-full font-semibold ${u.role === UserRole.ALUMNI ? 'bg-purple-100 text-purple-700' : 'bg-orange-100 text-orange-700'}`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{u.email}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {u.role === UserRole.ALUMNI ? `${u.designation} @ ${u.company}` : u.department}
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <button 
                      onClick={() => handleUserApproval(u.id, UserStatus.APPROVED)}
                      className="inline-flex items-center px-3 py-1 bg-green-50 text-green-700 hover:bg-green-100 rounded-md text-sm transition-colors"
                    >
                      <Check size={14} className="mr-1" /> Approve
                    </button>
                    <button 
                      onClick={() => handleUserApproval(u.id, UserStatus.REJECTED)}
                      className="inline-flex items-center px-3 py-1 bg-red-50 text-red-700 hover:bg-red-100 rounded-md text-sm transition-colors"
                    >
                      <X size={14} className="mr-1" /> Reject
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );

  const ApprovalsList = ({ items, type }: { items: any[], type: 'job' | 'event' }) => (
     <div className="space-y-4">
       <h3 className="text-lg font-semibold text-gray-800">Pending {type === 'job' ? 'Opportunities' : 'Events'}</h3>
       {items.length === 0 ? (
          <div className="p-8 text-center bg-white rounded-xl border border-gray-200 text-gray-500">
              No pending {type}s.
          </div>
       ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
             {items.map(item => (
                <div key={item.id} className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between">
                   <div>
                      <div className="flex justify-between items-start mb-2">
                         <h4 className="font-bold text-gray-900">{item.title}</h4>
                         <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full uppercase font-medium">{type === 'job' ? item.type : 'EVENT'}</span>
                      </div>
                      <p className="text-sm text-gray-600 mb-1">By: {item.creatorName}</p>
                      <p className="text-sm text-gray-500 line-clamp-2 mb-4">{item.description}</p>
                   </div>
                   <div className="flex justify-end space-x-3 pt-3 border-t border-gray-100">
                      <button 
                        onClick={() => type === 'job' ? handleOppApproval(item.id, ApprovalStatus.REJECTED) : handleEventApproval(item.id, ApprovalStatus.REJECTED)}
                        className="text-sm px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg font-medium"
                      >
                        Reject
                      </button>
                      <button 
                        onClick={() => type === 'job' ? handleOppApproval(item.id, ApprovalStatus.APPROVED) : handleEventApproval(item.id, ApprovalStatus.APPROVED)}
                        className="text-sm px-4 py-2 bg-brand-600 text-white hover:bg-brand-700 rounded-lg font-medium"
                      >
                        Approve
                      </button>
                   </div>
                </div>
             ))}
          </div>
       )}
    </div>
  );

  const PlacementsBoard = () => (
    <div className="flex flex-col h-full space-y-4">
      {!selectedOppForPlacement ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Select a Job to Manage Selections</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {activeOpps.map(opp => (
              <button 
                key={opp.id}
                onClick={() => setSelectedOppForPlacement(opp.id)}
                className="text-left p-4 rounded-lg border border-gray-200 hover:border-brand-500 hover:ring-1 hover:ring-brand-500 transition-all group"
              >
                <h4 className="font-bold text-gray-900 group-hover:text-brand-600">{opp.title}</h4>
                <p className="text-sm text-gray-500">{opp.company}</p>
                <div className="mt-4 flex items-center text-xs text-brand-600 font-medium">Manage Applicants <ArrowRightIcon className="ml-1 w-3 h-3"/></div>
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex-1">
          <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
            <div>
                <button onClick={() => { setSelectedOppForPlacement(null); setExpandedAppId(null); }} className="text-sm text-gray-500 hover:text-gray-900 mb-1 flex items-center"><ChevronLeftIcon className="w-4 h-4 mr-1"/> Back to Jobs</button>
                <h3 className="text-lg font-bold text-gray-800">
                    {activeOpps.find(o => o.id === selectedOppForPlacement)?.title} <span className="text-gray-400 font-normal">at</span> {activeOpps.find(o => o.id === selectedOppForPlacement)?.company}
                </h3>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-white text-gray-600 font-medium text-xs uppercase tracking-wider border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3">Student</th>
                  <th className="px-6 py-3">Details</th>
                  <th className="px-6 py-3">Alumni Rec</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3 text-right">Final Decision</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {applications.length === 0 ? (
                    <tr><td colSpan={5} className="px-6 py-8 text-center text-gray-500">No applicants yet.</td></tr>
                ) : applications.map(app => (
                  <React.Fragment key={app.id}>
                  <tr className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                        <div className="font-medium text-gray-900">{app.studentName}</div>
                        <div className="text-xs text-gray-500">{app.studentDepartment}</div>
                    </td>
                    <td className="px-6 py-4">
                       <button 
                        onClick={() => toggleExpandUser(app.id, app.studentId)}
                        className="text-xs bg-brand-50 text-brand-700 px-3 py-1 rounded-full flex items-center w-fit hover:bg-brand-100 transition-colors"
                       >
                         {expandedAppId === app.id ? <ChevronUp size={14} className="mr-1" /> : <ChevronDown size={14} className="mr-1" />}
                         View Profile
                       </button>
                    </td>
                    <td className="px-6 py-4">
                      {app.alumniRecommendation === AlumniRecommendation.RECOMMENDED && (
                        <div className="flex flex-col">
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800 w-fit">
                               Recommended
                            </span>
                            {app.alumniComment && <span className="text-[10px] text-gray-500 mt-1 italic max-w-xs truncate">"{app.alumniComment}"</span>}
                        </div>
                      )}
                      {app.alumniRecommendation === AlumniRecommendation.NOT_RECOMMENDED && (
                         <div className="flex flex-col">
                             <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800 w-fit">
                                Not Recommended
                             </span>
                             {app.alumniComment && <span className="text-[10px] text-gray-500 mt-1 italic max-w-xs truncate">"{app.alumniComment}"</span>}
                         </div>
                      )}
                      {app.alumniRecommendation === AlumniRecommendation.NONE && (
                        <span className="text-xs text-gray-400">Pending Review</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                        <span className={`px-2 py-1 text-xs rounded-full font-bold ${
                            app.adminFinalStatus === ApplicationStatus.FINAL_SELECTED ? 'bg-green-100 text-green-700' :
                            app.adminFinalStatus === ApplicationStatus.FINAL_REJECTED ? 'bg-red-100 text-red-700' :
                            'bg-gray-100 text-gray-600'
                        }`}>
                            {app.adminFinalStatus.replace('FINAL_', '')}
                        </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                       <select 
                         className="text-sm border-gray-300 rounded-md shadow-sm focus:border-brand-500 focus:ring-brand-500 py-1.5 px-3 border bg-white"
                         value={app.adminFinalStatus}
                         onChange={(e) => handleFinalDecision(app.id, e.target.value as ApplicationStatus)}
                       >
                          <option value={ApplicationStatus.APPLIED}>Applied</option>
                          <option value={ApplicationStatus.SHORTLISTED}>Shortlisted</option>
                          <option value={ApplicationStatus.FINAL_SELECTED}>Select Candidate</option>
                          <option value={ApplicationStatus.FINAL_REJECTED}>Reject Candidate</option>
                       </select>
                    </td>
                  </tr>
                  {/* Expanded Row for Profile Details */}
                  {expandedAppId === app.id && expandedUser && (
                    <tr className="bg-gray-50/50">
                      <td colSpan={5} className="px-6 py-4 border-b border-gray-100">
                         <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-2">
                            <div className="space-y-2">
                               <h4 className="text-xs font-bold text-gray-500 uppercase">Education</h4>
                               {expandedUser.education?.length ? expandedUser.education.map(e => (
                                   <div key={e.id} className="text-sm">
                                      <p className="font-medium text-gray-800">{e.degree} in {e.major}</p>
                                      <p className="text-gray-500 text-xs">{e.institution}, {e.year}</p>
                                   </div>
                               )) : <p className="text-sm text-gray-400">No education listed</p>}
                            </div>
                            <div className="space-y-2">
                               <h4 className="text-xs font-bold text-gray-500 uppercase">Skills</h4>
                               <div className="flex flex-wrap gap-1">
                                  {expandedUser.skills?.length ? expandedUser.skills.map(s => (
                                    <span key={s} className="bg-white border border-gray-200 text-gray-600 px-2 py-0.5 rounded text-xs">{s}</span>
                                  )) : <p className="text-sm text-gray-400">No skills listed</p>}
                               </div>
                            </div>
                            <div className="space-y-2">
                               <h4 className="text-xs font-bold text-gray-500 uppercase">Past Projects</h4>
                               {expandedUser.projects?.length ? expandedUser.projects.map(p => (
                                   <div key={p.id} className="text-sm mb-2">
                                      <p className="font-medium text-gray-800">{p.title}</p>
                                      <p className="text-gray-600 text-xs">{p.description}</p>
                                   </div>
                               )) : <p className="text-sm text-gray-400">No projects listed</p>}
                               
                               {expandedUser.resumeLink && (
                                   <div className="pt-2">
                                      <a href={expandedUser.resumeLink} target="_blank" rel="noreferrer" className="text-brand-600 text-xs font-medium hover:underline flex items-center">
                                         <FileText size={12} className="mr-1" /> View Resume
                                      </a>
                                   </div>
                               )}
                            </div>
                         </div>
                      </td>
                    </tr>
                  )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
           <h1 className="text-2xl font-bold text-gray-900">Admin Portal</h1>
           <p className="text-gray-500 text-sm">Manage the entire placement ecosystem.</p>
        </div>
        
        <div className="flex space-x-1 bg-white p-1 rounded-xl border border-gray-200 shadow-sm w-fit overflow-x-auto">
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'users', label: 'Users', count: pendingUsers.length },
            { id: 'jobs', label: 'Jobs', count: pendingOpps.length },
            { id: 'events', label: 'Events', count: pendingEvents.length },
            { id: 'placements', label: 'Selection Board' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => { setActiveTab(tab.id as any); setSelectedOppForPlacement(null); }}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                activeTab === tab.id 
                  ? 'bg-brand-50 text-brand-700 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              {tab.label}
              {tab.count ? <span className="ml-2 bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">{tab.count}</span> : null}
            </button>
          ))}
        </div>
      </div>

      <div className="min-h-[500px]">
        {activeTab === 'overview' && <Overview />}
        {activeTab === 'users' && <UserApprovals />}
        {activeTab === 'jobs' && <ApprovalsList items={pendingOpps} type="job" />}
        {activeTab === 'events' && <ApprovalsList items={pendingEvents} type="event" />}
        {activeTab === 'placements' && <PlacementsBoard />}
      </div>
    </div>
  );
};

// Icons
const ArrowRightIcon = ({className}:{className?:string}) => <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
const ChevronLeftIcon = ({className}:{className?:string}) => <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>