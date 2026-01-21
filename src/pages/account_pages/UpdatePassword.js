import { Box, CircularProgress, TextField, Typography } from "@mui/material";
import MiniDrawer from "../../components/Drawer";
import { useContext, useState } from "react";
import Image1 from '../../images/forgot_password/image1.png';
import Image2 from '../../images/forgot_password/image2.png';
import AuthContext from "../../context/AuthContext";
import SnackbarAlert from "../../components/SnackBar";
import Fetch from "../../services/Fetch";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header";

function UpdatePassword() {
     const host = `${process.env.REACT_APP_LOCAL_HOST}`;
     const [sendWait, setSendWait] = useState(false);
     const { wait } = useContext(AuthContext);
     const [password, setPassword] = useState('');
     const [newPassword, setNewPassword] = useState('');
     const [confirmPassword, setConfirmPassword] = useState('');
     const [message, setMessage] = useState('');
     const [type, setType] = useState('');
     const [open, setOpen] = useState(false);
     const navigate = useNavigate();

     function setSnackBar(type, message){
          setOpen(true);
          setType(type);
          setMessage(message);
     }

     const updatePassword = async () => {
          setSendWait(true);

          const formData = new FormData();
          formData.append('old_password',password);
          formData.append('new_password',newPassword);
          formData.append('new_password_confirmation',confirmPassword);

          let result = await Fetch(host + '/account/update-password', "POST", formData);
          if(result.status == 200){
               navigate('/profile');
          }else if(result.status == 422){
               setSnackBar("error", result.data.errors[0]);
          }

          setSendWait(false);
     }

     return (
          <>
               {
                    wait ?
                         <Box className="w-full h-screen relative flex justify-center items-center">
                              <CircularProgress size={70} />
                         </Box>
                         :
                         <Box className="bg-blue-color w-screen h-screen overflow-hidden">
                              {/* <MiniDrawer /> */}
                              <Header />

                              <Box className="bg-white h-screen w-1/2 float-right max-sm:w-11/12" style={{ borderRadius: "70px 0 0 70px" }}>
                                   <Typography marginTop={5} variant="h5" className="text-center font-bold text-2xl mt-32">
                                        Change your password
                                   </Typography>
                                   <Box className="flex flex-col items-center h-1/2 mt-10">
                                        <TextField onChange={(e) => setPassword(e.target.value)} type="password" id="standard-basic" className="w-2/3" label="Password" variant="standard" slotProps={{ htmlInput: { 'className': 'py-5' } }} />
                                        <br />
                                        <TextField onChange={(e) => setNewPassword(e.target.value)} type="password" id="standard-basic" className="w-2/3" label="New Password" variant="standard" />
                                        <br />
                                        <TextField onChange={(e) => setConfirmPassword(e.target.value)} type="password" id="standard-basic" className="w-2/3" label="Confirm Password" variant="standard" />
                                        <button onClick={updatePassword} className="bg-blue-color text-white w-2/3 mt-10 py-1 rounded-lg font-semibold">
                                             {
                                                  sendWait ?
                                                       <CircularProgress size={20} className="" color="white" />
                                                       :
                                                       "Update"
                                             }

                                        </button>
                                   </Box>
                              </Box>
                              <Box className="w-1/2 h-screen float-left relative">
                                   <img src={Image2} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 max-sm:hidden" />
                                   <img src={Image1} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 max-sm:hidden" />
                              </Box>
                         </Box>

               }
               <SnackbarAlert open={open} message={message} severity={type} onClose={() => setOpen(false)} />
          </>
     );
}

export default UpdatePassword;