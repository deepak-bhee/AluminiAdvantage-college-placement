import React from 'react';
import { GraduationCap, Briefcase, Users, ArrowRight } from 'lucide-react';

interface LandingPageProps {
  onLoginClick: () => void;
  onRegisterClick: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onLoginClick, onRegisterClick }) => {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Navigation */}
      <nav className="border-b border-gray-100 sticky top-0 bg-white/90 backdrop-blur-sm z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center space-x-2 text-brand-600">
              <GraduationCap className="h-8 w-8" />
              <span className="text-xl font-bold text-gray-900">Alumni Advantage</span>
            </div>
            <div className="flex space-x-4">
              <button 
                onClick={onLoginClick}
                className="text-gray-600 hover:text-brand-600 font-medium px-4 py-2 transition-colors"
              >
                Login
              </button>
              <button 
                onClick={onRegisterClick}
                className="bg-brand-600 text-white px-5 py-2 rounded-full font-medium hover:bg-brand-700 transition-colors shadow-lg shadow-brand-500/30"
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="flex-1 bg-gradient-to-br from-brand-50 via-white to-blue-50 relative overflow-hidden">
        {/* Abstract Background Element */}
        <div className="absolute top-0 right-0 w-1/3 h-full bg-brand-100/30 -skew-x-12 translate-x-20"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-brand-100 text-brand-700 font-medium text-sm mb-8">
              <span className="mr-2">✨</span> Bridging the gap between Campus and Career
            </div>
            
            <h1 className="text-5xl lg:text-7xl font-bold text-gray-900 tracking-tight mb-6">
              "Education opens the door, but <span className="text-brand-600">guidance shows the way.</span>"
            </h1>
            
            <p className="text-xl text-gray-600 mb-10 leading-relaxed max-w-2xl mx-auto">
              Empowering small and mid-sized colleges with a comprehensive placement ecosystem. 
              We connect ambitious students with successful alumni and dedicated placement cells to 
              share verified opportunities, mentorship, and career growth.
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button 
                onClick={onRegisterClick}
                className="flex items-center justify-center space-x-2 bg-brand-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-brand-700 transition-all shadow-xl shadow-brand-500/20 hover:scale-105"
              >
                <span>Join the Network</span>
                <ArrowRight size={20} />
              </button>
              <button 
                onClick={onLoginClick}
                className="flex items-center justify-center space-x-2 bg-white text-gray-700 border border-gray-200 px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-50 transition-all hover:border-brand-200"
              >
                <span>Sign In</span>
              </button>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-24">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="h-12 w-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 mb-6">
                <Briefcase size={24} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Verified Jobs</h3>
              <p className="text-gray-500">Access exclusive job openings posted directly by alumni working in top companies.</p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="h-12 w-12 bg-purple-100 rounded-xl flex items-center justify-center text-purple-600 mb-6">
                <Users size={24} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Alumni Mentorship</h3>
              <p className="text-gray-500">Get guidance, resume reviews, and interview prep from seniors who walked the same path.</p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="h-12 w-12 bg-green-100 rounded-xl flex items-center justify-center text-green-600 mb-6">
                <GraduationCap size={24} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Placement Support</h3>
              <p className="text-gray-500">Streamlined process managed by the placement cell ensuring every student gets a fair shot.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};