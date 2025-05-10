import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import axiosFetch from "../../utils/axiosFetch";
import Loader from "../loader/Loader";
import Unauthorized from "../unAuthorized/Unauthorized";
import { useAuth } from "../../utils/Auth";

const GuideLayout = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState();
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const {user} = useAuth();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axiosFetch.get("/auth/auth-me/guide");
                setIsAuthenticated(true)
            } catch (e) {
                console.error(e);
                setError("Authentication failed.");
            }
            setIsLoading(false);
        };

        fetchData();
    }, []);
    if (user==null) return <Navigate to="/" />;
    if (isLoading) return <Loader />;
    if (!isAuthenticated && !isLoading) return <div><Unauthorized/></div>;
    

    return <>{children}</>;
};

export default GuideLayout;
