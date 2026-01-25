import { BottomNavigation, BottomNavigationAction, Box, Button, Card, CardActions, CardContent, CircularProgress, SpeedDial, SpeedDialAction, SpeedDialIcon, Typography } from "@mui/material";
import Header from "../../components/Header";
import { useContext, useEffect, useState } from "react";
import OndemandVideoIcon from '@mui/icons-material/OndemandVideo';
import AssignmentIcon from '@mui/icons-material/Assignment';
import Fetch from "../../services/Fetch";
import { useNavigate, useParams } from "react-router-dom";
import AuthContext from "../../context/AuthContext";
import ReactPlayer from "react-player";
import AddTaskIcon from '@mui/icons-material/AddTask';
import QueuePlayNextIcon from '@mui/icons-material/QueuePlayNext';
import AlertDialog from "../../components/DialogView";
import SnackbarAlert from "../../components/SnackBar";
import { useDialog } from "../../hooks/UseDialog";
import useSnackBar from "../../hooks/UseSnackBar";
import { useWaits } from "../../hooks/UseWait";


function CourseDetails() {
     const host = `${process.env.REACT_APP_LOCAL_HOST}`;
     const language = localStorage.getItem('language');
     const { wait } = useContext(AuthContext);
     const { open, title, description, setDialog, setOpen } = useDialog();
     const { openSnackBar, type, message, setSnackBar, setOpenSnackBar } = useSnackBar();
     const {getWait, setGetWait, sendWait, setSendWait} = useWaits();
     const [value, setValue] = useState(parseInt(sessionStorage.getItem('content-window'), 10));
     const [course, setCourse] = useState('');
     const [examId, setExamId] = useState('');
     const navigate = useNavigate();
     const param = useParams();

     const actions = [
          { icon: <AddTaskIcon />, name: 'Add Exam', path: `/${param.id}/create-exam` },
          { icon: <QueuePlayNextIcon />, name: 'Add Video', path: `/course-details/${param.id}/add-file` },
     ];

     const getCourse = async () => {
          let result = await Fetch(host + `/courses/${param.id}/show`, 'GET', null);

          if (result.status == 200) {
               setCourse(result.data.data);
               setGetWait(false);
          }
     }

     const deleteExam = async () => {
          setSendWait(true);

          let result = await Fetch(host + `/teacher/courses/exams/${examId}/delete`, 'DELETE', null);

          if (result.status == 200) {
               setCourse(prevCourse => ({
                    ...prevCourse,
                    contents: prevCourse.contents.filter((item) => item.content.id !== examId)
               }));
               setOpen(false);
               setSnackBar('success', 'Deleted Successfully');
               setExamId(null);
          }

          setSendWait(false);
     }

     useEffect(() => {
          getCourse();
     }, [course]);

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
                                   <Typography fontWeight={800} variant="h1">{value == 0 ? "Videos" : "Exams"}</Typography>
                              </Box>
                              <Box sx={{ position: "fixed", bottom: 0, width: '100%', zIndex: 100 }}>
                                   <BottomNavigation
                                        showLabels
                                        value={value}
                                        onChange={(event, newValue) => {
                                             setValue(newValue);
                                             sessionStorage.setItem('content-window', newValue);
                                        }}
                                   >
                                        <BottomNavigationAction label="Videos" icon={<OndemandVideoIcon />} />
                                        <BottomNavigationAction label="Exams" icon={<AssignmentIcon />} />
                                   </BottomNavigation>
                              </Box>
                              {
                                   value == 0 &&
                                   course.contents.map((content, index) =>
                                        content.content_type == "CourseFile" &&
                                        <Box key={index} className="w-1/2 h-fit mx-auto mt-12">
                                             <ReactPlayer src="http://72.60.32.52:84/storage/files/courses/2/syntax.mp4" controls={true}
                                                  width="100%"
                                                  height="100%"/>
                                             <Typography className="text-white" variant="h4">{language == 'en' ? content.content.name_en : content.content.name_ar}</Typography>
                                        </Box>
                                   )
                              }
                              {
                                   value == 1 &&
                                   <Box className="mt-12 grid grid-cols-4 gap-x-2 gap-y-2 justify-items-center max-sm:grid-cols-1">
                                        {
                                             course.contents.map((content, index) =>
                                                  content.content_type == "Exam" &&
                                                  <Card key={index} sx={{ minWidth: 275 }}>
                                                       <CardContent>
                                                            <Typography gutterBottom sx={{ color: 'text.secondary', fontSize: 14 }}>
                                                                 Exam
                                                            </Typography>
                                                            <Typography variant="h5" component="div">
                                                                 {language == 'en' ? content.content.name_en : content.content.name_ar}
                                                            </Typography>
                                                            <Typography sx={{ color: 'text.secondary', mb: 1.5 }}></Typography>
                                                            <Typography variant="body2">
                                                                 {language == 'en' ? content.content.description_en : content.content.description_ar}
                                                            </Typography>
                                                       </CardContent>
                                                       <CardActions>
                                                            <Button size="small" onClick={() => navigate(`/courses/${course.id}/exams/${content.content.id}/questions`)}>Questions</Button>
                                                            <Button size="small" onClick={() => navigate(`/course/${param.id}/update-exam/${content.content.id}`)}>Update</Button>
                                                            <Button size="small" color="error" onClick={() => { setExamId(content.content.id); setDialog('Delete Exam', 'Are you sure that you want to delete this exam?', deleteExam) }}>Delete</Button>
                                                       </CardActions>
                                                  </Card>

                                             )
                                        }
                                   </Box>
                              }
                              <SpeedDial
                                   ariaLabel="SpeedDial basic example"
                                   sx={{ position: 'fixed', bottom: 35, right: 16 }}
                                   icon={<SpeedDialIcon />}
                              >
                                   {actions.map((action) => (
                                        <SpeedDialAction
                                             onClick={() => navigate(action.path)}
                                             key={action.name}
                                             icon={action.icon}
                                             slotProps={{
                                                  tooltip: {
                                                       title: action.name,
                                                  },
                                             }}
                                        />
                                   ))}
                              </SpeedDial>
                              <AlertDialog title={title} description={description} onCancel={() => setOpen(false)} onConfirm={() => { value == 1 ? deleteExam() : deleteExam(); }} wait={sendWait} openDialog={open} />
                         </Box>
               }
               <SnackbarAlert open={openSnackBar} message={message} severity={type} onClose={() => setOpenSnackBar(false)} />
          </>
     );
}

export default CourseDetails;