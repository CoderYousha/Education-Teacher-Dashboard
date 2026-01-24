import { Box, CircularProgress, TextField, Typography } from "@mui/material";
import Image1 from '../../images/forgot_password/image1.png';
import Image2 from '../../images/forgot_password/image2.png';
import OTPInput from "react-otp-input";
import { useContext, useState } from "react";
import AuthContext from "../../context/AuthContext";
import Fetch from "../../services/Fetch";
import SnackbarAlert from "../../components/SnackBar";
import useSnackBar from "../../hooks/UseSnackBar";
import { useWaits } from "../../hooks/UseWait";

function ForgotPassword() {
     const host = `${process.env.REACT_APP_LOCAL_HOST}`;
     const { wait } = useContext(AuthContext);
     const { openSnackBar, type, message, setSnackBar, setOpenSnackBar } = useSnackBar();
     const {sendWait, setSendWait} = useWaits();
     const [email, setEmail] = useState('');

     const forgotPassword = async () => {
          setSendWait(true);

          const formData = new FormData();
          formData.append('email', email);
          formData.append('account_role', 'teacher');

          let result = await Fetch(host + '/forget-password', 'POST', formData);

          if (result.status == 200) {
               document.getElementById('page1').style.display = 'none';
               document.getElementById('page2').style.display = 'flex';
          } else if (result.status == 422) {
               setSnackBar("error", result.status.errors[0]);
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
                         <Box className="bg-blue-color w-screen h-screen overflow-auto">
                              <Box className="bg-white h-screen w-1/2 float-right max-sm:w-11/12" style={{ borderRadius: "70px 0 0 70px" }}>
                                   <Typography marginTop={10} variant="h5" className="text-center font-bold text-2xl mt-32">Forgot Password</Typography>
                                   <Box id="page1" className="flex flex-col items-center h-1/2 mt-10">
                                        <TextField onChange={(e) => setEmail(e.target.value)} id="standard-basic" className="w-2/3" label="Email" variant="standard" slotProps={{ htmlInput: { 'className': 'py-5' } }} />
                                        <br />
                                        <button onClick={forgotPassword} className="bg-blue-color text-white w-2/3 mt-10 py-1 rounded-lg font-semibold">
                                             {
                                                  sendWait ?
                                                       <CircularProgress size={20} className="" color="white" />
                                                       :
                                                       "Send Code"
                                             }
                                        </button>
                                   </Box>
                                   <Box id="page2" className="flex-col items-center h-1/2 mt-10 hidden">
                                        <OTPInput
                                             numInputs={6}
                                             inputStyle={{
                                                  width: "3rem",
                                                  height: "3rem",
                                                  margin: "0 0.5rem",
                                                  fontSize: "1.5rem",
                                                  borderRadius: "8px",
                                                  border: "1px solid #ccc",
                                             }}
                                             renderInput={(props) => <input {...props} />}
                                        />
                                        <br />
                                        <Box className="flex flex-col items-center h-1/2 mt-10 w-full">
                                             <TextField type="password" id="standard-basic" className="w-4/6" label="Password" variant="standard" slotProps={{ htmlInput: { 'className': 'py-5' } }} />
                                             <br />
                                             <TextField type="password" id="standard-basic" className="w-4/6" label="Password Confirmation" variant="standard" slotProps={{ htmlInput: { 'className': 'py-5' } }} />
                                        </Box>
                                        <button className="bg-blue-color text-white w-2/3 mt-10 py-1 rounded-lg font-semibold">Check</button>
                                   </Box>
                              </Box>
                              <Box className="w-1/2 h-screen float-left relative">
                                   <img src={Image2} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 max-sm:hidden" />
                                   <img src={Image1} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 max-sm:hidden" />
                              </Box>
                         </Box>
               }
               <SnackbarAlert open={openSnackBar} message={message} severity={type} onClose={() => setOpenSnackBar(false)} />
          </>
     );
}

export default ForgotPassword;