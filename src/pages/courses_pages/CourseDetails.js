import { BottomNavigation, BottomNavigationAction, Box, Button, Card, CardActions, CardContent, CircularProgress, SpeedDial, SpeedDialAction, SpeedDialIcon, Typography } from "@mui/material";
import Header from "../../components/Header";
import Image1 from '../../images/tests/image1.png';
import { useContext, useEffect, useState } from "react";
import OndemandVideoIcon from '@mui/icons-material/OndemandVideo';
import AssignmentIcon from '@mui/icons-material/Assignment';
import Fetch from "../../services/Fetch";
import { useParams } from "react-router-dom";
import AuthContext from "../../context/AuthContext";
import ReactPlayer from "react-player";
import AddTaskIcon from '@mui/icons-material/AddTask';
import QueuePlayNextIcon from '@mui/icons-material/QueuePlayNext';


function CourseDetails() {
     const host = `${process.env.REACT_APP_LOCAL_HOST}`;
     const [value, setValue] = useState(0);
     const [course, setCourse] = useState('');
     const param = useParams();
     const { wait } = useContext(AuthContext);
     const [getWait, setGetWait] = useState(true);
     const language = localStorage.getItem('language');

     const actions = [
          { icon: <AddTaskIcon />, name: 'Add Exam' },
          { icon: <QueuePlayNextIcon />, name: 'Add Course' },
     ];

     const getCourse = async () => {
          let result = await Fetch(host + `/courses/${param.id}/show`, 'GET', null);

          if (result.status == 200) {
               setCourse(result.data.data);
               setGetWait(false);
          }
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
                                        <Box className="w-1/2 h-fit mx-auto mt-12">
                                             <ReactPlayer src="http://72.60.32.52:84/storage/files/courses/2/syntax.mp4" controls={true}
                                                  width="100%"
                                                  height="100%" />
                                             <Typography className="text-white" variant="h4">{language == 'en' ? content.content.name_en : content.content.name_ar}</Typography>
                                        </Box>
                                   )
                              }
                              {
                                   value == 1 &&
                                   <Box className="grid grid-cols-3 gap-x-2 justify-items-center">
                                        {
                                             course.contents.map((content, index) =>
                                                  content.content_type == "Exam" &&
                                                  <Card sx={{ minWidth: 275 }}>
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
                                                            <Button size="small">Learn More</Button>
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
                         </Box>
               }
          </>
     );
}

export default CourseDetails;