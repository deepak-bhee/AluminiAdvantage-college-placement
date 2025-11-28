import React, { useState, useEffect } from 'react';
import { User, UserRole, Notification } from '../types';
import { MockBackend } from '../services/mockBackend';
import { LogOut, LayoutDashboard, Briefcase, Users, Calendar, Award, UserCircle, Menu, X, Bell, Check } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  user: User | null;
  onLogout: () => void;
  currentPage: string;
  setPage: (page: string) => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, user, onLogout, currentPage, setPage }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // Poll for notifications
  useEffect(() => {
    if (!user) return;
    const fetchNotifs = () => {
      const notifs = MockBackend.getNotifications(user.id);
      setNotifications(notifs);
      setUnreadCount(notifs.filter(n => !n.read).length);
    };
    fetchNotifs();
    const interval = setInterval(fetchNotifs, 5000);
    return () => clearInterval(interval);
  }, [user]);

  const handleRead = (id: string) => {
    MockBackend.markNotificationRead(id);
    const notifs = MockBackend.getNotifications(user?.id || '');
    setNotifications(notifs);
    setUnreadCount(notifs.filter(n => !n.read).length);
  };

  if (!user) return <>{children}</>;

  const NavItem = ({ page, icon: Icon, label }: { page: string, icon: any, label: string }) => (
    <button
      onClick={() => {
        setPage(page);
        setIsMobileMenuOpen(false);
      }}
      className={`flex items-center space-x-3 w-full px-4 py-3 text-sm font-medium transition-all duration-200 rounded-lg group ${
        currentPage === page 
          ? 'bg-brand-50 text-brand-700 shadow-sm border border-brand-100' 
          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 border border-transparent'
      }`}
    >
      <Icon size={20} className={`${currentPage === page ? 'text-brand-600' : 'text-gray-400 group-hover:text-gray-600'}`} />
      <span>{label}</span>
    </button>
  );

  return (
    <div className="flex min-h-screen bg-gray-50/50 font-sans">
      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-md h-16 flex items-center justify-between px-4 z-40 shadow-sm border-b border-gray-200">
        <div className="flex items-center space-x-2 text-brand-600">
           <Award className="h-6 w-6" />
           <span className="text-lg font-bold text-gray-900">Alumni Advantage</span>
        </div>
        <div className="flex items-center space-x-4">
             <div className="relative">
                <button onClick={() => setIsNotifOpen(!isNotifOpen)} className="text-gray-600 p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <Bell size={24} />
                    {unreadCount > 0 && <span className="absolute top-1.5 right-1.5 block h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-white" />}
                </button>
             </div>
             <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-gray-600 p-2 hover:bg-gray-100 rounded-full transition-colors">
               {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
        </div>
      </div>

      {/* Sidebar Overlay (Mobile) */}
      {isMobileMenuOpen && (
        <div 
            className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-30 md:hidden transition-opacity"
            onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 w-64 bg-white border-r border-gray-200 z-40 transform transition-transform duration-300 cubic-bezier(0.4, 0, 0.2, 1) md:translate-x-0 ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
      } md:block shadow-xl md:shadow-none pt-16 md:pt-0`}>
        
        <div className="hidden md:flex items-center justify-center h-16 border-b border-gray-100 bg-white">
           <div className="flex items-center space-x-2 text-brand-600">
             <Award className="h-7 w-7" />
             <span className="text-xl font-bold text-gray-900 tracking-tight">Alumni Advantage</span>
           </div>
        </div>
        
        <div className="flex flex-col h-[calc(100%-4rem)] justify-between">
          <div className="p-4 space-y-1 overflow-y-auto">
             <p className="px-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-3 mt-2">Main Menu</p>
             <NavItem page="dashboard" icon={LayoutDashboard} label="Dashboard" />
             
             {user.role === UserRole.STUDENT && (
               <>
                 <NavItem page="profile" icon={UserCircle} label="My Profile" />
                 <NavItem page="jobs" icon={Briefcase} label="Opportunities" />
                 <NavItem page="applications" icon={Users} label="My Applications" />
               </>
             )}

             {user.role === UserRole.ALUMNI && (
               <>
                 <NavItem page="profile" icon={UserCircle} label="My Profile" />
                 <NavItem page="my-postings" icon={Briefcase} label="My Postings" />
                 <NavItem page="events" icon={Calendar} label="My Events" />
               </>
             )}

             {user.role === UserRole.ADMIN && (
               <>
                 <NavItem page="approvals" icon={Users} label="User Approvals" />
                 <NavItem page="job-approvals" icon={Briefcase} label="Approvals" />
                 <NavItem page="placements" icon={Award} label="Placements" />
               </>
             )}
          </div>

          <div className="p-4 border-t border-gray-100 bg-gray-50/50">
             <div className="flex items-center p-3 bg-white border border-gray-200 rounded-lg mb-3 shadow-sm">
                <div className="h-10 w-10 rounded-full bg-brand-100 flex items-center justify-center text-brand-600 font-bold uppercase shrink-0 border border-brand-200">
                    {user.name.charAt(0)}
                </div>
                <div className="ml-3 overflow-hidden">
                    <p className="text-sm font-semibold text-gray-900 truncate">{user.name}</p>
                    <p className="text-xs text-gray-500 capitalize">{user.role.toLowerCase()}</p>
                </div>
             </div>
             <button
               onClick={onLogout}
               className="flex items-center space-x-3 w-full px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-100"
             >
               <LogOut size={20} />
               <span>Sign Out</span>
             </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 relative min-h-screen flex flex-col">
        {/* Desktop Header */}
        <header className="hidden md:flex h-16 bg-white/80 backdrop-blur-md border-b border-gray-200 items-center justify-between px-8 sticky top-0 z-30 transition-all">
            <h2 className="text-xl font-bold text-gray-800 capitalize tracking-tight">
                {currentPage.replace('-', ' ')}
            </h2>
            <div className="flex items-center space-x-6">
                <div className="relative">
                    <button 
                        onClick={() => setIsNotifOpen(!isNotifOpen)} 
                        className="p-2 text-gray-500 hover:bg-gray-100 rounded-full relative transition-colors focus:ring-2 focus:ring-brand-100 outline-none"
                    >
                        <Bell size={20} />
                        {unreadCount > 0 && <span className="absolute top-1.5 right-1.5 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />}
                    </button>
                    
                    {/* Notification Dropdown */}
                    {isNotifOpen && (
                        <div className="absolute right-0 mt-3 w-96 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden z-50 animate-fade-in origin-top-right">
                            <div className="p-4 border-b border-gray-50 flex justify-between items-center bg-gray-50/80">
                                <h3 className="font-semibold text-gray-700">Notifications</h3>
                                <span className="text-xs bg-white border border-gray-200 px-2 py-0.5 rounded-full text-gray-600 font-medium">{unreadCount} new</span>
                            </div>
                            <div className="max-h-[28rem] overflow-y-auto">
                                {notifications.length === 0 ? (
                                    <div className="p-12 text-center flex flex-col items-center justify-center text-gray-400">
                                        <Bell className="h-8 w-8 mb-2 opacity-20" />
                                        <p className="text-sm">No notifications yet</p>
                                    </div>
                                ) : (
                                    notifications.map(notif => (
                                        <div 
                                            key={notif.id} 
                                            onClick={() => handleRead(notif.id)}
                                            className={`p-4 border-b border-gray-50 cursor-pointer hover:bg-gray-50 transition-colors ${!notif.read ? 'bg-blue-50/30' : ''}`}
                                        >
                                            <div className="flex justify-between items-start mb-1.5">
                                                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider ${
                                                    notif.type === 'SUCCESS' ? 'bg-green-100 text-green-700' : 
                                                    notif.type === 'WARNING' ? 'bg-orange-100 text-orange-700' :
                                                    notif.type === 'ERROR' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                                                }`}>{notif.type}</span>
                                                <span className="text-[10px] text-gray-400">{new Date(notif.date).toLocaleDateString()}</span>
                                            </div>
                                            <p className={`text-sm leading-relaxed ${!notif.read ? 'text-gray-900 font-medium' : 'text-gray-600'}`}>{notif.message}</p>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </header>

        <div className="p-4 md:p-8 flex-1 overflow-y-auto mt-16 md:mt-0">
            {children}
        </div>
      </main>
    </div>
  );
};