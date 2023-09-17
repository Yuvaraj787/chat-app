import { Cookies } from "react-cookie"
import { useNavigate } from "react-router-dom";

const validateEmail = (email) => {
   let patten = "[a-z0-9]+@[a-z]{2,7}.[a-z]{2,5}";
   return email.match(patten) ? true : false;
}

const validatePhone = (phone) => {
   let pattern = "[0-9]{10}"
   return phone.match(pattern);
}

const logout = () => {
   const navigate = useNavigate();
   const cookie = new Cookies();
   cookie.remove("token");
   cookie.remove("username");
   navigate("/login");
}

export {logout, validateEmail, validatePhone}