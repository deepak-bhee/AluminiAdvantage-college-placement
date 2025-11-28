import React, { useState } from 'react';
import { User, Project, Education } from '../types';
import { MockBackend } from '../services/mockBackend';
import { Plus, Trash2, Save, X, ExternalLink, GraduationCap, Briefcase, BookOpen } from 'lucide-react';

interface ProfilePageProps {
  user: User;
  onUpdateUser: (user: User) => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({ user, onUpdateUser }) => {
  const [formData, setFormData] = useState<User>(user);
  const [newSkill, setNewSkill] = useState('');
  
  // New Entry States
  const [isAddingProject, setIsAddingProject] = useState(false);
  const [newProject, setNewProject] = useState<Partial<Project>>({ title: '', description: '' });
  
  const [isAddingEdu, setIsAddingEdu] = useState(false);
  const [newEdu, setNewEdu] = useState<Partial<Education>>({ institution: '', degree: '', major: '', year: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      const updated = await MockBackend.updateUser(formData);
      onUpdateUser(updated);
      alert('Profile updated successfully!');
    } catch (error) {
      alert('Failed to update profile');
    }
  };

  const addSkill = () => {
    if (newSkill && !formData.skills?.includes(newSkill)) {
      setFormData({ ...formData, skills: [...(formData.skills || []), newSkill] });
      setNewSkill('');
    }
  };

  const removeSkill = (skill: string) => {
    setFormData({ ...formData, skills: formData.skills?.filter(s => s !== skill) });
  };

  const saveProject = () => {
    if (newProject.title && newProject.description) {
      const project: Project = {
        id: Math.random().toString(36).substr(2, 9),
        title: newProject.title!,
        description: newProject.description!,
        link: newProject.link
      };
      setFormData({ ...formData, projects: [...(formData.projects || []), project] });
      setNewProject({ title: '', description: '' });
      setIsAddingProject(false);
    }
  };

  const removeProject = (id: string) => {
    setFormData({ ...formData, projects: formData.projects?.filter(p => p.id !== id) });
  };

  const saveEdu = () => {
    if (newEdu.institution && newEdu.degree) {
      const edu: Education = {
        id: Math.random().toString(36).substr(2, 9),
        institution: newEdu.institution!,
        degree: newEdu.degree!,
        major: newEdu.major!,
        year: newEdu.year!
      };
      setFormData({ ...formData, education: [...(formData.education || []), edu] });
      setNewEdu({ institution: '', degree: '', major: '', year: '' });
      setIsAddingEdu(false);
    }
  };

  const removeEdu = (id: string) => {
    setFormData({ ...formData, education: formData.education?.filter(e => e.id !== id) });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
        <button onClick={handleSave} className="flex items-center space-x-2 bg-brand-600 text-white px-6 py-2 rounded-lg hover:bg-brand-700 transition-colors shadow-sm">
          <Save size={18} />
          <span>Save Changes</span>
        </button>
      </div>

      {/* Basic Info */}
      <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center"><UserCircleIcon className="mr-2" /> Basic Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input name="name" value={formData.name} onChange={handleChange} className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-brand-500 outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email (Read Only)</label>
            <input value={formData.email} disabled className="w-full p-2 border rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed" />
          </div>
          <div>
             <label className="block text-sm font-medium text-gray-700 mb-1">Resume Link</label>
             <input name="resumeLink" value={formData.resumeLink || ''} onChange={handleChange} placeholder="https://..." className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-brand-500 outline-none" />
          </div>
          {user.role === 'ALUMNI' ? (
              <>
                 <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Current Company</label>
                    <input name="company" value={formData.company || ''} onChange={handleChange} className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-brand-500 outline-none" />
                 </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Designation</label>
                    <input name="designation" value={formData.designation || ''} onChange={handleChange} className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-brand-500 outline-none" />
                 </div>
              </>
          ) : (
              <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                  <input name="department" value={formData.department || ''} onChange={handleChange} className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-brand-500 outline-none" />
              </div>
          )}
        </div>
      </section>

      {/* Skills */}
      <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center"><BookOpen size={20} className="mr-2" /> Skills</h2>
        <div className="flex flex-wrap gap-2 mb-4">
          {formData.skills?.map(skill => (
            <span key={skill} className="bg-brand-50 text-brand-700 px-3 py-1 rounded-full text-sm font-medium flex items-center">
              {skill}
              <button onClick={() => removeSkill(skill)} className="ml-2 hover:text-brand-900"><X size={14} /></button>
            </span>
          ))}
        </div>
        <div className="flex gap-2 max-w-sm">
          <input 
            value={newSkill} 
            onChange={(e) => setNewSkill(e.target.value)} 
            onKeyDown={(e) => e.key === 'Enter' && addSkill()}
            placeholder="Add a skill (e.g. Java)" 
            className="flex-1 p-2 border rounded-lg focus:ring-2 focus:ring-brand-500 outline-none" 
          />
          <button onClick={addSkill} className="bg-gray-100 p-2 rounded-lg hover:bg-gray-200"><Plus size={20} /></button>
        </div>
      </section>

      {/* Education */}
      <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-800 flex items-center"><GraduationCap size={20} className="mr-2" /> Education</h2>
          <button onClick={() => setIsAddingEdu(true)} className="text-sm text-brand-600 hover:text-brand-700 font-medium flex items-center"><Plus size={16} className="mr-1"/> Add Education</button>
        </div>
        
        {isAddingEdu && (
          <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200 grid grid-cols-1 md:grid-cols-2 gap-4">
             <input placeholder="Institution" className="p-2 border rounded" value={newEdu.institution} onChange={e => setNewEdu({...newEdu, institution: e.target.value})} />
             <input placeholder="Degree (e.g. B.Tech)" className="p-2 border rounded" value={newEdu.degree} onChange={e => setNewEdu({...newEdu, degree: e.target.value})} />
             <input placeholder="Major" className="p-2 border rounded" value={newEdu.major} onChange={e => setNewEdu({...newEdu, major: e.target.value})} />
             <input placeholder="Year" className="p-2 border rounded" value={newEdu.year} onChange={e => setNewEdu({...newEdu, year: e.target.value})} />
             <div className="md:col-span-2 flex justify-end space-x-2">
               <button onClick={() => setIsAddingEdu(false)} className="text-gray-500 hover:text-gray-700">Cancel</button>
               <button onClick={saveEdu} className="bg-brand-600 text-white px-4 py-1.5 rounded text-sm">Add</button>
             </div>
          </div>
        )}

        <div className="space-y-4">
           {formData.education?.map(edu => (
             <div key={edu.id} className="flex justify-between items-start border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                <div>
                   <h3 className="font-semibold text-gray-900">{edu.institution}</h3>
                   <p className="text-sm text-gray-600">{edu.degree} in {edu.major}</p>
                   <p className="text-xs text-gray-500">{edu.year}</p>
                </div>
                <button onClick={() => removeEdu(edu.id)} className="text-red-400 hover:text-red-600"><Trash2 size={16} /></button>
             </div>
           ))}
        </div>
      </section>

      {/* Projects */}
      <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-800 flex items-center"><Briefcase size={20} className="mr-2" /> Past Projects</h2>
          <button onClick={() => setIsAddingProject(true)} className="text-sm text-brand-600 hover:text-brand-700 font-medium flex items-center"><Plus size={16} className="mr-1"/> Add Project</button>
        </div>

        {isAddingProject && (
          <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200 space-y-3">
             <input placeholder="Project Title" className="w-full p-2 border rounded" value={newProject.title} onChange={e => setNewProject({...newProject, title: e.target.value})} />
             <textarea placeholder="Description" className="w-full p-2 border rounded h-20" value={newProject.description} onChange={e => setNewProject({...newProject, description: e.target.value})} />
             <input placeholder="Project Link (Optional)" className="w-full p-2 border rounded" value={newProject.link} onChange={e => setNewProject({...newProject, link: e.target.value})} />
             <div className="flex justify-end space-x-2">
               <button onClick={() => setIsAddingProject(false)} className="text-gray-500 hover:text-gray-700">Cancel</button>
               <button onClick={saveProject} className="bg-brand-600 text-white px-4 py-1.5 rounded text-sm">Add</button>
             </div>
          </div>
        )}

        <div className="space-y-4">
          {formData.projects?.map(proj => (
            <div key={proj.id} className="border-b border-gray-100 pb-4 last:border-0 last:pb-0">
               <div className="flex justify-between items-start">
                  <h3 className="font-semibold text-gray-900 flex items-center">
                    {proj.title}
                    {proj.link && <a href={proj.link} target="_blank" rel="noreferrer" className="ml-2 text-brand-600 hover:text-brand-800"><ExternalLink size={14} /></a>}
                  </h3>
                  <button onClick={() => removeProject(proj.id)} className="text-red-400 hover:text-red-600"><Trash2 size={16} /></button>
               </div>
               <p className="text-sm text-gray-600 mt-1">{proj.description}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

// Helper icon
const UserCircleIcon = ({className}:{className?:string}) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="10" r="3"/><path d="M7 20.662V19a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v1.662"/></svg>
);
