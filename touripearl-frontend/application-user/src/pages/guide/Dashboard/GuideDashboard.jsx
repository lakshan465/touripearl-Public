import React, { useState } from 'react';
import {
  BarChart3, Users, Calendar, CreditCard,
  Settings, Menu, Bell, User, LogOut,
  Map, BookOpen, ChevronDown, ChevronRight
} from 'lucide-react';
import { useAuth } from '../../../utils/Auth';
import GuideLayout from '../../../components/user-layouts/GuideLayout';
import SubMenuItem from '../../../components/subMenuItem/SubMenuItem';
import { useNavigate } from 'react-router-dom';
import ConfirmationDialog from "../../../components/confirmation-dialog/ConfirmationDialog.jsx";
import BellNotifi from "../../../components/Notification/Guide.jsx"


const GuideDashboard = ({ title,children }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const MENU_ITEMS = [
    { 
      name: 'Dashboard', 
      icon: BarChart3,
      path: '/guide/dashboard'
    },
    // {
    //   name: 'User Management',
    //   icon: Users,
    //   path: '/admin/user-management'
    // },
    {
      name: 'customized Bookings',
      icon: BookOpen,
      path: '/guide/booking-management'
    },
    {
      name: 'Bookings Management',
      icon: BookOpen,
      path: '/guide/booking/booking-management'
    },
    // {
    //   name: 'Payments',
    //   icon: CreditCard,
    //   path: '/admin/payments'
    // },
    {
      name: 'Reservations',
      icon: Calendar,
      path: '/guide/reservations-management'
    },
    { 
      name: 'Tours', 
      icon: Map,
      subItems: [
        { name: 'Tour List', path: '/guide/tour-management' },
        { name: 'Add New Tour', path: '/guide/tour-management/create' },
        { name: 'Tour Categories', path: '/admin/tours/categories' }
      ]
    },
    { 
      name: 'Settings', 
      icon: Settings,
      path: '/guide/profile'
    },
  ];

  return (
    <GuideLayout>
      <div className="flex h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white">
        {/* Sidebar */}
        <div
            className={`${
                sidebarCollapsed ? 'w-16' : 'w-64'
            } bg-gray-200 dark:bg-gray-800 transition-all duration-300 ease-in-out flex flex-col`}
        >
          <div className="p-4 flex items-center border-b border-r border-gray-300 dark:border-gray-700">
            <button
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                className="p-1 rounded-md hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors"
                aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
                title={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              <Menu className="h-6 w-6"/>
            </button>
            {!sidebarCollapsed && (
                <span className="text-xl font-bold text-gray-900 dark:text-gray-200">TouriPearl</span>
            )}
          </div>

          <nav className="flex-1 overflow-y-auto">
            {MENU_ITEMS.map((item) => (
                <SubMenuItem
                    key={item.name}
                    item={item}
                    active={title}
                    collapsed={sidebarCollapsed}
                    onNavigate={navigate}
                />
            ))}
          </nav>
        </div>

        {/* Sidebar */}
        <div
            className={`${
                sidebarCollapsed ? 'w-16' : 'w-64'
            } bg-gray-800 fixed left-0 top-16 h-[calc(100vh-4rem)] transition-all duration-300 ease-in-out flex flex-col`}
        >
          <nav className="flex-1 overflow-y-auto">
            {MENU_ITEMS.map((item) => (
                <SubMenuItem
                    key={item.name}
                    item={item}
                    collapsed={sidebarCollapsed}
                    onNavigate={navigate}
                />
            ))}
          </nav>
        </div>

        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <header
              className="bg-gray-200 dark:bg-gray-800 p-4 flex justify-between items-center border-b border-gray-300 dark:border-gray-700">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-200">{title}</h1>

            <div className="flex items-center gap-6 relative">
  <BellNotifi />
              <ConfirmationDialog
                    title="Logout"
                    description="Are you sure you want to logout?"
                    confirmText="Logout"
                    onConfirm={() => logout()}
                >
                  <div className="transition-colors rounded-full hover:bg-accent/20 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-accent dark:focus:ring-gray-500"
                       aria-label="Logout">
                    <LogOut className="w-5 h-5 text-white" />
                  </div>
                </ConfirmationDialog>
            </div>
          </header>

          {/* Main Content Area */}
          <main className="flex-1 overflow-y-auto p-6 bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white">
            {children}
          </main>
        </div>
      </div>
    </GuideLayout>
  );
};

export default GuideDashboard;