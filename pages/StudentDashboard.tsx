import React, { useState, useEffect } from 'react';
import { User, Opportunity, Application, Event } from '../types';
import { MockBackend } from '../services/mockBackend';
import { Briefcase, Building, MapPin, Clock, Search, Filter, Calendar, Check, ArrowRight, User as UserIcon, ExternalLink } from 'lucide-react';

export const StudentDashboard = ({ user }: { user: User }) => {
    const [view, setView] = useState<'jobs' | 'events' | 'applications'>('jobs');
    const [opps, setOpps] = useState<Opportunity[]>([]);
    const [events, setEvents] = useState<Event[]>([]);
    const [myApps, setMyApps] = useState<Application[]>([]);
    
    // Search State
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('ALL');

    useEffect(() => {
        loadData();
    }, [view]);

    const loadData = () => {
        setOpps(MockBackend.getOpportunities(user.role));
        setEvents(MockBackend.getEvents(user.role));
        setMyApps(MockBackend.getApplications(undefined, user.id));
    };

    const handleApply = async (oppId: string) => {
        try {
            await MockBackend.apply({ opportunityId: oppId, studentId: user.id, studentName: user.name, studentDepartment: user.department || 'N/A' });
            loadData();
            alert('Application Submitted Successfully!');
        } catch (e: any) {
            alert(e.message);
        }
    };

    const handleRegisterEvent = async (eventId: string) => {
        try {
            await MockBackend.registerForEvent(eventId, user.id);
            loadData();
            alert('Registered for event!');
        } catch (e: any) {
            alert(e.message);
        }
    };

    const isApplied = (oppId: string) => myApps.some(a => a.opportunityId === oppId);

    const filteredOpps = opps.filter(opp => {
        const matchesSearch = opp.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                              opp.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                              opp.requiredSkills.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()));
        const matchesType = filterType === 'ALL' || opp.type === filterType;
        return matchesSearch && matchesType;
    });

    return (
      <div className="max-w-6xl mx-auto space-y-8 animate-fade-in pb-12">
          {/* Dashboard Header */}
          <div className="flex flex-col md:flex-row justify-between items-end gap-4">
             <div>
                <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Student Portal</h1>
                <p className="text-gray-500 mt-1">Browse opportunities, attend events, and shape your future.</p>
             </div>
             
             {/* Navigation Tabs */}
             <div className="bg-white p-1.5 rounded-xl shadow-sm border border-gray-200 flex space-x-1">
                {[
                  { id: 'jobs', label: 'Opportunities', icon: Briefcase },
                  { id: 'events', label: 'Events', icon: Calendar },
                  { id: 'applications', label: 'My Applications', icon: UserIcon }
                ].map(tab => (
                    <button 
                      key={tab.id}
                      onClick={() => setView(tab.id as any)}
                      className={`flex items-center space-x-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${
                          view === tab.id 
                          ? 'bg-brand-600 text-white shadow-md' 
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                    >
                        <tab.icon size={16} />
                        <span>{tab.label}</span>
                    </button>
                ))}
             </div>
          </div>

          {view === 'jobs' && (
              <div className="space-y-6">
                  {/* Search Bar */}
                  <div className="bg-white p-2 rounded-2xl shadow-sm border border-gray-200 flex flex-col md:flex-row gap-2">
                      <div className="flex-1 relative">
                          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                          <input 
                            type="text" 
                            placeholder="Search by role, company, or skill..." 
                            className="w-full pl-12 pr-4 py-3.5 border-none rounded-xl focus:ring-0 text-gray-700 placeholder-gray-400 bg-transparent"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                          />
                      </div>
                      <div className="h-10 w-[1px] bg-gray-200 hidden md:block self-center"></div>
                      <select 
                        className="px-6 py-3.5 border-none rounded-xl focus:ring-0 bg-transparent text-gray-700 font-medium cursor-pointer"
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value)}
                      >
                          <option value="ALL">All Types</option>
                          <option value="JOB">Full-time Jobs</option>
                          <option value="MENTORSHIP">Mentorships</option>
                      </select>
                  </div>

                  {/* Job List */}
                  <div className="grid grid-cols-1 gap-5">
                      {filteredOpps.map(opp => (
                          <div key={opp.id} className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 group relative overflow-hidden">
                              <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                                  <Briefcase size={80} />
                              </div>
                              
                              <div className="flex flex-col md:flex-row justify-between items-start gap-4 relative z-10">
                                  <div className="flex-1">
                                      <div className="flex items-center gap-3 mb-2">
                                        <h3 className="text-xl font-bold text-gray-900 group-hover:text-brand-600 transition-colors">{opp.title}</h3>
                                        <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider ${opp.type === 'JOB' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'}`}>{opp.type}</span>
                                      </div>
                                      
                                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-4">
                                          <span className="flex items-center font-medium text-gray-700"><Building size={16} className="mr-1.5 text-gray-400"/> {opp.company}</span>
                                          <span className="flex items-center"><MapPin size={16} className="mr-1.5 text-gray-400"/> {opp.location}</span>
                                          <span className="flex items-center"><Clock size={16} className="mr-1.5 text-gray-400"/> Deadline: {new Date(opp.deadline).toLocaleDateString()}</span>
                                      </div>

                                      <p className="text-gray-600 text-sm leading-relaxed mb-5 max-w-3xl">{opp.description}</p>
                                      
                                      <div className="flex flex-wrap gap-2">
                                          {opp.requiredSkills.map((skill: string) => (
                                              <span key={skill} className="bg-gray-50 text-gray-600 text-xs font-medium px-2.5 py-1 rounded-md border border-gray-100 group-hover:border-gray-200 transition-colors">{skill}</span>
                                          ))}
                                      </div>
                                  </div>
                                  
                                  <div className="flex flex-col items-end gap-3 min-w-[140px]">
                                      {isApplied(opp.id) ? (
                                          <div className="flex flex-col items-center w-full">
                                              <span className="flex items-center justify-center w-full bg-green-50 text-green-700 border border-green-100 px-4 py-2.5 rounded-xl text-sm font-bold">
                                                  <Check size={18} className="mr-2" /> Applied
                                              </span>
                                              <span className="text-xs text-green-600 mt-1.5 font-medium">Good luck!</span>
                                          </div>
                                      ) : (
                                          <button onClick={() => handleApply(opp.id)} className="w-full bg-brand-600 text-white px-6 py-2.5 rounded-xl hover:bg-brand-700 transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 font-semibold flex items-center justify-center group-hover:ring-4 ring-brand-50">
                                              Apply Now <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
                                          </button>
                                      )}
                                      <div className="text-xs text-gray-400 text-right w-full">Posted by {opp.creatorName}</div>
                                  </div>
                              </div>
                          </div>
                      ))}
                      {filteredOpps.length === 0 && (
                          <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-200 text-gray-500">
                              <Search size={48} className="mx-auto text-gray-200 mb-4" />
                              <p className="text-lg font-medium text-gray-900">No opportunities found</p>
                              <p className="text-sm">Try adjusting your search criteria.</p>
                          </div>
                      )}
                  </div>
              </div>
          )}

          {view === 'events' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {events.map(evt => {
                      const isRegistered = evt.registrations.includes(user.id);
                      return (
                        <div key={evt.id} className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col group h-full">
                            <div className="h-40 bg-gradient-to-br from-brand-600 to-purple-700 p-6 flex flex-col justify-between text-white relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-4 opacity-10 transform translate-x-4 -translate-y-4">
                                    <Calendar size={120} />
                                </div>
                                <div className="relative z-10">
                                    <span className="inline-block bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold mb-2">Webinar</span>
                                    <h3 className="text-2xl font-bold leading-tight">{evt.title}</h3>
                                </div>
                                <div className="relative z-10 flex items-center text-sm font-medium bg-black/20 w-fit px-3 py-1 rounded-lg backdrop-blur-sm">
                                    <Calendar size={14} className="mr-2"/> {new Date(evt.date).toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}
                                </div>
                            </div>
                            <div className="p-6 flex-1 flex flex-col">
                                <p className="text-gray-600 text-sm mb-6 flex-1 leading-relaxed">{evt.description}</p>
                                <div className="flex items-center text-sm text-gray-500 mb-6 bg-gray-50 p-3 rounded-lg">
                                    <MapPin size={16} className="mr-2 text-brand-600"/> 
                                    <span className="font-medium text-gray-900">{evt.location}</span>
                                </div>
                                <button 
                                    onClick={() => !isRegistered && handleRegisterEvent(evt.id)}
                                    disabled={isRegistered}
                                    className={`w-full py-3.5 rounded-xl font-bold transition-all flex justify-center items-center ${
                                        isRegistered 
                                        ? 'bg-green-50 text-green-700 border border-green-200 cursor-default' 
                                        : 'bg-gray-900 text-white hover:bg-black shadow-lg shadow-gray-200 hover:-translate-y-1'
                                    }`}
                                >
                                    {isRegistered ? <><Check size={18} className="mr-2"/> Registration Confirmed</> : 'Register Now'}
                                </button>
                            </div>
                        </div>
                      );
                  })}
                  {events.length === 0 && (
                      <div className="col-span-2 text-center py-20 bg-white rounded-2xl border border-dashed border-gray-200 text-gray-500">
                          <Calendar size={48} className="mx-auto text-gray-200 mb-4" />
                          <p className="text-lg font-medium text-gray-900">No upcoming events</p>
                          <p className="text-sm">Check back later for new workshops and webinars.</p>
                      </div>
                  )}
              </div>
          )}

          {view === 'applications' && (
              <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-200">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b border-gray-200 text-gray-500 text-xs uppercase tracking-wider">
                            <tr>
                                <th className="px-8 py-5 font-semibold">Job Title & Company</th>
                                <th className="px-8 py-5 font-semibold">Application Status</th>
                                <th className="px-8 py-5 font-semibold">Timeline</th>
                                <th className="px-8 py-5 font-semibold text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {myApps.map(app => {
                                const job = opps.find(o => o.id === app.opportunityId);
                                return (
                                    <tr key={app.id} className="hover:bg-gray-50 transition-colors group">
                                        <td className="px-8 py-5">
                                            <div className="font-bold text-gray-900 text-base">{job?.title || 'Unknown Job'}</div>
                                            <div className="text-sm text-gray-500 flex items-center mt-1"><Building size={12} className="mr-1"/> {job?.company}</div>
                                        </td>
                                        <td className="px-8 py-5">
                                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold tracking-wide border ${
                                                app.adminFinalStatus === 'FINAL_SELECTED' ? 'bg-green-50 text-green-700 border-green-200' :
                                                app.adminFinalStatus === 'FINAL_REJECTED' ? 'bg-red-50 text-red-700 border-red-200' :
                                                app.adminFinalStatus === 'SHORTLISTED' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                                                'bg-blue-50 text-blue-700 border-blue-200'
                                            }`}>
                                                <span className={`w-1.5 h-1.5 rounded-full mr-2 ${
                                                    app.adminFinalStatus === 'FINAL_SELECTED' ? 'bg-green-500' :
                                                    app.adminFinalStatus === 'FINAL_REJECTED' ? 'bg-red-500' :
                                                    app.adminFinalStatus === 'SHORTLISTED' ? 'bg-yellow-500' :
                                                    'bg-blue-500'
                                                }`}></span>
                                                {app.adminFinalStatus.replace('FINAL_', '')}
                                            </span>
                                        </td>
                                        <td className="px-8 py-5">
                                            <div className="text-sm text-gray-900 font-medium">Applied on</div>
                                            <div className="text-xs text-gray-500">{new Date(app.appliedAt).toLocaleDateString()}</div>
                                        </td>
                                        <td className="px-8 py-5 text-right">
                                            <button className="text-brand-600 hover:text-brand-800 text-sm font-medium hover:underline flex items-center justify-end w-full group-hover:translate-x-1 transition-transform">
                                                View Details <ArrowRight size={14} className="ml-1"/>
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                            {myApps.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="px-6 py-24 text-center text-gray-400">
                                        <Briefcase className="mx-auto h-12 w-12 mb-3 opacity-20" />
                                        <p className="text-lg font-medium text-gray-900">No applications yet</p>
                                        <p className="text-sm">Start exploring jobs and apply to your dream roles!</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                  </div>
              </div>
          )}
      </div>
    );
};