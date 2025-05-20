import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import { userState } from "../atoms/userState";
import { useAuth } from "../utils/Auth";
import axiosFetch from "../utils/axiosFetch";
import ServerError from "../components/serverError/ServerError";
import Loader from "../components/loader/Loader";

const ROLE_ROUTES = {
  ROLE_ADMIN: {
    authUrl: "/auth/auth-me/admin",
    redirectPath: "/admin"
  },
  ROLE_GUIDE: {
    authUrl: "/auth/auth-me/guide",
    redirectPath: "/guide/dashboard"
  },
  ROLE_TOURIST: {
    authUrl: "/auth/auth-me/tourist",
    redirectPath: "/home"
  }
};

const RoleBasedRedirect = () => {
  const navigate = useNavigate();
  const { getUser } = useAuth();
  const [user, setUser] = useRecoilState(userState);
  const [error, setError] = useState(null);

  useEffect(() => {
    const validateUserAndRedirect = async () => {
      try {
        const userData = await getUser();

        if (!userData) {
          handleUnauthenticatedUser();
          return;
        }

        if (userData === 'Network Error') {
          setError('network');
          return;
        }

        await handleAuthenticatedUser(userData);
      } catch (error) {
        setError('general');
        console.error('Error in role validation:', error);
      }
    };

    validateUserAndRedirect();
  }, []);

  const handleUnauthenticatedUser = () => {
    setUser({ isAuthenticated: false, user: null });
    navigate("/home");
  };

  const handleAuthenticatedUser = async (userData) => {
    setUser({ isAuthenticated: true, user: userData });

    // Find the highest priority role that the user has
    const userRole = Object.keys(ROLE_ROUTES).find(role =>
      userData.userRoles.includes(role)
    );

    if (!userRole) {
      setError('general');
      return;
    }

    try {
      await axiosFetch.get(ROLE_ROUTES[userRole].authUrl);
      navigate(ROLE_ROUTES[userRole].redirectPath);
    } catch (error) {
      if (error.message === 'Network Error') {
        setError('network');
      } else {
        setError('general');
      }
    }
  };

  if (error === 'network') {
    return <ServerError />;
  }

  if (error === 'general') {
    return <div>Something went wrong. Please try again later.</div>;
  }

  return <Loader />;
};

export default RoleBasedRedirect;