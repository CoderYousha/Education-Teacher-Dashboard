import { useEffect, useState } from "react";
import CheckLogin from "../services/CheckLogin";
import { useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";

function NotAuthProvider({ children }) {
     const host = `${process.env.REACT_APP_LOCAL_HOST}`;
     const [wait, setWait] = useState(true);
     const navigate = useNavigate();

     useEffect(() => {
          const checkLogin = async () => {
               try{
                    let result = await CheckLogin(host);
                    if (result) {
                         navigate('/profile');
                    }
               }catch(err){
                    console.log(err);
                    navigate(-1);
               }finally{
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

export default NotAuthProvider;