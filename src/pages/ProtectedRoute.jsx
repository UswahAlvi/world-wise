import { useEffect } from "react";
import { useAuth } from "../contexts/AuthContext"
import { useNavigate } from "react-router-dom";

export default function ProtectedRoute({children}) {
    const {isAuthenticated}=useAuth();
    const navigate=useNavigate();
    useEffect(function(){
        if(!isAuthenticated) navigate('/');
    },[isAuthenticated])
    return isAuthenticated?children:null
}
