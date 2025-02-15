import { createContext, useContext, useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import api from "../../api";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../../constants";
import LoadingIndicator from "../components/LoadingIndicator";


const AuthContext = createContext()

export const AuthProvider = ({children}) => {
    const [isAuthorized, setIsAuthorized] = useState(null);
    const [user, setUser] = useState(null)

    useEffect(() => {
        auth().catch(() => setIsAuthorized(false));
    }, []);

    const refreshToken = async () => {
        const refreshToken = localStorage.getItem(REFRESH_TOKEN);
        try {
            const res = await api.post("/api/token/refresh/", {
                refresh: refreshToken,
            });
            if (res.status === 200) {
                localStorage.setItem(ACCESS_TOKEN, res.data.access);
                setIsAuthorized(true);
            } else {
                setIsAuthorized(false)
            }
      
        } catch (error) {
            console.log(error);
            setIsAuthorized(false);
        };
    };

    const auth = async () => {
        const token = localStorage.getItem(ACCESS_TOKEN);
        if (!token) {
            setIsAuthorized(false);
            return;
        }
        const decoded = jwtDecode(token);
        const tokenExpiration = decoded.exp;
        const now = Date.now() / 1000;

        if (tokenExpiration < now) {
            await refreshToken();
        } else {
            setIsAuthorized(true);
            setUser(decoded)
        }
    };

    if (isAuthorized === null) {
        return <div><LoadingIndicator/></div>
    }
    return (
        <AuthContext.Provider value={{isAuthorized, setIsAuthorized}}>
            {children}
        </AuthContext.Provider>
    )
};

export const useAuth = () => {
    return useContext(AuthContext);
};