import React from 'react';
import { Route } from 'react-router-dom';
import ReviewApplication from './ReviewApplication';
import Dashboard from '../../pages/admin/dashboard/Dashboard';
function ApplicationRoutes() {
  return (
    <>
      <Route path='/admin/guide-management/:userId' element={<ReviewApplication />} />
      
    </>
  );
}

export default ApplicationRoutes;
