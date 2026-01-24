import { Box, CircularProgress, TextField, Typography } from "@mui/material";
import Image1 from '../../images/profile/books.png';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import MiniDrawer from "../../components/Drawer";
import BasicSelect from "../../components/Select";
import { useContext, useEffect, useRef, useState } from "react";
import AuthContext from "../../context/AuthContext";
import Fetch from "../../services/Fetch";
import dayjs from "dayjs";
import SnackbarAlert from "../../components/SnackBar";
import Header from "../../components/Header";
import useSnackBar from "../../hooks/UseSnackBar";
import { useWaits } from "../../hooks/UseWait";
import { buildProfileFormData } from "../../helper/ProfileFormData";

function Profile() {
     const host = `${process.env.REACT_APP_LOCAL_HOST}`;
     const { wait } = useContext(AuthContext);
     const { openSnackBar, type, message, setSnackBar, setOpenSnackBar } = useSnackBar();
     const {sendWait, setSendWait, getWait, setGetWait} = useWaits();
     const [profile, setProfile] = useState('');
     const [birthDate, setBirthDate] = useState('');
     const [phoneCode, setPhoneCode] = useState('');
     const [phoneNumber, setPhoneNumber] = useState('');
     const [language, setLanguage] = useState('');
     const firstNameRef = useRef();
     const lastNameRef = useRef();
     const emailRef = useRef();

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

     const getProfile = async () => {
          setGetWait(true);
          let result = await Fetch(host + '/account/get-profile');
          if (result.status == 200) {
               setProfile(result.data.data);
               setBirthDate(result.data.data.birth_date);
               setPhoneCode(result.data.data.phone_code);
               setPhoneNumber(result.data.data.phone);
               setLanguage(result.data.data.language);
          }
          setGetWait(false);
     }

     const updateProfile = async () => {
          setSendWait(true);

          const formData = buildProfileFormData({
               firstName: firstNameRef.current.value,
               lastName: lastNameRef.current.value,
               email: emailRef.current.value,
               phoneCode: phoneCode,
               phoneNumber: phoneNumber,
               birthDate: birthDate,
               language: language,
          });

          let result = await Fetch(host + '/account/update-profile', 'POST', formData);
          if (result.status == 200) {
               setSnackBar('success', 'Updated Successfully');
               localStorage.setItem('language', language);
          } else if (result.status == 422) {
               setSnackBar('error', result.data.errors[0]);
          }

          setSendWait(false);
     }

     useEffect(() => {
          getProfile();
     }, []);

     return (
          <>
               {
                    wait || getWait ?
                         <Box className="w-full h-screen relative flex justify-center items-center">
                              <CircularProgress size={70} />
                         </Box>
                         :
                         <Box className="bg-blue-color w-screen h-screen overflow-hidden">
                              <Header />
                              <Box className="bg-white h-screen w-1/2 float-right px-5 max-sm:w-11/12" style={{ borderRadius: "70px 0 0 70px" }}>
                                   <Typography variant="h4" marginTop={5} className="text-center font-bold text-2xl mt-32">Profile</Typography>
                                   <Box className="flex justify-between mx-auto mt-10">
                                        <TextField inputRef={firstNameRef} defaultValue={profile.first_name} className="w-2/5" id="standard-basic" label="First Name" variant="standard" slotProps={{ htmlInput: { 'className': 'py-5' } }} />
                                        <TextField inputRef={lastNameRef} defaultValue={profile.last_name} className="w-2/5" id="standard-basic" label="Last Name" variant="standard" />
                                   </Box>
                                   <Box className="flex justify-between mx-auto mt-10 items-center">
                                        <PhoneInput value={profile.phone_code + profile.phone} containerStyle={{ width: "40%" }} inputStyle={{ width: '100%' }} onChange={handleChange} />
                                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                                             <DatePicker className="w-2/5"
                                                  label="Birth Date"
                                                  value={dayjs(birthDate)}
                                                  onChange={(e) => setBirthDate(dayjs(e).format("YYYY-MM-DD"))}
                                             />
                                        </LocalizationProvider>
                                   </Box>
                                   <Box className="flex justify-between mx-auto mt-10">
                                        <TextField inputRef={emailRef} defaultValue={profile.email} className="w-2/5" id="standard-basic" label="Email" variant="standard" slotProps={{ htmlInput: { 'className': 'py-5' } }} />
                                        <Box className="w-2/5">
                                             <BasicSelect selected={language} names={["English", "Arabic"]} values={['en', 'ar']} onChange={(value) => setLanguage(value)} title="Language" />
                                        </Box>
                                   </Box>
                                   <Box className="flex justify-between mx-auto mt-3">
                                        <button onClick={updateProfile} className="bg-blue-color text-white w-2/3 mt-10 py-1 rounded-lg font-semibold mx-auto">
                                             {
                                                  sendWait ?
                                                       <CircularProgress size={20} className="" color="white" />
                                                       :
                                                       "Update"
                                             }
                                        </button>
                                   </Box>
                              </Box>
                              <div className="w-1/2 h-screen float-left relative">
                                   <img src={Image1} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 max-sm:hidden" />
                              </div>
                              <MiniDrawer />
                         </Box>
               }
               <SnackbarAlert open={openSnackBar} message={message} severity={type} onClose={() => setOpenSnackBar(false)} />
          </>
     );
}

export default Profile;