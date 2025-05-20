import {userState} from "../atoms/userState";
import {useRecoilState} from "recoil";
import axiosFetch from "./axiosFetch";
import toast from "react-hot-toast";
import {useNavigate} from "react-router-dom";

export const useAuth = () => {
    const [user, setUser] = useRecoilState(userState);
    const navigate = useNavigate();

    const login = async (email, password) => {
        await toast.promise(
            async () => {
                await axiosFetch.post("/auth/login", {username: email, password: password});
                setUser({isAuthenticated: true, user: await getUser()});
                navigate('/')
            },
            {
                loading: "Logging in...",
                success: "Logged in successfully",
                error: (error) => {
                    if(error?.response?.data?.error === "Authentication failed: email verification failed"){
                        axiosFetch.post('api/v1/users/email-verify-request', {email:email}).then(() => {
                            navigate('/email-verification', { state: { Emailverified:true } });
                        });
                        return 'Email verification. Please check your email for the verification code.'
                    }
                    return `Error logging in: ${error.response.data.error}`
                },
            }
        );
    };

    const logout = async () => {
        toast.promise(
            async () => {
                await axiosFetch.post('auth/logout');
                localStorage.clear();
                setUser({isAuthenticated: false, user: null});
                navigate('/');
            },
            {
                loading: 'Logging out...',
                success: 'Logged out successfully',
                error: error => `Error logging out : ${error.message}`
            }
        );
    };

    const getUser = async () => {
        try {
            const response = await axiosFetch.get("/auth/auth-me/userdata");
            setUser({isAuthenticated: true, user: response.data.object});
            return response.data.object;
        } catch (e) {
            if (e.message == 'Network Error') {
                return 'Network Error';
            } else {
                return null;
            }
        }
    };

    return {user, login, logout, getUser};
};