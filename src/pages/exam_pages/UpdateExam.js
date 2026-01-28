import { useContext, useEffect, useRef, useState } from "react";
import AuthContext from "../../context/AuthContext";
import { useParams } from "react-router-dom";
import Fetch from "../../services/Fetch";
import { Box, Button, CircularProgress, TextField } from "@mui/material";
import Header from "../../components/Header";
import SnackbarAlert from "../../components/SnackBar";
import Image1 from "../../images/exams/image1.png";
import useSnackBar from "../../hooks/UseSnackBar";
import { useWaits } from "../../hooks/UseWait";
import { buildExamFormData } from "../../helper/ExamFormData";

function UpdateExam() {
     const host = `${process.env.REACT_APP_LOCAL_HOST}`;
     const { wait } = useContext(AuthContext);
     const { openSnackBar, type, message, setSnackBar, setOpenSnackBar } = useSnackBar();
     const { sendWait, setSendWait, getWait, setGetWait } = useWaits();
     const [exam, setExam] = useState('');
     const nameArRef = useRef();
     const nameEnRef = useRef();
     const descriptionEnRef = useRef();
     const descriptionArRef = useRef();
     const param = useParams();

     const getExam = async () => {
          setGetWait(true);

          let result = await Fetch(host + `/courses/${param.course_id}/exams/${param.exam_id}/show`, "GET");
          if (result.status == 200) {
               setExam(result.data.data);
          }

          setGetWait(false);
     }

     const updateExam = async () => {
          setSendWait(true);

          const formData = buildExamFormData({
               nameEn: nameEnRef.current.value,
               nameAr: nameArRef.current.value,
               descriptionEn: descriptionEnRef.current.value,
               descriptionAr: descriptionArRef.current.value,
               courseId: param.course_id
          });

          let result = await Fetch(host + `/teacher/courses/exams/${param.exam_id}/update`, "POST", formData);

          if (result.status == 200) {
               setSnackBar('success', "Updated Successfully");
          } else if (result.status == 422) {
               setSnackBar('error', result.data.errors[0]);
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
                         <Box sx={{backgroundColor: (theme) => theme.palette.mode === 'dark' ? theme.palette.background.default : '#457b9d'}} className="bg-blue-color w-screen h-screen overflow-hidden">
                              <Header />
                              <Box sx={{backgroundColor: (theme) => theme.palette.mode === 'dark' ? theme.palette.background.default : 'white', boxShadow: 5}} className="w-4/5 h-5/6 rounded-xl absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white max-sm:h-fit">
                                   <Box className='h-full float-left w-1/2 max-sm:hidden'>
                                        <img src={Image1} className='w-1/2 rounded-xl absolute top-1/2 -translate-y-1/2' />
                                   </Box>
                                   <Box className=''>
                                        <h1 className='text-2xl font-bold py-10 text-purple-600 max-sm:text-center'>Update Exam</h1>
                                        <Box className='overflow-y-scroll h-96 w-1/2 none-view-scroll max-sm:mx-auto max-sm:h-fit max-sm:pb-3 max-sm:w-full max-sm:flex max-sm:flex-col max-sm:items-center'>
                                             <TextField inputRef={nameEnRef} defaultValue={exam.name_en} className="w-4/5" id="standard-basic" label="English Name" variant="standard" slotProps={{ htmlInput: { 'className': 'py-5' } }} />
                                             <Box className='py-3'></Box>
                                             <TextField inputRef={nameArRef} defaultValue={exam.name_ar} className="w-4/5" id="standard-basic" label="Arabic Name" variant="standard" slotProps={{ htmlInput: { 'className': 'py-5' } }} />
                                             <Box className='py-3'></Box>
                                             <TextField
                                                  inputRef={descriptionEnRef}
                                                  defaultValue={exam.description_en}
                                                  className='w-4/5'
                                                  id="standard-multiline-static"
                                                  label="English Description"
                                                  multiline
                                                  rows={4}
                                                  variant="standard"
                                             />
                                             <Box className='py-3'></Box>
                                             <TextField
                                                  inputRef={descriptionArRef}
                                                  defaultValue={exam.description_ar}
                                                  className='w-4/5'
                                                  id="standard-multiline-static"
                                                  label="Arabic Description"
                                                  multiline
                                                  rows={4}
                                                  variant="standard"
                                             />
                                             <Box className='py-2'></Box>
                                             <Button onClick={updateExam} variant="contained">
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

export default UpdateExam;