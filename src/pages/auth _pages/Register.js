import { CircularProgress, TextField } from "@mui/material";
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

function Register() {
     const host = `${process.env.REACT_APP_LOCAL_HOST}`;
     const navigate = useNavigate();
     const [message, setMessage] = useState('');
     const [type, setType] = useState('');
     const [open, setOpen] = useState(false);
     const [firstName, setFirstName] = useState('');
     const [lastName, setLastName] = useState('');
     const [email, setEmail] = useState('');
     const [phoneCode, setPhoneCode] = useState('');
     const [phoneNumber, setPhoneNumber] = useState('');
     const [birthDate, setBirthDate] = useState('');
     const [password, setPassword] = useState('');
     const [passwordConfirmation, setPasswordConfirmation] = useState('');
     const [sendWait, setSendWait] = useState(false);
     const { wait } = useContext(AuthContext);

     function setSnackBar(type, message) {
          setOpen(true);
          setType(type);
          setMessage(message);
     }

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

          const formData = new FormData();
          formData.append('first_name', firstName);
          formData.append('last_name', lastName);
          formData.append('phone_code', phoneCode);
          formData.append('phone', phoneNumber);
          formData.append('birth_date', birthDate);
          formData.append('email', email);
          formData.append('password', password);
          formData.append('password_confirmation', passwordConfirmation);
          formData.append('account_role', 'teacher');

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
                         <div className="w-full h-screen relative flex justify-center items-center">
                              <CircularProgress size={70} />
                         </div>
                         :
                         <section className="bg-blue-color w-screen h-screen overflow-auto">
                              <div className="bg-white h-screen w-1/2 float-right px-5 max-sm:w-11/12" style={{ borderRadius: "70px 0 0 70px" }}>
                                   <h1 className="text-center font-bold text-2xl mt-32">Sign Up</h1>
                                   <div className="flex justify-between mx-auto mt-10">
                                        <TextField onChange={(e) => setFirstName(e.target.value)} className="w-2/5" id="standard-basic" label="First Name" variant="standard" slotProps={{ htmlInput: { 'className': 'py-5' } }} />
                                        <TextField onChange={(e) => setLastName(e.target.value)} className="w-2/5" id="standard-basic" label="Last Name" variant="standard" />
                                   </div>
                                   <div className="flex justify-between mx-auto mt-10 items-center">
                                        <PhoneInput country={'us'} containerStyle={{ width: "40%" }} inputStyle={{ width: '100%' }} onChange={handleChange} />
                                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                                             <DatePicker onChange={(e) => setBirthDate(dayjs(e).format("YYYY-MM-DD"))} className="w-2/5"
                                                  label="Birth Date"
                                             />
                                        </LocalizationProvider>
                                   </div>
                                   <div className="flex justify-between mx-auto mt-10">
                                        <TextField onChange={(e) => setEmail(e.target.value)} className="w-2/5" id="standard-basic" label="Email" variant="standard" slotProps={{ htmlInput: { 'className': 'py-5' } }} />
                                        <TextField onChange={(e) => setPassword(e.target.value)} type="password" className="w-2/5" id="standard-basic" label="Password" variant="standard" />
                                   </div>
                                   <div className="flex justify-between mx-auto mt-10">
                                        <TextField onChange={(e) => setPasswordConfirmation(e.target.value)} type="password" className="w-2/5" id="standard-basic" label="Password Confirmation" variant="standard" slotProps={{ htmlInput: { 'className': 'py-5' } }} />
                                   </div>
                                   <div className="flex justify-between mx-auto mt-3">
                                        <button onClick={register} className="bg-blue-color text-white w-2/3 mt-10 py-1 rounded-lg font-semibold mx-auto">
                                             {
                                                  sendWait ?
                                                       <CircularProgress size={20} className="" color="white" />
                                                       :
                                                       "Register"
                                             }
                                        </button>
                                   </div>
                                   <div className=" flex justify-between w-2/3 blue-color cursor-pointer mt-10">
                                        <div onClick={() => navigate('/login')} className="ml-5">I have an account</div>
                                   </div>
                              </div>
                              <div className="w-1/2 h-screen float-left relative">
                                   <img src={Image1} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 max-sm:hidden" />
                              </div>
                              <SnackbarAlert open={open} message={message} severity={type} onClose={() => setOpen(false)} />
                         </section>

               }
          </>
     );
}

export default Register;