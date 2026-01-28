import { useContext, useState } from "react";
import AuthContext from "../../context/AuthContext";
import useSnackBar from "../../hooks/UseSnackBar";
import { useWaits } from "../../hooks/UseWait";
import { Box, Button, CircularProgress, TextField } from "@mui/material";
import Header from "../../components/Header";
import { useNavigate, useParams } from "react-router-dom";
import Image1 from '../../images/questions/image1.png';
import SnackbarAlert from "../../components/SnackBar";
import BasicSelect from "../../components/Select";
import { buildQuestionFormData } from "../../helper/QuestionFormData";
import Fetch from "../../services/Fetch";

function CreateQuestion() {
     const host = `${process.env.REACT_APP_LOCAL_HOST}`;
     const { wait } = useContext(AuthContext);
     const { openSnackBar, type, message, setSnackBar, setOpenSnackBar } = useSnackBar();
     const { sendWait, setSendWait } = useWaits();
     const [textEn, setTextEn] = useState('');
     const [textAr, setTextAr] = useState('');
     const [questionType, setQuestionType] = useState('');
     const [fullMark, setFullMark] = useState('');
     const param = useParams();
     const navigate = useNavigate();

     const createQuestion = async () => {
          setSendWait(true);

          const formData = buildQuestionFormData({
               textEn: textEn,
               textAr: textAr,
               questionType: questionType,
               fullMark: fullMark,
               examId: param.exam_id,
          });

          let result = await Fetch(host + '/teacher/courses/exams/questions/store', 'POST', formData);

          if(result.status == 200){
               navigate(`/courses/${param.course_id}/exams/${param.exam_id}/questions`);
          }else if(result.status == 422){
               setSnackBar('error', result.data.errors[0]);
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
                         <Box sx={{backgroundColor: (theme) => theme.palette.mode === 'dark' ? theme.palette.background.default : '#457b9d'}} className="bg-blue-color w-screen h-screen overflow-hidden">
                              <Header />
                              <Box sx={{backgroundColor: (theme) => theme.palette.mode === 'dark' ? theme.palette.background.default : 'white', boxShadow: 5}} className="w-4/5 h-5/6 rounded-xl absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white max-sm:h-fit">
                                   <Box className='h-full float-left w-1/2 max-sm:hidden'>
                                        <img src={Image1} className='w-1/2 rounded-xl absolute top-1/2 -translate-y-1/2' />
                                   </Box>
                                   <Box className=''>
                                        <h1 className='text-2xl font-bold py-10 text-purple-600 max-sm:text-center'>Add New Question</h1>
                                        <Box className='overflow-y-scroll h-96 w-1/2 none-view-scroll max-sm:mx-auto max-sm:h-fit max-sm:pb-3 max-sm:w-full max-sm:flex max-sm:flex-col max-sm:items-center'>
                                             <TextField
                                                  onChange={(e) => setTextEn(e.target.value)}
                                                  className='w-4/5'
                                                  id="standard-multiline-static"
                                                  label="English Question"
                                                  multiline
                                                  rows={4}
                                                  variant="standard"
                                             />
                                             <Box className='py-3'></Box>
                                             <TextField
                                                  onChange={(e) => setTextAr(e.target.value)}
                                                  className='w-4/5'
                                                  id="standard-multiline-static"
                                                  label="Arabic Question"
                                                  multiline
                                                  rows={4}
                                                  variant="standard"
                                             />
                                             <Box className='py-2'></Box>
                                             <Box className="w-4/5">
                                                  <BasicSelect title="Question Type" names={['Multiple Options', 'True or False']} values={['multiple_options', 'true_false']} onChange={(value) => setQuestionType(value)} />
                                             </Box>
                                             <Box className='py-2'></Box>
                                             <TextField
                                                  onChange={(e) => setFullMark(e.target.value)}
                                                  className='w-4/5'
                                                  id="standard"
                                                  label="Full Mark"
                                                  variant="standard"
                                                  type="number"
                                             />
                                             <Box className='py-2'></Box>
                                             <Button onClick={createQuestion} variant="contained">
                                                  {
                                                       sendWait ?
                                                            <CircularProgress size={20} className="" color="white" />
                                                            :
                                                            "Create"
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

export default CreateQuestion;