import React from "react";
import { Route } from "react-router-dom";
import ReviewApplication from "./GuideReview";
//import Dashboard from "../../DashboardPage/DashboardPage.jsx";
function ApplicationRoutes() {
  return (
    <>
      <Route
        path="/admin/guide-management/:userId"
        element={<ReviewApplication />}
      />
    </>
  );
}

export default ApplicationRoutes;
