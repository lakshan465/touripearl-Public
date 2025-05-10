import Navbar from "../nav-bar/NavBar";
import Footer from "../footer/Footer";
import { useEffect } from "react";

const GuestLayout = ({ children }) => {
    useEffect(() => {
        window.scrollTo(0, 0);
    });
    return(
        <>
            <Navbar />
                {children}
            <Footer />
        </>
    )
};

export default GuestLayout;