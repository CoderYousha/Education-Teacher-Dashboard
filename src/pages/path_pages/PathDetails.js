import { useContext, useEffect, useState } from "react";
import AuthContext from "../../context/AuthContext";
import { Box, Button, Card, CardActions, CardContent, CardMedia, CircularProgress, Typography } from "@mui/material";
import Fetch from "../../services/Fetch";
import { useNavigate, useParams } from "react-router-dom";
import SnackbarAlert from "../../components/SnackBar";
import useSnackBar from "../../hooks/UseSnackBar";
import { useWaits } from "../../hooks/UseWait";
import Header from "../../components/Header";

function PathDetails() {
     const host = `${process.env.REACT_APP_LOCAL_HOST}`;
     const language = localStorage.getItem('language');
     const { wait } = useContext(AuthContext);
     const { openSnackBar, type, message, setSnackBar, setOpenSnackBar } = useSnackBar();
     const { getWait, setGetWait, sendWait, setSendWait } = useWaits();
     const [path, setPath] = useState();
     const navigate = useNavigate();
     const param = useParams();

     const getPath = async () => {
          let result = await Fetch(host+ `/paths/${param.id}/show`);

          if(result.status == 200){
               setPath(result.data.data);
          }

          setGetWait(false);
     }

     useEffect(() => {
          getPath();
     }, []);

     return (
          <>
               {
                    wait || getWait ?
                         <Box className="w-full h-screen relative flex justify-center items-center">
                              <CircularProgress size={70} />
                         </Box>
                         :
                         <Box sx={{backgroundColor: (theme) => theme.palette.mode === 'dark' ? theme.palette.background.default : '#457b9d'}} className="bg-blue-color w-screen h-screen overflow-x-hidden relative none-view-scroll">
                              <Header />
                              <Box className="w-full absolute right-0 mt-44 grid grid-cols-3 gap-y-5 max-sm:grid-cols-1 justify-items-center">
                                   {
                                        path.courses.map((course, index) =>
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
                                                  </CardActions>
                                             </Card>
                                        )
                                   }
                              </Box>
                         </Box>
               }
               <SnackbarAlert open={openSnackBar} message={message} severity={type} onClose={() => setOpenSnackBar(false)} />
          </>
     );
}

export default PathDetails;