import React, { useState, useEffect } from 'react';
import { User, Opportunity, Application, Event, AlumniRecommendation, ApprovalStatus } from '../types';
import { MockBackend } from '../services/mockBackend';
import { Briefcase, Calendar, Users, Plus, CheckCircle, UserCheck, ChevronDown, ChevronUp, MapPin, Clock, ArrowLeft } from 'lucide-react';

export const AlumniDashboard = ({ user }: { user: User }) => {
    const [view, setView] = useState<'create-job' | 'create-event' | 'manage'>('manage');
    const [myOpps, setMyOpps] = useState<Opportunity[]>([]);
    const [myEvents, setMyEvents] = useState<Event[]>([]);
    const [selectedOppId, setSelectedOppId] = useState<string | null>(null);
    const [applicants, setApplicants] = useState<Application[]>([]);
    const [expandedUser, setExpandedUser] = useState<User | null>(null);
    const [expandedAppId, setExpandedAppId] = useState<string | null>(null);
    
    // Job Form State
    const [jobForm, setJobForm] = useState({ title: '', desc: '', skills: '', location: '' });
    // Event Form State
    const [eventForm, setEventForm] = useState({ title: '', desc: '', date: '', location: '' });

    useEffect(() => {
        loadData();
    }, []);

    useEffect(() => {
        if (selectedOppId) loadApplicants(selectedOppId);
    }, [selectedOppId]);

    const loadData = () => {
        setMyOpps(MockBackend.getOpportunities(user.role, user.id));
        setMyEvents(MockBackend.getEvents(user.role, user.id));
    };

    const loadApplicants = (id: string) => {
        setApplicants(MockBackend.getApplications(id));
    };

    const handleCreateJob = async (e: React.FormEvent) => {
        e.preventDefault();
        await MockBackend.createOpportunity({
            createdBy: user.id,
            creatorName: user.name,
            type: 'JOB' as any,
            title: jobForm.title,
            description: jobForm.desc,
            company: user.company || 'Unknown',
            location: jobForm.location,
            requiredSkills: jobForm.skills.split(',').map(s => s.trim()),
            deadline: new Date(Date.now() + 86400000 * 30).toISOString().split('T')[0]
        });
        alert('Job Posted! Pending Admin Approval.');
        setJobForm({ title: '', desc: '', skills: '', location: '' });
        setView('manage');
        loadData();
    };

    const handleCreateEvent = async (e: React.FormEvent) => {
        e.preventDefault();
        await MockBackend.createEvent({
            title: eventForm.title,
            description: eventForm.desc,
            date: eventForm.date,
            location: eventForm.location,
            createdBy: user.id,
            creatorName: user.name
        });
        alert('Event Created! Pending Admin Approval.');
        setEventForm({ title: '', desc: '', date: '', location: '' });
        setView('manage');
        loadData();
    };

    const handleRecommend = async (appId: string, status: AlumniRecommendation) => {
        await MockBackend.recommendApplication(appId, status, "Reviewed by Alumni");
        if (selectedOppId) loadApplicants(selectedOppId);
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

    return (
        <div className="max-w-7xl mx-auto space-y-8 animate-fade-in">
            {/* Header Actions */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gray-200 pb-6">
                <div>
                   <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Alumni Hub</h1>
                   <p className="text-gray-500 mt-1">Manage your postings and review potential candidates.</p>
                </div>
                <div className="flex flex-wrap gap-3">
                   {view !== 'manage' && (
                        <button 
                            onClick={() => { setView('manage'); setSelectedOppId(null); }}
                            className="bg-white text-gray-700 px-4 py-2.5 rounded-xl hover:bg-gray-50 border border-gray-200 font-medium transition-colors flex items-center"
                        >
                            <ArrowLeft size={18} className="mr-2" /> Back to Dashboard
                        </button>
                   )}
                   {view === 'manage' && (
                       <>
                        <button 
                            onClick={() => setView('create-job')}
                            className="bg-brand-600 text-white px-5 py-2.5 rounded-xl hover:bg-brand-700 transition-all shadow-lg shadow-brand-500/20 flex items-center font-medium"
                        >
                            <Plus size={18} className="mr-2" /> Post Opportunity
                        </button>
                        <button 
                            onClick={() => setView('create-event')}
                            className="bg-white text-brand-700 border border-brand-200 px-5 py-2.5 rounded-xl hover:bg-brand-50 transition-colors flex items-center font-medium"
                        >
                            <Calendar size={18} className="mr-2" /> Host Event
                        </button>
                       </>
                   )}
                </div>
            </div>

            {view === 'create-job' && (
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 max-w-3xl mx-auto">
                    <h2 className="text-2xl font-bold mb-6 text-gray-900 border-b pb-4">Post a Job Opportunity</h2>
                    <form onSubmit={handleCreateJob} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Job Title</label>
                                <input required className="w-full border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all" value={jobForm.title} onChange={e => setJobForm({...jobForm, title: e.target.value})} placeholder="e.g. Senior Frontend Engineer" />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Location</label>
                                <input required className="w-full border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all" value={jobForm.location} onChange={e => setJobForm({...jobForm, location: e.target.value})} placeholder="e.g. New York (Remote)" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Required Skills (comma separated)</label>
                            <input required className="w-full border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all" value={jobForm.skills} onChange={e => setJobForm({...jobForm, skills: e.target.value})} placeholder="React, Node.js, AWS, System Design" />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Job Description</label>
                            <textarea required className="w-full border border-gray-300 p-3 rounded-xl h-40 focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all resize-none" value={jobForm.desc} onChange={e => setJobForm({...jobForm, desc: e.target.value})} placeholder="Describe the role, responsibilities, and what you are looking for..." />
                        </div>
                        <div className="pt-6 flex justify-end space-x-4">
                             <button type="button" onClick={() => setView('manage')} className="px-6 py-2.5 text-gray-600 hover:bg-gray-100 rounded-xl font-medium transition-colors">Cancel</button>
                             <button type="submit" className="bg-brand-600 text-white px-8 py-2.5 rounded-xl font-medium hover:bg-brand-700 shadow-lg shadow-brand-500/20 transition-all">Submit for Approval</button>
                        </div>
                    </form>
                </div>
            )}

            {view === 'create-event' && (
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 max-w-3xl mx-auto">
                    <h2 className="text-2xl font-bold mb-6 text-gray-900 border-b pb-4">Host an Event / Webinar</h2>
                    <form onSubmit={handleCreateEvent} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Event Title</label>
                                <input required className="w-full border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all" value={eventForm.title} onChange={e => setEventForm({...eventForm, title: e.target.value})} placeholder="e.g. Career Guidance Webinar" />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Date</label>
                                <input type="date" required className="w-full border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all" value={eventForm.date} onChange={e => setEventForm({...eventForm, date: e.target.value})} />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Location / Meeting Link</label>
                            <input required className="w-full border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all" value={eventForm.location} onChange={e => setEventForm({...eventForm, location: e.target.value})} placeholder="e.g. Zoom Link or Conference Hall A" />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                            <textarea required className="w-full border border-gray-300 p-3 rounded-xl h-40 focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all resize-none" value={eventForm.desc} onChange={e => setEventForm({...eventForm, desc: e.target.value})} placeholder="What is the event about?" />
                        </div>
                         <div className="pt-6 flex justify-end space-x-4">
                             <button type="button" onClick={() => setView('manage')} className="px-6 py-2.5 text-gray-600 hover:bg-gray-100 rounded-xl font-medium transition-colors">Cancel</button>
                             <button type="submit" className="bg-purple-600 text-white px-8 py-2.5 rounded-xl font-medium hover:bg-purple-700 shadow-lg shadow-purple-500/20 transition-all">Create Event</button>
                        </div>
                    </form>
                </div>
            )}

            {view === 'manage' && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* LEFT COLUMN: LISTS */}
                    <div className="lg:col-span-4 space-y-6">
                         {/* My Jobs */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                             <div className="p-5 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                                 <h3 className="font-bold text-gray-800 flex items-center"><Briefcase size={18} className="mr-2 text-brand-500"/> My Jobs</h3>
                                 <span className="text-xs bg-gray-200 px-2 py-1 rounded-full text-gray-600 font-medium">{myOpps.length}</span>
                             </div>
                             <div className="max-h-[300px] overflow-y-auto divide-y divide-gray-50">
                                {myOpps.map(opp => (
                                    <div 
                                        key={opp.id} 
                                        onClick={() => setSelectedOppId(opp.id)}
                                        className={`p-4 cursor-pointer transition-all border-l-4 ${selectedOppId === opp.id ? 'bg-brand-50/50 border-brand-500' : 'border-transparent hover:bg-gray-50'}`}
                                    >
                                        <div className="flex justify-between items-start mb-1">
                                            <h4 className={`font-semibold text-sm ${selectedOppId === opp.id ? 'text-brand-700' : 'text-gray-900'}`}>{opp.title}</h4>
                                            {opp.approvalStatus === 'APPROVED' ? 
                                                <CheckCircle size={14} className="text-green-500" /> : 
                                                <Clock size={14} className="text-orange-400" />
                                            }
                                        </div>
                                        <div className="flex justify-between items-center mt-1">
                                            <p className="text-xs text-gray-500">{new Date(opp.createdAt).toLocaleDateString()}</p>
                                            <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold uppercase ${opp.approvalStatus === 'APPROVED' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                                                {opp.approvalStatus}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                                {myOpps.length === 0 && (
                                    <div className="p-8 text-center text-gray-400">
                                        <Briefcase className="mx-auto h-8 w-8 mb-2 opacity-20" />
                                        <p className="text-sm">No jobs posted yet.</p>
                                    </div>
                                )}
                             </div>
                        </div>
                        
                         {/* My Events */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                             <div className="p-5 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                                 <h3 className="font-bold text-gray-800 flex items-center"><Calendar size={18} className="mr-2 text-purple-500"/> My Events</h3>
                                 <span className="text-xs bg-gray-200 px-2 py-1 rounded-full text-gray-600 font-medium">{myEvents.length}</span>
                             </div>
                             <div className="max-h-[300px] overflow-y-auto divide-y divide-gray-50">
                                {myEvents.map(evt => (
                                    <div key={evt.id} className="p-4 hover:bg-gray-50 transition-colors">
                                        <div className="flex justify-between items-start mb-1">
                                            <h4 className="font-semibold text-gray-900 text-sm">{evt.title}</h4>
                                            <span className={`text-[10px] px-1.5 py-0.5 rounded uppercase font-bold ${evt.approvalStatus === 'APPROVED' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                                {evt.approvalStatus}
                                            </span>
                                        </div>
                                        <div className="flex items-center text-xs text-gray-500 mt-2">
                                            <MapPin size={12} className="mr-1"/> <span className="truncate max-w-[150px]">{evt.location}</span>
                                        </div>
                                        <div className="mt-2 text-xs font-bold text-purple-600 flex items-center">
                                            <Users size={12} className="mr-1"/> {evt.registrations.length} Registrations
                                        </div>
                                    </div>
                                ))}
                                {myEvents.length === 0 && (
                                    <div className="p-8 text-center text-gray-400">
                                        <Calendar className="mx-auto h-8 w-8 mb-2 opacity-20" />
                                        <p className="text-sm">No events created.</p>
                                    </div>
                                )}
                             </div>
                        </div>
                    </div>
                    
                    {/* RIGHT COLUMN: DETAILS */}
                    <div className="lg:col-span-8">
                        {selectedOppId ? (
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden h-full flex flex-col min-h-[500px]">
                                <div className="p-6 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                                    <div>
                                        <h3 className="font-bold text-lg text-gray-800">Applicants</h3>
                                        <p className="text-sm text-gray-500">For: <span className="font-semibold text-brand-600">{myOpps.find(o => o.id === selectedOppId)?.title}</span></p>
                                    </div>
                                    <span className="bg-white border border-gray-200 px-3 py-1 rounded-full text-sm font-medium text-gray-600">{applicants.length} Candidates</span>
                                </div>
                                <div className="overflow-x-auto flex-1">
                                    <table className="w-full text-left">
                                        <thead className="text-xs text-gray-500 bg-white border-b border-gray-100 uppercase tracking-wider">
                                            <tr>
                                                <th className="px-6 py-4 font-semibold">Student</th>
                                                <th className="px-6 py-4 font-semibold">Status</th>
                                                <th className="px-6 py-4 font-semibold">Details</th>
                                                <th className="px-6 py-4 font-semibold text-right">Recommendation</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-50">
                                            {applicants.map(app => (
                                                <React.Fragment key={app.id}>
                                                <tr className="hover:bg-gray-50 transition-colors group">
                                                    <td className="px-6 py-4">
                                                        <div className="font-bold text-gray-900">{app.studentName}</div>
                                                        <div className="text-xs text-gray-500">{app.studentDepartment}</div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className={`text-[11px] px-2.5 py-1 rounded-full font-bold tracking-wide ${
                                                            app.adminFinalStatus === 'FINAL_SELECTED' ? 'bg-green-100 text-green-700' :
                                                            app.adminFinalStatus === 'FINAL_REJECTED' ? 'bg-red-100 text-red-700' :
                                                            'bg-gray-100 text-gray-600'
                                                        }`}>
                                                            {app.adminFinalStatus.replace('FINAL_', '')}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                       <button 
                                                        onClick={() => toggleExpandUser(app.id, app.studentId)}
                                                        className="text-xs bg-white border border-gray-200 text-gray-700 hover:border-brand-300 hover:text-brand-600 px-3 py-1.5 rounded-lg font-medium flex items-center transition-all shadow-sm"
                                                       >
                                                         {expandedAppId === app.id ? 'Hide Profile' : 'View Profile'}
                                                         {expandedAppId === app.id ? <ChevronUp size={12} className="ml-1"/> : <ChevronDown size={12} className="ml-1"/>}
                                                       </button>
                                                    </td>
                                                    <td className="px-6 py-4 text-right">
                                                        <div className="flex justify-end space-x-2">
                                                            <button 
                                                                onClick={() => handleRecommend(app.id, AlumniRecommendation.RECOMMENDED)}
                                                                className={`p-2 rounded-lg transition-all ${app.alumniRecommendation === 'RECOMMENDED' ? 'bg-green-600 text-white shadow-md ring-2 ring-green-200' : 'bg-gray-100 text-gray-400 hover:text-green-600 hover:bg-green-50'}`}
                                                                title="Recommend"
                                                            >
                                                                <CheckCircle size={18} />
                                                            </button>
                                                            <button 
                                                                onClick={() => handleRecommend(app.id, AlumniRecommendation.NOT_RECOMMENDED)}
                                                                className={`p-2 rounded-lg transition-all ${app.alumniRecommendation === 'NOT_RECOMMENDED' ? 'bg-red-600 text-white shadow-md ring-2 ring-red-200' : 'bg-gray-100 text-gray-400 hover:text-red-600 hover:bg-red-50'}`}
                                                                title="Do Not Recommend"
                                                            >
                                                                <UserCheck size={18} />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                                {expandedAppId === app.id && expandedUser && (
                                                    <tr className="bg-gray-50/50">
                                                        <td colSpan={4} className="px-6 py-6 border-b border-gray-100">
                                                            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                                                                    <div>
                                                                        <p className="font-bold text-gray-500 uppercase text-xs mb-2 tracking-wider">Skills & Tech Stack</p>
                                                                        <div className="flex flex-wrap gap-1.5">
                                                                            {expandedUser.skills?.map(s => <span key={s} className="bg-brand-50 text-brand-700 border border-brand-100 px-2 py-0.5 rounded-md text-xs font-medium">{s}</span>) || <span className="text-gray-400 italic">None listed</span>}
                                                                        </div>
                                                                    </div>
                                                                    <div>
                                                                        <p className="font-bold text-gray-500 uppercase text-xs mb-2 tracking-wider">Key Projects</p>
                                                                        {expandedUser.projects?.length ? expandedUser.projects.map(p => (
                                                                            <div key={p.id} className="mb-2 last:mb-0">
                                                                                <div className="font-semibold text-gray-900">{p.title}</div>
                                                                                <div className="text-gray-600 text-xs mt-0.5">{p.description}</div>
                                                                            </div>
                                                                        )) : <span className="text-gray-400 italic">None listed</span>}
                                                                    </div>
                                                                </div>
                                                                {expandedUser.resumeLink && (
                                                                    <div className="mt-4 pt-3 border-t border-gray-100">
                                                                        <a href={expandedUser.resumeLink} target="_blank" rel="noreferrer" className="text-brand-600 hover:text-brand-800 text-sm font-medium flex items-center w-fit">
                                                                            <Briefcase size={14} className="mr-1.5" /> View Resume
                                                                        </a>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </td>
                                                    </tr>
                                                )}
                                                </React.Fragment>
                                            ))}
                                            {applicants.length === 0 && (
                                                <tr>
                                                    <td colSpan={4} className="p-16 text-center text-gray-400">
                                                        <Users className="mx-auto h-10 w-10 mb-3 opacity-20" />
                                                        <p className="text-base font-medium">No applicants yet</p>
                                                        <p className="text-xs mt-1">Check back later once students start applying.</p>
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        ) : (
                            <div className="h-full min-h-[500px] flex flex-col items-center justify-center text-gray-400 border-2 border-dashed border-gray-200 rounded-2xl bg-gray-50/30">
                                <div className="bg-white p-4 rounded-full shadow-sm mb-4">
                                    <Briefcase size={32} className="text-gray-300" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-600">No Job Selected</h3>
                                <p className="text-sm max-w-xs text-center mt-2">Select a job from the list on the left to view and manage its applicants.</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};