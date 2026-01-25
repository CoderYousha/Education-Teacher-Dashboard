import { useContext, useState } from "react";
import AuthContext from "../../context/AuthContext";
import useSnackBar from "../../hooks/UseSnackBar";
import { useWaits } from "../../hooks/UseWait";
import { Box, Button, CircularProgress, TextField } from "@mui/material";
import Header from "../../components/Header";
import Image1 from '../../images/courses/image1.jpg';
import SnackbarAlert from "../../components/SnackBar";
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import { buildFileFormData } from "../../helper/FileFormData";
import Fetch from "../../services/Fetch";
import { useNavigate, useParams } from "react-router-dom";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { styled } from '@mui/material/styles';

function AddFile() {
     const host = `${process.env.REACT_APP_LOCAL_HOST}`;
     const language = localStorage.getItem('language');
     const { wait } = useContext(AuthContext);
     const { openSnackBar, type, message, setSnackBar, setOpenSnackBar } = useSnackBar();
     const { sendWait, setSendWait } = useWaits();
     const [nameEn, setNameEn] = useState('');
     const [nameAr, setNameAr] = useState('');
     const [file, setFile] = useState('');
     const [thumbnail, setThumbnail] = useState('');
     const navigate = useNavigate();
     const param = useParams();

     function viewImage(event) {
          const previewImage = document.getElementById('image');

          const file = event.target.files[0];
          if (file) {
               const reader = new FileReader();
               reader.addEventListener("load", function () {
                    previewImage.style.display = 'block';
                    previewImage.setAttribute("src", this.result);
               });
               reader.readAsDataURL(file);
          }
     }

     const addFile = async () => {
          setSendWait(true);

          const formData = buildFileFormData({
               nameEn: nameEn,
               nameAr: nameAr,
               file: file,
               thumbnail: thumbnail,
               courseId: param.course_id
          });

          let result = await Fetch(host + '/teacher/courses/files/store', 'POST', formData);

          if (result.status == 200) {
               navigate(`/course-details/${param.course_id}`);
          } else if (result.status == 422) {
               setSnackBar('error', result.data.errors[0]);
          }

          setSendWait(false);
     }

     const VisuallyHiddenInput = styled('input')({
          clip: 'rect(0 0 0 0)',
          clipPath: 'inset(50%)',
          height: 1,
          overflow: 'hidden',
          position: 'absolute',
          bottom: 0,
          left: 0,
          whiteSpace: 'nowrap',
          width: 1,
     });

     return (
          <>
               {
                    wait ?
                         <Box className="w-full h-screen relative flex justify-center items-center">
                              <CircularProgress size={70} />
                         </Box>
                         :
                         <Box className="bg-blue-color w-screen h-screen overflow-hidden max-sm:min-h-full">
                              <Header />
                              <Box className="w-4/5 h-5/6 rounded-xl absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white">
                                   <Box className='h-full float-left w-1/2 max-sm:hidden'>
                                        <img src={Image1} className='w-1/2 rounded-xl absolute top-1/2 -translate-y-1/2' />
                                   </Box>
                                   <Box className="">
                                        <h1 className='text-2xl font-bold py-10 text-purple-600 max-sm:text-center'>Add New File</h1>
                                        <Box className='overflow-y-scroll h-96 w-1/2 none-view-scroll max-sm:w-full max-sm:text-center'>
                                             <Box className='w-32 h-32 rounded-full mb-2 relative border-2 max-sm:w-24 max-sm:h-24 max-sm:mx-auto'>
                                                  <AddPhotoAlternateIcon className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-gray-500 text-xl -z-10' fontSize='large' />
                                                  <img id='image' className='z-30 w-full h-full rounded-full hidden' />
                                                  <input type='file' accept='image/*' className='w-full h-full opacity-0 absolute top-0' onChange={(e) => { viewImage(e); setThumbnail(e.target.files[0]) }} />
                                             </Box>
                                             <TextField onChange={(e) => setNameEn(e.target.value)} className="w-4/5" id="standard-basic" label="English Name" variant="standard" slotProps={{ htmlInput: { 'className': 'py-5' } }} />
                                             <Box className='py-3'></Box>
                                             <TextField onChange={(e) => setNameAr(e.target.value)} className="w-4/5" id="standard-basic" label="Arabic Name" variant="standard" slotProps={{ htmlInput: { 'className': 'py-5' } }} />
                                             <Box className='py-3'></Box>
                                             <Button
                                                  component="label"
                                                  role={undefined}
                                                  variant="contained"
                                                  tabIndex={-1}
                                                  startIcon={<CloudUploadIcon />}
                                             >
                                                  Upload file
                                                  <VisuallyHiddenInput
                                                       type="file"
                                                       onChange={(e) => setFile(e.target.files[0])}
                                                       accept="video/*"
                                                  />
                                             </Button>
                                             <Box className='py-3'></Box>
                                             <Button onClick={addFile} variant="contained">
                                                  {
                                                       sendWait ?
                                                            <CircularProgress size={20} className="" color="white" />
                                                            :
                                                            "Add"
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

export default AddFile;