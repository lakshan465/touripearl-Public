import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LayoutDashboard, Home, BookOpen, ArrowRight } from 'lucide-react';
import AdminLayout from '../../../components/user-layouts/AdminLayout';
import { useAuth } from '../../../utils/Auth';

const AdminRedirect = () => {
  const navigate = useNavigate();
  const {user} = useAuth();
  return (
      <AdminLayout>
        <div className="min-h-screen flex items-center justify-center bg-light/20">
          <div className="flex flex-col items-center space-y-8">
            <div className="text-center">
              <h1 className="text-3xl font-bold mb-2 text-primary">Welcome {user.user ? user.user.userName : "Unauthorized"}</h1>
              <p className="text-secondary mb-6">Please select an option below to proceed:</p>
            </div>

            <div className="flex flex-col space-y-6 w-full max-w-md px-4">
              <button
                  onClick={() => navigate('/admin/dashboard')}
                  className="group flex items-center justify-between px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-all duration-200 shadow-lg hover:shadow-xl w-full"
              >
                <div className="flex items-center space-x-3">
                  <LayoutDashboard className="h-5 w-5 text-accent" />
                  <span className="font-medium">Admin Dashboard</span>
                </div>
                <ArrowRight className="h-4 w-4 text-accent opacity-0 group-hover:opacity-100 transform group-hover:translate-x-1 transition-all duration-200" />
              </button>

              <button
                  onClick={() => navigate('/home')}
                  className="group flex items-center justify-between px-6 py-3 bg-secondary text-white rounded-lg hover:bg-secondary/90 transition-all duration-200 shadow-lg hover:shadow-xl w-full"
              >
                <div className="flex items-center space-x-3">
                  <Home className="h-5 w-5 text-accent" />
                  <span className="font-medium">Landing Page</span>
                </div>
                <ArrowRight className="h-4 w-4 text-accent opacity-0 group-hover:opacity-100 transform group-hover:translate-x-1 transition-all duration-200" />
              </button>

              <button
                  onClick={() => navigate('/guide')}
                  className="group flex items-center justify-between px-6 py-3 bg-accent text-white rounded-lg hover:bg-accent/90 transition-all duration-200 shadow-lg hover:shadow-xl w-full"
              >
                <div className="flex items-center space-x-3">
                  <BookOpen className="h-5 w-5 text-primary" />
                  <span className="font-medium">Guide Interface</span>
                </div>
                <ArrowRight className="h-4 w-4 text-primary opacity-0 group-hover:opacity-100 transform group-hover:translate-x-1 transition-all duration-200" />
              </button>
            </div>
          </div>
        </div>
      </AdminLayout>
  );
};

export default AdminRedirect;