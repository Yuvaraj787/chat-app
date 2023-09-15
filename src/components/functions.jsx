import { Cookies } from "react-cookie"
import toast from 'react-hot-toast';
import { useNavigate } from "react-router-dom";

const notify =(message)=> {
   toast(message)
}

const logout = () => {
   const navigate = useNavigate();
   const cookie = new Cookies();
   cookie.remove("token");
   cookie.remove("username");
   navigate("/login");
}

export {logout,notify}