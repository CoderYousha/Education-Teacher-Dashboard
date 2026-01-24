import { Box, Button, CircularProgress, TextField } from "@mui/material";
import Header from "../../components/Header";
import { useContext, useState } from "react";
import AuthContext from "../../context/AuthContext";
import Image1 from "../../images/exams/image1.png";
import SnackbarAlert from "../../components/SnackBar";
import { useNavigate, useParams } from "react-router-dom";
import Fetch from "../../services/Fetch";
import useSnackBar from "../../hooks/UseSnackBar";
import { useWaits } from "../../hooks/UseWait";
import { buildExamFormData } from "../../helper/ExamFormData";

function CreateExam() {
     const host = `${process.env.REACT_APP_LOCAL_HOST}`;
     const { wait } = useContext(AuthContext);
     const { openSnackBar, type, message, setSnackBar, setOpenSnackBar } = useSnackBar();
     const {sendWait, setSendWait} = useWaits();
     const [nameEn, setNameEn] = useState('');
     const [nameAr, setNameAr] = useState('');
     const [descriptionEn, setDescriptionEn] = useState('');
     const [descriptionAr, setDescriptionAr] = useState('');
     const param = useParams();
     const navigate = useNavigate();

     const createExam = async () => {
          setSendWait(true);
          
          const formData = buildExamFormData({
               nameEn: nameEn,
               nameAr: nameAr,
               descriptionEn: descriptionEn,
               descriptionAr: descriptionAr,
               courseId: param.id
          });

          let result = await Fetch(host + '/teacher/courses/exams/store', 'POST', formData);

          if (result.status == 200) {
               navigate(`/course-details/${param.id}`);
          } else if (result.status == 422) {
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
                         <Box className="bg-blue-color w-screen h-screen overflow-hidden">
                              <Header />
                              <Box className="w-4/5 h-5/6 rounded-xl absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white max-sm:h-fit">
                                   <Box className='h-full float-left w-1/2 max-sm:hidden'>
                                        <img src={Image1} className='w-1/2 rounded-xl absolute top-1/2 -translate-y-1/2' />
                                   </Box>
                                   <Box className=''>
                                        <h1 className='text-2xl font-bold py-10 text-purple-600 max-sm:text-center'>Add New Exam</h1>
                                        <Box className='overflow-y-scroll h-96 w-1/2 none-view-scroll max-sm:mx-auto max-sm:h-fit max-sm:pb-3 max-sm:w-full max-sm:flex max-sm:flex-col max-sm:items-center'>
                                             <TextField onChange={(e) => setNameEn(e.target.value)} className="w-4/5" id="standard-basic" label="English Name" variant="standard" slotProps={{ htmlInput: { 'className': 'py-5' } }} />
                                             <Box className='py-3'></Box>
                                             <TextField onChange={(e) => setNameAr(e.target.value)} className="w-4/5" id="standard-basic" label="Arabic Name" variant="standard" slotProps={{ htmlInput: { 'className': 'py-5' } }} />
                                             <Box className='py-3'></Box>
                                             <TextField
                                                  onChange={(e) => setDescriptionEn(e.target.value)}
                                                  className='w-4/5'
                                                  id="standard-multiline-static"
                                                  label="English Description"
                                                  multiline
                                                  rows={4}
                                                  variant="standard"
                                             />
                                             <Box className='py-3'></Box>
                                             <TextField
                                                  onChange={(e) => setDescriptionAr(e.target.value)}
                                                  className='w-4/5'
                                                  id="standard-multiline-static"
                                                  label="Arabic Description"
                                                  multiline
                                                  rows={4}
                                                  variant="standard"
                                             />
                                             <Box className='py-2'></Box>
                                             <Button onClick={createExam} variant="contained">
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

export default CreateExam;