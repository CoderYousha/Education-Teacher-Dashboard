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

function Options() {
     const host = `${process.env.REACT_APP_LOCAL_HOST}`;
     const language = localStorage.getItem('language');
     const { wait } = useContext(AuthContext);
     const { open, title, description, setDialog, setOpen } = useDialog();
     const { openSnackBar, type, message, setSnackBar, setOpenSnackBar } = useSnackBar();
     const { getWait, setGetWait, sendWait, setSendWait } = useWaits();
     const [question, setQuestion] = useState('');
     const [optionId, setOptionId] = useState('');
     const param = useParams();
     const navigate = useNavigate();

     const getQuestion = async () => {
          let result = await Fetch(host + `/courses/${param.course_id}/exams/${param.exam_id}/show`, 'GET', null);

          if (result.status == 200) {
               setQuestion(result.data.data.questions.find(q => q.id == param.question_id));
               setGetWait(false);
          }
     }

     const deleteOption = async () => {
          setSendWait(true);

          let result = await Fetch(host + `/teacher/courses/exams/questions/options/${optionId}/delete`, 'DELETE');
          
          if(result.status == 200){
               setQuestion(prevQuestion => ({
                    ...prevQuestion,
                    options: prevQuestion.options.filter((item) => item.id !== optionId)
               }));
               setSnackBar('success', 'Deleted Successfully');
               setOpen(false);
          }

          setSendWait(false);
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
                         <Box sx={{backgroundColor: (theme) => theme.palette.mode === 'dark' ? theme.palette.background.default : '#457b9d'}} className="bg-blue-color w-screen h-screen overflow-scroll pb-10 none-view-scroll">
                              <Header />
                              <Box className="text-center pt-10 text-white">
                                   <Typography fontWeight={800} variant="h1">Options</Typography>
                              </Box>
                              <Box className="px-5 mt-12 grid grid-cols-3 gap-x-2 gap-y-2 justify-items-center max-sm:grid-cols-1">
                                   {
                                        question.options.map((option, index) =>
                                             <Card key={index} sx={{ minWidth: 400, maxWidth: 400 }}>
                                                  <CardContent>
                                                       <Typography gutterBottom sx={{ color: 'text.secondary', fontSize: 14 }}>
                                                            Option
                                                       </Typography>
                                                       <Typography variant="h5" component="div">
                                                            {language == 'en' ? option.text_en : option.text_ar}
                                                       </Typography>
                                                       <Box className="my-2"></Box>
                                                       <Typography variant="body2">
                                                            Option Type: {option.is_correct ? 'Correct' : 'InCorrect'}
                                                       </Typography>
                                                  </CardContent>
                                                  <CardActions>
                                                       <Button onClick={() => navigate(`/courses/${param.course_id}/exams/${param.exam_id}/questions/${param.question_id}/update-option/${option.id}`)} size="small">Update</Button>
                                                       <Button size="small" color="error" onClick={() => { setOptionId(option.id); setDialog('Delete Option', 'Are you sure that you want to delete this option?', deleteOption) }}>Delete</Button>
                                                  </CardActions>
                                             </Card>

                                        )
                                   }
                              </Box>
                              <SpeedDial
                                   onClick={() => navigate(`/courses/${param.course_id}/exams/${param.exam_id}/questions/${param.question_id}/create-option`)}
                                   ariaLabel="SpeedDial basic example"
                                   sx={{ position: 'fixed', bottom: 35, right: 16 }}
                                   icon={<AddIcon />}
                              >
                              </SpeedDial>
                              <AlertDialog title={title} description={description} onCancel={() => setOpen(false)} onConfirm={() => { deleteOption() }} wait={sendWait} openDialog={open} />
                         </Box>
               }
               <SnackbarAlert open={openSnackBar} message={message} severity={type} onClose={() => setOpenSnackBar(false)} />
          </>
     );
}

export default Options;