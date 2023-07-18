import { Cookies } from "react-cookie"
import { useNavigate } from "react-router-dom";

const logout = () => {
   const navigate = useNavigate();
   const cookie = new Cookies();
   cookie.remove("token");
   cookie.remove("username");
   navigate("/login");
}

export {logout}