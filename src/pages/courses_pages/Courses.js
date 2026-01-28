import { useContext, useEffect, useState } from "react";
import CoursesHeader from "../../components/CoursesHeader";
import AuthContext from "../../context/AuthContext";
import { Box, Button, Card, CardActions, CardContent, CardMedia, CircularProgress, Typography } from "@mui/material";
import Fetch from "../../services/Fetch";
import { useNavigate } from "react-router-dom";
import AlertDialog from "../../components/DialogView";
import SnackbarAlert from "../../components/SnackBar";
import { useDialog } from "../../hooks/UseDialog";
import useSnackBar from "../../hooks/UseSnackBar";
import { useWaits } from "../../hooks/UseWait";

function Courses() {
     const host = `${process.env.REACT_APP_LOCAL_HOST}`;
     const language = localStorage.getItem('language');
     const { wait } = useContext(AuthContext);
     const {open, title, description, setDialog, setOpen} = useDialog();
     const {openSnackBar, type, message, setSnackBar, setOpenSnackBar} = useSnackBar();
     const {getWait, setGetWait, searchWait, setSearchWait, sendWait, setSendWait} = useWaits();
     const [courses, setCourses] = useState([]);
     const [categories, setCategories] = useState([]);
     const [categoryId, setCategoryId] = useState('');
     const [search, setSearch] = useState('');
     const [courseId, setCourseId] = useState('');
     const navigate = useNavigate();

     const getCategories = async () => {
          let result = await Fetch(host + '/categories', "GET", null);

          if (result.status == 200) {
               setCategories(result.data.data.data);
          }
     }

     const getCourses = async () => {
          setSearchWait(true);

          let result;
          if (!categoryId) {
               result = await Fetch(host + `/courses?teacher_id=${localStorage.getItem('id')}&search=${search}`);
          } else {
               result = await Fetch(host + `/courses?teacher_id=${localStorage.getItem('id')}&category_id=${categoryId}&search=${search}`);
          }

          if (result.status == 200) {
               setCourses(result.data.data);
          }

          setSearchWait(false);
     }

     const deleteCourse = async () => {
          setSendWait(true);

          let result = await Fetch(host + `/teacher/courses/${courseId}/delete`, 'DELETE', null);

          if (result.status == 200) {
               setCourses(prevCourses => prevCourses.filter(course => course.id !== courseId));
               setOpen(false);
               setSnackBar('success','Deleted Successfully');
               setCourseId(null);
          }


          setSendWait(false);
     }

     useEffect(() => {
          getCategories();
          getCourses();
          setGetWait(false);
     }, []);

     useEffect(() => {
          getCourses();
     }, [categoryId, search]);

     return (
          <>
               {
                    wait || getWait ?
                         <Box className="w-full h-screen relative flex justify-center items-center">
                              <CircularProgress size={70} />
                         </Box>
                         :
                         <Box sx={{backgroundColor: (theme) => theme.palette.mode === 'dark' ? theme.palette.background.default : '#457b9d'}} className="bg-blue-color w-screen h-screen overflow-x-hidden relative none-view-scroll">
                              <CoursesHeader onClick={(value) => setSearch(value)} onChange={(value) => setCategoryId(value)} selected={categoryId} data={categories} />
                              <Box className="w-full absolute right-0 mt-44 grid grid-cols-3 gap-y-5 max-sm:grid-cols-1 justify-items-center">
                                   {
                                        searchWait ?
                                             <Box className="w-full absolute flex justify-center items-center">
                                                  <CircularProgress style={{ color: "white" }} size={70} />
                                             </Box>
                                             :
                                             <>
                                                  {
                                                       courses.map((course, index) =>
                                                            <Card key={index} sx={{ maxWidth: 345, minWidth: 345, borderRadius: 3 }}>
                                                                 <CardMedia
                                                                      component="img"
                                                                      sx={{ height: 140, objectFit: "fill" }}
                                                                      image={course.image}
                                                                      title={course.name_en}
                                                                 />
                                                                 <CardContent>
                                                                      <Typography gutterBottom variant="h5" component="div">
                                                                           {language == 'en' ? course.name_en : course.name_ar}
                                                                      </Typography>
                                                                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                                                           {language == 'en' ? course.description_en : course.description_ar}
                                                                      </Typography>
                                                                 </CardContent>
                                                                 <CardActions>
                                                                      <Button onClick={() => navigate(`/course-details/${course.id}`)} size="small">View</Button>
                                                                      <Button onClick={() => navigate(`/update-course/${course.id}`)} size="small">Update</Button>
                                                                      <Button size="small" color="error" onClick={() => { setCourseId(course.id); setDialog('Delete Course', 'Are you sure that you want to delete this course?') }}>Delete</Button>
                                                                 </CardActions>
                                                            </Card>
                                                       )
                                                  }
                                             </>
                                   }
                              </Box>
                              <AlertDialog title={title} description={description} onCancel={() => setOpen(false)} onConfirm={deleteCourse} wait={sendWait} openDialog={open} />
                         </Box>
               }
               <SnackbarAlert open={openSnackBar} message={message} severity={type} onClose={() => setOpenSnackBar(false)} />
          </>
     );
}

export default Courses;