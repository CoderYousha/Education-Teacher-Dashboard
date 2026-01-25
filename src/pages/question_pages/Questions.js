import { useContext, useEffect, useState } from "react";
import AuthContext from "../../context/AuthContext";
import { useDialog } from "../../hooks/UseDialog";
import useSnackBar from "../../hooks/UseSnackBar";
import { useWaits } from "../../hooks/UseWait";
import { Box, Button, Card, CardActions, CardContent, CircularProgress, SpeedDial, Typography } from "@mui/material";
import Fetch from "../../services/Fetch";
import { useNavigate, useParams } from "react-router-dom";
import AlertDialog from "../../components/DialogView";
import SnackbarAlert from "../../components/SnackBar";
import Header from "../../components/Header";
import AddIcon from '@mui/icons-material/Add';

function Questions() {
     const host = `${process.env.REACT_APP_LOCAL_HOST}`;
     const language = localStorage.getItem('language');
     const { wait } = useContext(AuthContext);
     const { open, title, description, setDialog, setOpen } = useDialog();
     const { openSnackBar, type, message, setSnackBar, setOpenSnackBar } = useSnackBar();
     const { getWait, setGetWait, sendWait, setSendWait } = useWaits();
     const [exam, setExam] = useState('');
     const [questionId, setQuestionId] = useState('');
     const param = useParams();
     const navigate = useNavigate();

     const getExam = async () => {
          let result = await Fetch(host + `/courses/${param.course_id}/exams/${param.exam_id}/show`, 'GET', null);

          if (result.status == 200) {
               setExam(result.data.data);
               setGetWait(false);
          }
     }

     const deleteQuestion = async () => {
          setSendWait(true);

          let result = await Fetch(host + `/teacher/courses/exams/questions/${questionId}/delete`, 'DELETE', null);
          
          if(result.status == 200){
               setExam(prevExam => ({
                    ...prevExam,
                    questions: prevExam.questions.filter((item) => item.id !== questionId)
               }));
               setOpen(false);
               setSnackBar('success', 'Deleted Successfully');
               setQuestionId(null);
          }

          setSendWait(false);
     }

     useEffect(() => {
          getExam();
     }, []);

     return (
          <>
               {
                    wait || getWait ?
                         <Box className="w-full h-screen relative flex justify-center items-center">
                              <CircularProgress size={70} />
                         </Box>
                         :
                         <Box className="bg-blue-color w-screen h-screen overflow-scroll pb-10 none-view-scroll">
                              <Header />
                              <Box className="text-center pt-10 text-white">
                                   <Typography fontWeight={800} variant="h1">Questions</Typography>
                              </Box>
                              <Box className="px-5 mt-12 grid grid-cols-3 gap-x-2 gap-y-2 justify-items-center max-sm:grid-cols-1">
                                   {
                                        exam.questions.map((question, index) =>
                                             <Card key={index} sx={{ minWidth: 400, maxWidth: 400 }}>
                                                  <CardContent>
                                                       <Typography gutterBottom sx={{ color: 'text.secondary', fontSize: 14 }}>
                                                            Question
                                                       </Typography>
                                                       <Typography variant="h5" component="div">
                                                            {language == 'en' ? question.text_en : question.text_ar}
                                                       </Typography>
                                                       <Box className="my-2"></Box>
                                                       <Typography variant="body2">
                                                            Question Type: {question.type == 'multiple_options' ? 'Multiple Options' : 'True or False'}
                                                       </Typography>
                                                       <Box className="my-2"></Box>
                                                       <Typography variant="body2" fontWeight={700}>
                                                            Full Mark: {question.full_mark}
                                                       </Typography>
                                                  </CardContent>
                                                  <CardActions>
                                                       <Button size="small" onClick={() => navigate(`/courses/${param.course_id}/exams/${param.exam_id}/questions/${question.id}/options`)}>Options</Button>
                                                       <Button size="small" onClick={() => navigate(`/courses/${param.course_id}}/exams/${param.exam_id}/update-question/${question.id}`)}>Update</Button>
                                                       <Button size="small" color="error" onClick={() => { setQuestionId(question.id); setDialog('Delete Exam', 'Are you sure that you want to delete this question?', deleteQuestion) }}>Delete</Button>
                                                  </CardActions>
                                             </Card>

                                        )
                                   }
                              </Box>
                              <SpeedDial
                                   onClick={() => navigate(`/courses/${param.course_id}/exams/${param.exam_id}/create-question`)}
                                   ariaLabel="SpeedDial basic example"
                                   sx={{ position: 'fixed', bottom: 35, right: 16 }}
                                   icon={<AddIcon />}
                              >
                              </SpeedDial>
                              <AlertDialog title={title} description={description} onCancel={() => setOpen(false)} onConfirm={() => { deleteQuestion() }} wait={sendWait} openDialog={open} />
                         </Box>
               }
               <SnackbarAlert open={openSnackBar} message={message} severity={type} onClose={() => setOpenSnackBar(false)} />
          </>
     );
}

export default Questions;