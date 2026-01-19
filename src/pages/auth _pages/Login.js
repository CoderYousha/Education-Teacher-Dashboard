import { CircularProgress, TextField } from "@mui/material";
import Image1 from '../../images/login/image1.png';
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import Fetch from "../../services/Fetch";
import SnackbarAlert from "../../components/SnackBar";
import AuthContext from "../../context/AuthContext";

function Login() {
     const host = `${process.env.REACT_APP_LOCAL_HOST}`;
     const navigate = useNavigate();
     const [message, setMessage] = useState('');
     const [type, setType] = useState('');
     const [email, setEmail] = useState('');
     const [password, setPassword] = useState('');
     const [sendWait, setSendWait] = useState(false);
     const [open, setOpen] = useState(false);
     const {wait} = useContext(AuthContext);

     function setSnackBar(type, message){
          setOpen(true);
          setType(type);
          setMessage(message);
     }

     const login = async () => {
          setSendWait(true);
          const formData = new FormData();
          formData.append('email', email);
          formData.append('password', password);
          let result = await Fetch(host + '/login', "POST", formData);

          if (result.status == 200) {
               localStorage.setItem('token', result.data.data.token);
               localStorage.setItem('language', result.data.data.user.language);
               navigate('/profile');
          }else if(result.status == 422){
               setSnackBar("error", result.data.errors[0]);
          }else if(result.status == 400){
               setSnackBar("error", result.data.errors[0]);
          }
          setSendWait(false);
     }

     return (
          <>
               {
                    wait ?
                         <div className="w-full h-screen relative flex justify-center items-center">
                              <CircularProgress size={70} />
                         </div>
                         :
                         <section className="bg-blue-color w-screen h-screen overflow-auto">
                              <div className="bg-white h-screen w-1/2 float-right max-sm:w-11/12" style={{ borderRadius: "70px 0 0 70px" }}>
                                   <h1 className="text-center font-bold text-2xl mt-32">
                                        Sign In
                                   </h1>
                                   <div className="flex flex-col items-center h-1/2 mt-10">
                                        <TextField onChange={(e) => setEmail(e.target.value)} id="standard-basic" className="w-2/3" label="Email" variant="standard" slotProps={{ htmlInput: { 'className': 'py-5' } }} />
                                        <br />
                                        <TextField onChange={(e) => setPassword(e.target.value)} type="password" id="standard-basic" className="w-2/3" label="Password" variant="standard" />
                                        <button onClick={login} className="bg-blue-color text-white w-2/3 mt-10 py-1 rounded-lg font-semibold">
                                             {
                                                  sendWait ?
                                                       <CircularProgress size={20} className="" color="white" />
                                                       :
                                                       "Sign in"
                                             }
                                        </button>
                                   </div>
                                   <div className="flex justify-between w-2/3 mx-auto blue-color max-sm:text-s max-sm:text-sm">
                                        <div onClick={() => navigate('/forgot-password')} className="cursor-pointer">Forgot Password?</div>
                                        <div onClick={() => navigate('/register')} className="cursor-pointer">I dont't have an account</div>
                                   </div>
                              </div>
                              <div className="w-1/2 h-screen float-left relative">
                                   <img src={Image1} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 max-sm:hidden" />
                              </div>
                         </section>
               }
               <SnackbarAlert open={open} message={message} severity={type} onClose={() => setOpen(false)}
               />
          </>
     );
}

export default Login;