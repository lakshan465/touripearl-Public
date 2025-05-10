import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import axiosFetch from "../../utils/axiosFetch";
import Loader from "../loader/Loader";
import Unauthorized from "../unAuthorized/Unauthorized";
import { useAuth } from "../../utils/Auth";

const AdminLayout = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState();
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const {user} = useAuth();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axiosFetch.get("/auth/auth-me/admin");
                setIsAuthenticated(true)
            } catch (e) {
                console.error(e);
                setError("Authentication failed.");
            }
            setIsLoading(false);
        };

        fetchData();
    }, []);
    if (user==null) return <Navigate to="/login" />;
    if (isLoading) return <Loader />;
    if (!isAuthenticated && !isLoading) return <div><Unauthorized/></div>;
    

    return <>{children}</>;
};

export default AdminLayout;
