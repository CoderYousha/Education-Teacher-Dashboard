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

function Paths() {
     const host = `${process.env.REACT_APP_LOCAL_HOST}`;
     const language = localStorage.getItem('language');
     const { wait } = useContext(AuthContext);
     const {open, title, description, setDialog, setOpen} = useDialog();
     const {openSnackBar, type, message, setSnackBar, setOpenSnackBar} = useSnackBar();
     const {getWait, setGetWait, searchWait, setSearchWait, sendWait, setSendWait} = useWaits();
     const [paths, setPaths] = useState([]);
     const [categories, setCategories] = useState([]);
     const [categoryId, setCategoryId] = useState('');
     const [search, setSearch] = useState('');
     const [pathId, setPathId] = useState('');
     const navigate = useNavigate();

     const getCategories = async () => {
          let result = await Fetch(host + '/categories', "GET", null);

          if (result.status == 200) {
               setCategories(result.data.data.data);
          }
     }

     const getPaths = async () => {
          setSearchWait(true);

          let result;
          if (!categoryId) {
               result = await Fetch(host + `/paths?teacher_id=${localStorage.getItem('id')}&search=${search}`);
          } else {
               result = await Fetch(host + `/paths?teacher_id=${localStorage.getItem('id')}&category_id=${categoryId}&search=${search}`);
          }

          if (result.status == 200) {
               setPaths(result.data.data);
          }

          setSearchWait(false);
     }

     const deletePath = async () => {
          setSendWait(true);

          let result = await Fetch(host + `/teacher/paths/${pathId}/delete`, 'DELETE', null);

          if (result.status == 200) {
               setPaths(prevPaths => prevPaths.filter(path => path.id !== pathId));
               setOpen(false);
               setSnackBar('success','Deleted Successfully');
               setPathId(null);
          }


          setSendWait(false);
     }

     useEffect(() => {
          getCategories();
          getPaths();
          setGetWait(false);
     }, []);

     useEffect(() => {
          getPaths();
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
                                                       paths.map((path, index) =>
                                                            <Card key={index} sx={{ maxWidth: 345, minWidth: 345, borderRadius: 3 }}>
                                                                 <CardMedia
                                                                      component="img"
                                                                      sx={{ height: 140, objectFit: "fill" }}
                                                                      image={path.image}
                                                                      title={path.name_en}
                                                                 />
                                                                 <CardContent>
                                                                      <Typography gutterBottom variant="h5" component="div">
                                                                           {language == 'en' ? path.name_en : path.name_ar}
                                                                      </Typography>
                                                                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                                                           {language == 'en' ? path.description_en : path.description_ar}
                                                                      </Typography>
                                                                 </CardContent>
                                                                 <CardActions>
                                                                      <Button onClick={() => navigate(`/path-details/${path.id}`)} size="small">View</Button>
                                                                      <Button onClick={() => navigate(`/update-path/${path.id}`)} size="small">Update</Button>
                                                                      <Button size="small" color="error" onClick={() => { setPathId(path.id); setDialog('Delete Course', 'Are you sure that you want to delete this course?') }}>Delete</Button>
                                                                 </CardActions>
                                                            </Card>
                                                       )
                                                  }
                                             </>
                                   }
                              </Box>
                              <AlertDialog title={title} description={description} onCancel={() => setOpen(false)} onConfirm={deletePath} wait={sendWait} openDialog={open} />
                         </Box>
               }
               <SnackbarAlert open={openSnackBar} message={message} severity={type} onClose={() => setOpenSnackBar(false)} />
          </>
     );
}

export default Paths;