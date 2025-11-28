import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { User, UserRole } from './types';
import { MockBackend } from './services/mockBackend';
import { AdminDashboard } from './pages/AdminDashboard';
import { AlumniDashboard } from './pages/AlumniDashboard';
import { StudentDashboard } from './pages/StudentDashboard';
import { LandingPage } from './pages/LandingPage';
import { ProfilePage } from './pages/ProfilePage';
import { GraduationCap, ArrowLeft, Loader2 } from 'lucide-react';

// --- AUTH COMPONENT ---
const AuthPage = ({ 
  onLogin, 
  initialMode = 'login', 
  onBack 
}: { 
  onLogin: (user: User) => void, 
  initialMode?: 'login'|'register', 
  onBack: () => void 
}) => {
  const [isRegistering, setIsRegistering] = useState(initialMode === 'register');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<UserRole>(UserRole.STUDENT);
  const [dept, setDept] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (isRegistering) {
        // Registration Flow
        const newUser = await MockBackend.register({
          name, 
          email, 
          role, 
          department: role !== UserRole.ALUMNI ? dept : undefined,
          company: role === UserRole.ALUMNI ? dept : undefined
        });
        onLogin(newUser);
      } else {
        // Login Flow
        const user = await MockBackend.login(email);
        if (user) {
            onLogin(user);
        } else {
          setError('Invalid credentials or account pending approval.');
        }
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4 animate-fade-in">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 relative">
        <button 
          onClick={onBack} 
          className="absolute top-6 left-6 text-gray-400 hover:text-gray-600 font-medium text-sm flex items-center transition-colors"
        >
          <ArrowLeft size={16} className="mr-1" /> Back
        </button>
        
        <div className="text-center mb-8 mt-4">
          <div className="mx-auto h-14 w-14 bg-brand-600 rounded-xl flex items-center justify-center text-white mb-4 shadow-lg shadow-brand-500/30">
             <GraduationCap size={32} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">{isRegistering ? 'Join the Network' : 'Welcome Back'}</h2>
          <p className="text-gray-500 text-sm mt-2">Alumni Advantage Placement Portal</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-700 text-sm rounded-xl border border-red-100 flex items-center">
            <span className="mr-2">⚠️</span>{error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegistering && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
                <input required type="text" className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all" value={name} onChange={e => setName(e.target.value)} placeholder="John Doe" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Role</label>
                <select className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all bg-white" value={role} onChange={e => setRole(e.target.value as UserRole)}>
                    <option value={UserRole.STUDENT}>Student</option>
                    <option value={UserRole.ALUMNI}>Alumni</option>
                    <option value={UserRole.ADMIN}>Admin</option>
                </select>
              </div>
              <div>
                 <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    {role === UserRole.ALUMNI ? 'Current Company' : 'Department'}
                 </label>
                 <input required type="text" className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all" value={dept} onChange={e => setDept(e.target.value)} placeholder={role === UserRole.ALUMNI ? "Google" : "Computer Science"} />
              </div>
            </>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
            <input required type="email" className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
            <input required type="password" className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" />
          </div>

          <button 
            disabled={loading} 
            type="submit" 
            className="w-full bg-brand-600 text-white py-3 rounded-xl font-bold hover:bg-brand-700 transition-all shadow-lg shadow-brand-500/30 disabled:opacity-70 disabled:cursor-not-allowed mt-4 flex items-center justify-center"
          >
            {loading ? <Loader2 className="animate-spin mr-2" size={20} /> : null}
            {loading ? 'Processing...' : (isRegistering ? 'Create Account' : 'Sign In')}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-gray-100 text-center">
          <p className="text-sm text-gray-500 mb-2">{isRegistering ? 'Already have an account?' : 'New to Alumni Advantage?'}</p>
          <button onClick={() => { setIsRegistering(!isRegistering); setError(''); }} className="text-sm text-brand-600 hover:text-brand-800 font-bold transition-colors">
            {isRegistering ? 'Sign In' : 'Create an Account'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [viewState, setViewState] = useState<'landing' | 'auth' | 'app'>('landing');
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [isInitializing, setIsInitializing] = useState(true);

  // --- PERSISTENCE LOGIC ---
  useEffect(() => {
    const initSession = async () => {
      try {
        const sessionId = localStorage.getItem('aa_session_id');
        if (sessionId) {
          // In a real app, this would be an API call to /me
          const restoredUser = MockBackend.getUserById(sessionId);
          
          if (restoredUser && restoredUser.status === 'APPROVED') {
            setUser(restoredUser);
            setViewState('app');
          } else {
            // Session invalid or user not approved
            localStorage.removeItem('aa_session_id');
          }
        }
      } catch (error) {
        console.error("Session restoration failed", error);
        localStorage.removeItem('aa_session_id');
      } finally {
        setIsInitializing(false);
      }
    };
    
    initSession();
  }, []);

  const handleLoginSuccess = (user: User) => {
      localStorage.setItem('aa_session_id', user.id);
      setUser(user);
      setViewState('app');
      setCurrentPage('dashboard');
  };

  const handleLogout = () => {
    localStorage.removeItem('aa_session_id');
    setUser(null);
    setViewState('landing');
    setCurrentPage('dashboard');
  };

  // --- RENDER ROUTER ---
  const renderPage = () => {
    if (!user) return null;

    if (currentPage === 'profile') {
        return <ProfilePage user={user} onUpdateUser={(u) => { setUser(u); }} />;
    }

    switch(user.role) {
        case UserRole.ADMIN:
            return <AdminDashboard />;
        case UserRole.ALUMNI:
            return <AlumniDashboard user={user} />;
        case UserRole.STUDENT:
            return <StudentDashboard user={user} />;
        default:
            return <div className="p-8 text-center text-red-500">Error: Unknown User Role</div>;
    }
  };

  // --- MAIN RENDER ---
  if (isInitializing) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white">
        <Loader2 className="h-10 w-10 text-brand-600 animate-spin mb-4" />
        <p className="text-gray-500 font-medium">Loading Alumni Advantage...</p>
      </div>
    );
  }

  if (viewState === 'landing') {
      return (
        <LandingPage 
            onLoginClick={() => { setAuthMode('login'); setViewState('auth'); }} 
            onRegisterClick={() => { setAuthMode('register'); setViewState('auth'); }} 
        />
      );
  }

  if (viewState === 'auth') {
      return (
        <AuthPage 
          onLogin={handleLoginSuccess} 
          initialMode={authMode} 
          onBack={() => setViewState('landing')} 
        />
      );
  }

  return (
    <Layout user={user} onLogout={handleLogout} currentPage={currentPage} setPage={setCurrentPage}>
       {renderPage()}
    </Layout>
  );
}