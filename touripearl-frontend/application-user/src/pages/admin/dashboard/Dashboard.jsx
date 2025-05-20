import React, { useState } from 'react';
import {
  BarChart3, Users, Calendar, CreditCard,
  Settings, Menu, Bell, User, LogOut, Image,Film,
  Map, BookOpen, MapPinHouse
} from 'lucide-react';
import SubMenuItem from '../../../components/subMenuItem/SubMenuItem';
import { useNavigate } from 'react-router-dom';
import ConfirmationDialog from '../../../components/confirmation-dialog/ConfirmationDialog';
import AdminLayout from '../../../components/user-layouts/AdminLayout';
import { useAuth } from '../../../utils/Auth';

const MENU_ITEMS = [
  {
    name: 'Dashboard',
    icon: BarChart3,
    path: '/admin/dashboard'
  },
  {
    name: 'User Management',
    icon: Users,
    path: '/admin/user-management'
  },
  {
    name: 'Destination Management',
    icon: MapPinHouse,
    path: '/admin/destination-management'
  },
  {
    name: 'Edit Banner Slide Show',//slide show
    icon: Image,
    path: '/admin/sldeShow'
  },
  {
    name: 'Tourist Bookings',
    icon: BookOpen,
    path: '/admin/booking-management'
  },
  {
    name: 'Guides Management',
    icon: Users,
    path: '/admin/guide-management'
  },
  // {
  //   name: 'Payments',
  //   icon: CreditCard,
  //   path: '/admin/payments'
  // },
  // {
  //   name: 'Reservations',
  //   icon: Calendar,
  //   path: '/admin/reservations'
  // },
  {
    name:'Dispute Management',
    icon: Calendar,
    path: '/admin/dispute-management'
  },
  {
    name: 'Events',
    icon: Film,
    subItems: [
      { name: 'Event List', path: '/admin/event-management' },
      { name: 'Add New Event', path: '/admin/event-management/create' }
    ]
  },
  {
    name: 'Refund Management',
    icon: Settings,
    path: '/admin/refund-management'
  },
];

const Dashboard = ({ title, children }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);
  const navigate = useNavigate();
  const { logout } = useAuth();

  return (
      <AdminLayout>
        <div className="flex h-screen text-secondary bg-light dark:bg-gray-900 dark:text-white">
          {/* Sidebar */}
          <div
              className={`
            ${sidebarCollapsed ? 'w-16' : 'w-64'}
            bg-primary dark:bg-gray-800 transition-all duration-300 ease-in-out flex flex-col
          `}
          >
            <div className="flex items-center p-4 border-b border-r border-secondary dark:border-gray-700">
              <button
                  onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                  className="p-1 transition-colors rounded-md hover:bg-accent/20 dark:hover:bg-gray-700"
                  aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
                  title={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
              >
                <Menu className="w-6 h-6 text-white" />
              </button>
              {!sidebarCollapsed && (
                  <span className="text-xl font-bold text-white">TouriPearl</span>
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

          {/* Main Content */}
          <div className="flex flex-col flex-1 overflow-hidden">
            {/* Header */}
            <header className="flex items-center justify-between p-4 bg-light border-b border-secondary dark:bg-gray-800 dark:border-gray-700">
              <h1 className="text-2xl font-bold text-primary dark:text-gray-200">{title}</h1>
              <div className="flex items-center space-x-2">
                <button
                    className="px-1 transition-colors rounded-full hover:bg-accent/20 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-accent dark:focus:ring-gray-500"
                    aria-label="Notifications"
                >
                  <Bell className="w-5 h-5 text-white" />
                </button>
                <button
                    className="transition-colors rounded-full hover:bg-accent/20 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-accent dark:focus:ring-gray-500"
                    aria-label="Profile"
                >
                  <User className="w-5 h-5 text-white" />
                </button>
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
            <main className="flex-1 p-6 overflow-y-auto text-secondary bg-light dark:bg-gray-900 dark:text-white">
              {children}
            </main>
          </div>
        </div>
      </AdminLayout>
  );
};

export default Dashboard;