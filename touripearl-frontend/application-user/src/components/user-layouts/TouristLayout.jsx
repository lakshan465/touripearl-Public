import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import axiosFetch from "../../utils/axiosFetch";
import Loader from "../loader/Loader";
import {useAuth} from "../../utils/Auth.js";
import Unauthorized from "../unAuthorized/Unauthorized.jsx";
import Navbar from "../nav-bar/NavBar.jsx";
import Footer from "../footer/Footer.jsx";

const TouristLayout = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState();
    const [isLoading, setIsLoading] = useState(true);
    const {user} = useAuth();

    useEffect(() => {
        const fetchData = async () => {
            try {
                await axiosFetch.get("/auth/auth-me/tourist");
                setIsAuthenticated(true)
            } catch (e) {
                console.error(e);
            }
            setIsLoading(false);
        };

        fetchData();
    }, []);
    if (user==null) return <Navigate to="/login" />;
    if (isLoading) return <Loader />;
    if (!isAuthenticated && !isLoading) return <Navigate to="/login" />;


    return(
        <>
            <Navbar />
            {children}
            <Footer />
        </>
    );
};
export default TouristLayout;
