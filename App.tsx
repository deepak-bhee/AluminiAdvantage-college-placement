import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { User, UserRole } from './types';
import { MockBackend } from './services/mockBackend';
import { AdminDashboard } from './pages/AdminDashboard';
import { AlumniDashboard } from './pages/AlumniDashboard';
import { StudentDashboard } from './pages/StudentDashboard';
import { LandingPage } from './pages/LandingPage';
import { ProfilePage } from './pages/ProfilePage';
import { GraduationCap } from 'lucide-react';

// --- AUTH COMPONENT ---
const AuthPage = ({ onLogin, initialMode = 'login', onBack }: { onLogin: (user: User) => void, initialMode?: 'login'|'register', onBack: () => void }) => {
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
        const newUser = await MockBackend.register({
          name, email, role, 
          department: role !== UserRole.ALUMNI ? dept : undefined,
          company: role === UserRole.ALUMNI ? dept : undefined
        });
        onLogin(newUser);
      } else {
        const user = await MockBackend.login(email);
        if (user) {
            onLogin(user);
        } else {
          setError('Invalid credentials or account pending approval.');
        }
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 relative animate-fade-in-up">
        <button onClick={onBack} className="absolute top-4 left-4 text-gray-400 hover:text-gray-600 font-medium text-sm">← Back</button>
        <div className="text-center mb-8">
          <div className="mx-auto h-12 w-12 bg-brand-600 rounded-lg flex items-center justify-center text-white mb-4 shadow-lg shadow-brand-500/30">
             <GraduationCap size={28} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">{isRegistering ? 'Join the Network' : 'Welcome Back'}</h2>
          <p className="text-gray-500 text-sm mt-2">Alumni Advantage Placement Portal</p>
        </div>

        {error && <div className="mb-4 p-3 bg-red-50 text-red-700 text-sm rounded-lg border border-red-100 flex items-center"><span className="mr-2">⚠️</span>{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegistering && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input required type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all" value={name} onChange={e => setName(e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all" value={role} onChange={e => setRole(e.target.value as UserRole)}>
                    <option value={UserRole.STUDENT}>Student</option>
                    <option value={UserRole.ALUMNI}>Alumni</option>
                    <option value={UserRole.ADMIN}>Admin</option>
                </select>
              </div>
              <div>
                 <label className="block text-sm font-medium text-gray-700 mb-1">
                    {role === UserRole.ALUMNI ? 'Current Company' : 'Department'}
                 </label>
                 <input required type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all" value={dept} onChange={e => setDept(e.target.value)} />
              </div>
            </>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <input required type="email" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all" value={email} onChange={e => setEmail(e.target.value)} />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input required type="password" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all" value={password} onChange={e => setPassword(e.target.value)} />
          </div>

          <button disabled={loading} type="submit" className="w-full bg-brand-600 text-white py-2.5 rounded-lg font-bold hover:bg-brand-700 transition-colors shadow-lg shadow-brand-500/30 disabled:opacity-50 disabled:cursor-not-allowed mt-2">
            {loading ? 'Processing...' : (isRegistering ? 'Create Account' : 'Sign In')}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button onClick={() => { setIsRegistering(!isRegistering); setError(''); }} className="text-sm text-brand-600 hover:text-brand-800 font-medium transition-colors">
            {isRegistering ? 'Already have an account? Sign In' : 'Need an account? Register'}
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

  // Persistence Logic
  useEffect(() => {
    const sessionId = localStorage.getItem('aa_session_id');
    if (sessionId) {
        const restoredUser = MockBackend.getUserById(sessionId);
        if (restoredUser && restoredUser.status === 'APPROVED') {
            setUser(restoredUser);
            setViewState('app');
        } else {
            localStorage.removeItem('aa_session_id');
        }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('aa_session_id');
    setUser(null);
    setViewState('landing');
    setCurrentPage('dashboard');
  };

  const handleLoginSuccess = (user: User) => {
      localStorage.setItem('aa_session_id', user.id);
      setUser(user);
      setViewState('app');
      setCurrentPage('dashboard');
  };

  const renderPage = () => {
    if (!user) return <div className="flex h-screen items-center justify-center">Loading...</div>;

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
            return <div>Error: Unknown Role</div>;
    }
  };

  if (viewState === 'landing') {
      return (
        <LandingPage 
            onLoginClick={() => { setAuthMode('login'); setViewState('auth'); }} 
            onRegisterClick={() => { setAuthMode('register'); setViewState('auth'); }} 
        />
      );
  }

  if (viewState === 'auth') {
      return <AuthPage onLogin={handleLoginSuccess} initialMode={authMode} onBack={() => setViewState('landing')} />;
  }

  return (
    <Layout user={user} onLogout={handleLogout} currentPage={currentPage} setPage={setCurrentPage}>
       {renderPage()}
    </Layout>
  );
}