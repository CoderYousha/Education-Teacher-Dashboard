import { Box, CircularProgress, TextField, Typography } from "@mui/material";
import Image1 from '../../images/login/image1.png';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import Fetch from "../../services/Fetch";
import dayjs from "dayjs";
import SnackbarAlert from "../../components/SnackBar";
import AuthContext from "../../context/AuthContext";
import useSnackBar from "../../hooks/UseSnackBar";
import { useWaits } from "../../hooks/UseWait";
import { buildRegisterFormData } from "../../helper/RegisterFormData";

function Register() {
     const host = `${process.env.REACT_APP_LOCAL_HOST}`;
     const { wait } = useContext(AuthContext);
     const { openSnackBar, type, message, setSnackBar, setOpenSnackBar } = useSnackBar();
     const {sendWait, setSendWait} = useWaits();
     const [firstName, setFirstName] = useState('');
     const [lastName, setLastName] = useState('');
     const [email, setEmail] = useState('');
     const [phoneCode, setPhoneCode] = useState('');
     const [phoneNumber, setPhoneNumber] = useState('');
     const [birthDate, setBirthDate] = useState('');
     const [password, setPassword] = useState('');
     const [passwordConfirmation, setPasswordConfirmation] = useState('');
     const navigate = useNavigate();

     const handleChange = (value, country, e, formattedValue) => {
          console.log("Full value:", value);
          console.log("Formatted:", formattedValue);
          console.log("Country object:", country);
          console.log("Dial code:", country.dialCode);

          const numberWithoutCode = value.replace(country.dialCode, "");
          console.log("Number without code:", numberWithoutCode);
          setPhoneCode(country.dialCode);
          setPhoneNumber(numberWithoutCode);
     };

     const register = async () => {
          setSendWait(true);

          const formData = buildRegisterFormData({
               firstName: firstName,
               lastName: lastName,
               phoneCode: phoneCode,
               phoneNumber: phoneNumber,
               birthDate: birthDate,
               email: email,
               password: password,
               passwordConfirmation: passwordConfirmation,
               accountRole: "teacher"
          });

          let result = await Fetch(host + '/register', 'POST', formData);

          if (result.status == 200) {
               localStorage.setItem('token', result.data.data.token);
               localStorage.setItem('language', "en");
               navigate('/profile');
          } else if (result.status == 422) {
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
                         <Box sx={{backgroundColor: (theme) => theme.palette.mode === 'dark' ? theme.palette.background.default : '#457b9d'}} className="bg-blue-color w-screen h-screen overflow-auto">
                              <Box sx={{backgroundColor: (theme) => theme.palette.mode === 'dark' ? theme.palette.background.default : 'white', boxShadow: 5}} className="h-screen w-1/2 float-right px-5 max-sm:w-11/12" style={{ borderRadius: "70px 0 0 70px" }}>
                                   <Typography marginTop={10} variant="h5" className="text-center font-bold text-2xl mt-32">Sign Up</Typography>
                                   <Box className="flex justify-between mx-auto mt-10">
                                        <TextField onChange={(e) => setFirstName(e.target.value)} className="w-2/5" id="standard-basic" label="First Name" variant="standard" slotProps={{ htmlInput: { 'className': 'py-5' } }} />
                                        <TextField onChange={(e) => setLastName(e.target.value)} className="w-2/5" id="standard-basic" label="Last Name" variant="standard" />
                                   </Box>
                                   <Box className="flex justify-between mx-auto mt-10 items-center">
                                        <PhoneInput country={'us'} containerStyle={{ width: "40%" }} inputStyle={{ width: '100%' }} onChange={handleChange} />
                                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                                             <DatePicker onChange={(e) => setBirthDate(dayjs(e).format("YYYY-MM-DD"))} className="w-2/5"
                                                  label="Birth Date"
                                             />
                                        </LocalizationProvider>
                                   </Box>
                                   <Box className="flex justify-between mx-auto mt-10">
                                        <TextField onChange={(e) => setEmail(e.target.value)} className="w-2/5" id="standard-basic" label="Email" variant="standard" slotProps={{ htmlInput: { 'className': 'py-5' } }} />
                                        <TextField onChange={(e) => setPassword(e.target.value)} type="password" className="w-2/5" id="standard-basic" label="Password" variant="standard" />
                                   </Box>
                                   <Box className="flex justify-between mx-auto mt-10">
                                        <TextField onChange={(e) => setPasswordConfirmation(e.target.value)} type="password" className="w-2/5" id="standard-basic" label="Password Confirmation" variant="standard" slotProps={{ htmlInput: { 'className': 'py-5' } }} />
                                   </Box>
                                   <Box className="flex justify-between mx-auto mt-3">
                                        <button onClick={register} className="bg-blue-color text-white w-2/3 mt-10 py-1 rounded-lg font-semibold mx-auto">
                                             {
                                                  sendWait ?
                                                       <CircularProgress size={20} className="" color="white" />
                                                       :
                                                       "Register"
                                             }
                                        </button>
                                   </Box>
                                   <Box className=" flex justify-between w-2/3 blue-color cursor-pointer mt-10">
                                        <Box onClick={() => navigate('/login')} className="ml-5">I have an account</Box>
                                   </Box>
                              </Box>
                              <Box className="w-1/2 h-screen float-left relative">
                                   <img src={Image1} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 max-sm:hidden" />
                              </Box>
                              <SnackbarAlert open={openSnackBar} message={message} severity={type} onClose={() => setOpenSnackBar(false)} />
                         </Box>

               }
          </>
     );
}

export default Register;