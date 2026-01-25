import { useContext, useEffect, useRef, useState } from "react";
import AuthContext from "../../context/AuthContext";
import useSnackBar from "../../hooks/UseSnackBar";
import { useWaits } from "../../hooks/UseWait";
import { useParams } from "react-router-dom";
import Fetch from "../../services/Fetch";
import { Box, Button, Checkbox, CircularProgress, FormControlLabel, TextField } from "@mui/material";
import Header from "../../components/Header";
import SnackbarAlert from "../../components/SnackBar";
import Image1 from '../../images/options/image1.png';
import { buildOptionFormData } from "../../helper/OptionFormData";

function UpdateOption() {
     const host = `${process.env.REACT_APP_LOCAL_HOST}`;
     const { wait } = useContext(AuthContext);
     const { openSnackBar, type, message, setSnackBar, setOpenSnackBar } = useSnackBar();
     const { sendWait, setSendWait, getWait, setGetWait } = useWaits();
     const textArRef = useRef();
     const textEnRef = useRef();
     const [option, setOption] = useState('');
     const [isCorrect, setIsCorrect] = useState('');
     const param = useParams();

     const getOption = async () => {
          let result = await Fetch(host + `/courses/${param.course_id}/exams/${param.exam_id}/show`, 'GET', null);

          if (result.status == 200) {
               const question = result.data.data.questions.find(q => q.id == param.question_id);
               const option = question.options.find(q => q.id == param.option_id);
               setOption(option);
               setIsCorrect(option.is_correct);
               setGetWait(false);
          }

          setGetWait(false);
     }

     const updateOption = async () => {
          setSendWait(true);

          const formData = buildOptionFormData({
               textEn: textEnRef.current.value,
               textAr: textArRef.current.value,
               isCorrect: isCorrect? 1 : 0,
               questionId: param.question_id,
          });

          let result = await Fetch(host + `/teacher/courses/exams/questions/options/${param.option_id}/update`, 'POST', formData);

          if(result.status == 200){
               setSnackBar('success', 'Updated Successfully');
          }else if(result.status == 422){
               setSnackBar('error', result.data.errors[0]);
          }

          setSendWait(false);
     }

     useEffect(() => {
          getOption();
     }, []);

     return (
          <>
               {
                    wait || getWait?
                         <Box className="w-full h-screen relative flex justify-center items-center">
                              <CircularProgress size={70} />
                         </Box>
                         :
                         <Box className="bg-blue-color w-screen h-screen overflow-hidden">
                              <Header />
                              <Box className="w-4/5 h-5/6 rounded-xl absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white max-sm:h-fit">
                                   <Box className='h-full float-left w-1/2 max-sm:hidden'>
                                        <img src={Image1} className='w-1/2 rounded-xl absolute top-1/2 -translate-y-1/2' />
                                   </Box>
                                   <Box className=''>
                                        <h1 className='text-2xl font-bold py-10 text-purple-600 max-sm:text-center'>Add New Option</h1>
                                        <Box className='overflow-y-scroll h-96 w-1/2 none-view-scroll max-sm:mx-auto max-sm:h-fit max-sm:pb-3 max-sm:w-full max-sm:flex max-sm:flex-col max-sm:items-center'>
                                             <TextField
                                                  inputRef={textEnRef}
                                                  defaultValue={option.text_en}
                                                  className='w-4/5'
                                                  id="standard-multiline-static"
                                                  label="English Option"
                                                  multiline
                                                  rows={4}
                                                  variant="standard"
                                             />
                                             <Box className='py-3'></Box>
                                             <TextField
                                                  inputRef={textArRef}
                                                  defaultValue={option.text_ar}
                                                  className='w-4/5'
                                                  id="standard-multiline-static"
                                                  label="Arabic Option"
                                                  multiline
                                                  rows={4}
                                                  variant="standard"
                                             />
                                             <Box className='py-2'></Box>
                                             <FormControlLabel checked={isCorrect} onChange={(e) => setIsCorrect(e.target.checked)} control={<Checkbox />} label="Is Correct?" />
                                             <Box className='py-2'></Box>
                                             <Button onClick={updateOption} variant="contained">
                                                  {
                                                       sendWait ?
                                                            <CircularProgress size={20} className="" color="white" />
                                                            :
                                                            "Update"
                                                  }
                                             </Button>
                                        </Box>
                                   </Box>
                              </Box>
                         </Box>
               }
               <SnackbarAlert open={openSnackBar} message={message} severity={type} onClose={() => setOpenSnackBar(false)} />
          </>
     );
}

export default UpdateOption;