import { useEffect, useState } from "react";
import CheckLogin from "../services/CheckLogin";
import { useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";

function AuthProvider({ children, role = null }) {
     const host = `${process.env.REACT_APP_LOCAL_HOST}`;
     const [wait, setWait] = useState(true);
     const navigate = useNavigate();

     useEffect(() => {
          const checkLogin = async () => {
               try {
                    let result = await CheckLogin(host);
                    if (!result) {
                         navigate('/login');
                    } else {
                         if (role && result.data.account_role != role) {
                              navigate(-1);
                         }
                    }
               } catch (err) {
                    console.error(err);
                    navigate("/login");
               } finally {
                    setWait(false);
               }
          }
          checkLogin();
     }, [navigate]);

     return (
          <AuthContext.Provider value={{ wait, setWait }}>
               {children}
          </AuthContext.Provider>
     );

}

export default AuthProvider;