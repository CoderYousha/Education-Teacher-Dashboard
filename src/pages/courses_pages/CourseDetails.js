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
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';


function CourseDetails() {
     const host = `${process.env.REACT_APP_LOCAL_HOST}`;
     const language = localStorage.getItem('language');
     const { wait } = useContext(AuthContext);
     const { open, title, description, setDialog, setOpen } = useDialog();
     const { openSnackBar, type, message, setSnackBar, setOpenSnackBar } = useSnackBar();
     const { getWait, setGetWait, sendWait, setSendWait } = useWaits();
     const [value, setValue] = useState(parseInt(sessionStorage.getItem('content-window'), 10));
     const [course, setCourse] = useState('');
     const [contentId, setContentId] = useState('');
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

          let result = await Fetch(host + `/teacher/courses/exams/${contentId}/delete`, 'DELETE', null);

          if (result.status == 200) {
               setCourse(prevCourse => ({
                    ...prevCourse,
                    contents: prevCourse.contents.filter((item) => item.content.id !== contentId)
               }));
               setOpen(false);
               setSnackBar('success', 'Deleted Successfully');
               setContentId(null);
          }

          setSendWait(false);
     }

     const deleteFile = async () => {
          setSendWait(true);

          let result = await Fetch(host + `/teacher/courses/files/${contentId}/delete`, 'DELETE', null);

          if (result.status == 200) {
               setCourse(prevCourse => ({
                    ...prevCourse,
                    contents: prevCourse.contents.filter((item) => item.content.id !== contentId)
               }));
               setOpen(false);
               setSnackBar('success', 'Deleted Successfully');
               setContentId(null);
          }

          setSendWait(false);
     }

     useEffect(() => {
          getCourse();
     }, []);

     return (
          <>
               {
                    wait || getWait ?
                         <Box className="w-full h-screen relative flex justify-center items-center">
                              <CircularProgress size={70} />
                         </Box>
                         :
                         <Box sx={{backgroundColor: (theme) => theme.palette.mode === 'dark' ? theme.palette.background.default : '#457b9d'}} className="bg-blue-color w-screen h-screen overflow-scroll pb-20 none-view-scroll">
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
                                        <Box key={index} className="w-1/2 h-fit mx-auto mt-12 relative">
                                             <Box className="absolute top-4 right-4 z-50">
                                                  <DeleteIcon onClick={() => { setContentId(content.content.id); setDialog('Delete Exam', 'Are you sure that you want to delete this exam?') }} className="cursor-pointer text-red-600" />
                                                  <EditIcon onClick = {() => navigate(`update_file/${content.content.id}`)} className="cursor-pointer text-green-600 ml-5" />
                                             </Box>
                                             <ReactPlayer src={content.content.file_url} controls={true}
                                                  width="100%"
                                                  height="100%" />
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
                                                            <Button size="small" color="error" onClick={() => { setContentId(content.content.id); setDialog('Delete Exam', 'Are you sure that you want to delete this exam?') }}>Delete</Button>
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
                              <AlertDialog title={title} description={description} onCancel={() => setOpen(false)} onConfirm={() => { value == 1 ? deleteExam() : deleteFile(); }} wait={sendWait} openDialog={open} />
                         </Box>
               }
               <SnackbarAlert open={openSnackBar} message={message} severity={type} onClose={() => setOpenSnackBar(false)} />
          </>
     );
}

export default CourseDetails;