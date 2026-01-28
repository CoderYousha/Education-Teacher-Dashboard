import { useContext, useEffect, useRef, useState } from "react";
import AuthContext from "../../context/AuthContext";
import useSnackBar from "../../hooks/UseSnackBar";
import { useWaits } from "../../hooks/UseWait";
import { Box, Button, CircularProgress, TextField } from "@mui/material";
import Header from "../../components/Header";
import { useParams } from "react-router-dom";
import Image1 from '../../images/questions/image1.png';
import SnackbarAlert from "../../components/SnackBar";
import BasicSelect from "../../components/Select";
import { buildQuestionFormData } from "../../helper/QuestionFormData";
import Fetch from "../../services/Fetch";

function UpdateQuestion() {
     const host = `${process.env.REACT_APP_LOCAL_HOST}`;
     const { wait } = useContext(AuthContext);
     const { openSnackBar, type, message, setSnackBar, setOpenSnackBar } = useSnackBar();
     const { sendWait, setSendWait, setGetWait, getWait } = useWaits();
     const [question, setQuestion] = useState('');
     const textEnRef = useRef();
     const textArRef = useRef();
     const [questionType, setQuestionType] = useState('');
     const fullMarkRef = useRef();
     const param = useParams();

     const updateQuestion = async () => {
          setSendWait(true);
          const formData = buildQuestionFormData({
               textEn: textEnRef.current.value,
               textAr: textArRef.current.value,
               questionType: questionType,
               fullMark: fullMarkRef.current.value,
          });

          let result = await Fetch(host + `/teacher/courses/exams/questions/${param.question_id}/update`, 'POST', formData);

          if(result.status == 200){
               setSnackBar('success', 'Updated Successfully');
          }else if(result.status == 422){
               setSnackBar('error', result.data.errors[0]);
          }

          setSendWait(false);
     }

     const getQuestion = async () => {
          let result = await Fetch(host + `/courses/${param.course_id}/exams/${param.exam_id}/show`, 'GET', null);

          if (result.status == 200) {
               setQuestion(result.data.data.questions.find(q => q.id == param.question_id));
               
               setGetWait(false);
          }
     }

     useEffect(() => {
          getQuestion();
     }, []);

     return (
          <>
               {
                    wait || getWait ?
                         <Box className="w-full h-screen relative flex justify-center items-center">
                              <CircularProgress size={70} />
                         </Box>
                         :
                         <Box sx={{backgroundColor: (theme) => theme.palette.mode === 'dark' ? theme.palette.background.default : '#457b9d'}} className="bg-blue-color w-screen h-screen overflow-hidden">
                              <Header />
                              <Box sx={{backgroundColor: (theme) => theme.palette.mode === 'dark' ? theme.palette.background.default : 'white', boxShadow: 5}} className="w-4/5 h-5/6 rounded-xl absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white max-sm:h-fit">
                                   <Box className='h-full float-left w-1/2 max-sm:hidden'>
                                        <img src={Image1} className='w-1/2 rounded-xl absolute top-1/2 -translate-y-1/2' />
                                   </Box>
                                   <Box className=''>
                                        <h1 className='text-2xl font-bold py-10 text-purple-600 max-sm:text-center'>Update Question</h1>
                                        <Box className='overflow-y-scroll h-96 w-1/2 none-view-scroll max-sm:mx-auto max-sm:h-fit max-sm:pb-3 max-sm:w-full max-sm:flex max-sm:flex-col max-sm:items-center'>
                                             <TextField
                                                  inputRef={textEnRef}
                                                  defaultValue={question.text_en}
                                                  className='w-4/5'
                                                  id="standard-multiline-static"
                                                  label="English Question"
                                                  multiline
                                                  rows={4}
                                                  variant="standard"
                                             />
                                             <Box className='py-3'></Box>
                                             <TextField
                                                  inputRef={textArRef}
                                                  defaultValue={question.text_ar}
                                                  className='w-4/5'
                                                  id="standard-multiline-static"
                                                  label="Arabic Question"
                                                  multiline
                                                  rows={4}
                                                  variant="standard"
                                             />
                                             <Box className='py-2'></Box>
                                             <Box className="w-4/5">
                                                  <BasicSelect selected={question.type} title="Question Type" names={['Multiple Options', 'True or False']} values={['multiple_options', 'true_false']} onChange={(value) => setQuestionType(value)} />
                                             </Box>
                                             <Box className='py-2'></Box>
                                             <TextField
                                                  inputRef={fullMarkRef}
                                                  defaultValue={question.full_mark}
                                                  className='w-4/5'
                                                  id="standard"
                                                  label="Full Mark"
                                                  variant="standard"
                                                  type="number"
                                             />
                                             <Box className='py-2'></Box>
                                             <Button onClick={updateQuestion} variant="contained">
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

export default UpdateQuestion;