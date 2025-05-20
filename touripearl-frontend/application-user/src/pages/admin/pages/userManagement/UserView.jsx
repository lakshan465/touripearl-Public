import React, { useEffect, useState } from 'react';
import { Mail, Phone, MapPin, Shield, Check, X, Loader2 as Loader, Calendar } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@components/card/Card';
import Dashboard from '../../dashboard/Dashboard';
import { Link, useParams } from 'react-router-dom';
import axiosFetch from '../../../../utils/axiosFetch';
import Button from '@components/ui/button/RUButton';

const UserView = () => {
  const { userId } = useParams();
  const [user, setUser] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setIsLoading(true);
        const response = await axiosFetch.get(`/api/v1/users/${userId}`);
        setUser(response.data.object);
        console.log(response.data.object);
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUserData();
  }, [userId]);

  const getInitials = (name) => {
    return name
        .split(' ')
        .map(part => part[0])
        .join('')
        .toUpperCase();
  };

  return (
      <Dashboard title="User Details">
        {isLoading ? (
            <div className="flex justify-center items-center h-full">
              <Loader className="animate-spin h-8 w-8 text-white" />
            </div>
        ) : (
            <div className="container mx-auto p-4 sm:p-6 max-w-7xl">
              <div className="mb-4 sm:mb-6">
                <Link to="/admin/user-management">
                  <Button
                      type='secondary'
                      className="w-full sm:w-auto bg-secondary text-white hover:bg-secondary/90"
                  >
                    Back
                  </Button>
                </Link>
              </div>
              <Card className="bg-white dark:bg-gray-800 shadow-lg">
                <CardHeader className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 p-6">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden bg-light flex items-center justify-center">
                    {user.profileImage ? (
                        <img
                            src={user.profileImage.resourceUrl}
                            alt={user.userName}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <span className="text-lg sm:text-xl font-semibold text-white">
                    {getInitials(user.userName)}
                  </span>
                    )}
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-xl sm:text-2xl font-bold text-white">{user.userName}</CardTitle>
                    <p className="text-white flex items-center gap-2">
                      <span className="inline-block w-4 h-4 rounded-full bg-accent"/>
                      {user.country}
                    </p>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-6">
                    <div className="flex flex-wrap gap-2">
                      {Array.from(user.userRoles || []).map((role) => (
                          <span
                              key={role}
                              className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs sm:text-sm font-medium bg-secondary text-white"
                          >
                      <Shield className="h-3 w-3 text-white" />
                            {role}
                    </span>
                      ))}
                    </div>
                    <div className="space-y-4">
                      {[['Email', user.email, Mail],
                        ['Phone', user.phone, Phone],
                        ['street', user.street, MapPin],
                        ['city', user.city, MapPin],
                        ['state', user.state, MapPin],
                        ['Joined', user.createdAt, Calendar]].map(([label, value, Icon]) => (
                          <div key={label} className="flex items-center gap-2 text-white">
                            <Icon className="h-5 w-5 text-white" />
                            <span className="text-sm sm:text-base">{value || 'N/A'}</span>
                          </div>
                      ))}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                      {[
                        { title: 'Account Not Expiry Status', isActive: user.accountNonExpired },
                        { title: 'Account Not Lock Status', isActive: user.accountNonLocked },
                        { title: 'Credentials Not Expiry Status', isActive: user.credentialsNonExpired },
                        { title: 'Account Enable Status', isActive: user.enabled },
                        { title: 'Email Verified', isActive: user.emailVerified }
                      ].map((status, index) => (
                          <StatusCard key={index} {...status} />
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
        )}
      </Dashboard>
  );
};

const StatusCard = ({ title, isActive }) => (
    <Card className="p-3 sm:p-4 rounded-lg bg-white dark:bg-gray-800 border border-secondary shadow-md">
      <CardHeader>
        <CardTitle className="text-xs sm:text-sm font-medium text-black dark:text-white">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mt-2 flex items-center gap-2">
          {isActive ? (
              <>
                <Check className="h-4 sm:h-5 w-4 sm:w-5 text-white" />
                <span className="font-medium text-white">Yes</span>
              </>
          ) : (
              <>
                <X className="h-4 sm:h-5 w-4 sm:w-5 text-red-500" />
                <span className="font-medium text-red-500">No</span>
              </>
          )}
        </div>
      </CardContent>
    </Card>
);

export default UserView;