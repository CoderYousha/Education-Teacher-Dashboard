import { Box, Button, CircularProgress, TextField } from "@mui/material";
import Header from "../../components/Header";
import { AsyncPaginate } from "react-select-async-paginate";
import SnackbarAlert from "../../components/SnackBar";
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import { useWaits } from "../../hooks/UseWait";
import { useContext, useEffect, useRef, useState } from "react";
import AuthContext from "../../context/AuthContext";
import Image1 from '../../images/paths/image1.png';
import Fetch from "../../services/Fetch";
import { useParams } from "react-router-dom";
import MultipleSelectChip from "../../components/MultiSelect";
import useSnackBar from "../../hooks/UseSnackBar";
import { buildPathFormData } from "../../helper/PathFormData";

function UpdatePath() {
     const host = `${process.env.REACT_APP_LOCAL_HOST}`;
     const language = localStorage.getItem('language');
     const { wait } = useContext(AuthContext);
     const { getWait, setGetWait, sendWait, setSendWait } = useWaits();
     const { openSnackBar, type, message, setSnackBar, setOpenSnackBar } = useSnackBar();
     const [courses, setCourses] = useState([]);
     const [categories, setCategories] = useState([]);
     const [categoryId, setCategoryId] = useState('');
     const nameEnRef = useRef();
     const nameArRef = useRef();
     const descriptionEnRef = useRef();
     const descriptionArRef = useRef();
     const priceRef = useRef();
     const [image, setImage] = useState('');
     const [selectedCourses, setSelectedCourses] = useState([]);
     const [option, setOption] = useState('');
     const [path, setPath] = useState('');
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

     const loadOptions = async (search, loadedOptions, { page }) => {
          let result = await Fetch(host + '/categories', 'GET', null);

          if (result.status == 200) {
               setCategories(result.data.data.data);
          }
          return {
               options: categories.map(
                    item => ({ value: item.id, label: language == 'ar' ? item.name_ar : item.name_en, })), hasMore: categories.hasNextPage, additional: { page: page + 1, },
          };
     }

     const getCategories = async () => {
          let result = await Fetch(host + '/categories', "GET", null);

          if (result.status == 200) {
               setCategories(result.data.data.data);
          }
     }

     const getCourses = async () => {
          let result = await Fetch(host + `/courses?teacher_id=${localStorage.getItem('id')}`);

          if (result.status == 200) {
               setCourses(result.data.data);
          }
     }

     const getPath = async () => {
          let result = await Fetch(host + `/paths/${param.id}/show`, 'GET', null);

          if (result.status == 200) {
               setPath(result.data.data);
               const ids = result.data.data.courses.map(course => course.id);
               setSelectedCourses(ids);
               setOption({ value: result.data.data.category.id, label: language == 'ar' ? result.data.data.category.name_ar : result.data.data.category.name_en });
          }
     }

     const updatePath = async () => {
          setSendWait(true);

          const formData = buildPathFormData({
               nameEn: nameEnRef.current.value,
               nameAr: nameArRef.current.value,
               descriptionEn: descriptionEnRef.current.value,
               descriptionAr: descriptionArRef.current.value,
               price: priceRef.current.value,
               image: image,
               categoryId: categoryId,
               courses: selectedCourses,
          });

          let result = await Fetch(host + `/teacher/paths/${param.id}/update`, 'POST', formData);

          if (result.status == 200) {
               setSnackBar('success', 'Updated Successfully');
          } else if (result.status == 422) {
               setSnackBar('error', result.data.errors[0]);
          }

          setSendWait(false);
     }

     useEffect(() => {
          const runSequential = async () => {
               try {
                    await getCategories();
                    await getCourses();
                    await getPath();
                    await setGetWait(false);
               } catch (err) {
                    console.log(err);
               }
          }

          runSequential();
     }, []);

     return (
          <>
               {
                    wait || getWait ?
                         <Box className="w-full h-screen relative flex justify-center items-center">
                              <CircularProgress size={70} />
                         </Box>
                         :
                         <Box sx={{backgroundColor: (theme) => theme.palette.mode === 'dark' ? theme.palette.background.default : '#457b9d'}} className="bg-blue-color w-screen h-screen overflow-hidden max-sm:min-h-full">
                              <Header />
                              <Box sx={{backgroundColor: (theme) => theme.palette.mode === 'dark' ? theme.palette.background.default : 'white', boxShadow: 5}} className="w-4/5 h-5/6 rounded-xl absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white">
                                   <Box className='h-full float-left w-1/2 max-sm:hidden'>
                                        <img src={Image1} className='w-1/2 rounded-xl absolute top-1/2 -translate-y-1/2' />
                                   </Box>
                                   <Box className="">
                                        <h1 className='text-2xl font-bold py-10 text-purple-600 max-sm:text-center'>Update Path</h1>
                                        <Box className='overflow-y-scroll h-96 w-1/2 none-view-scroll max-sm:w-full max-sm:text-center'>
                                             <Box className='w-32 h-32 rounded-full mb-2 relative border-2 max-sm:w-24 max-sm:h-24 max-sm:mx-auto'>
                                                  <AddPhotoAlternateIcon className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-gray-500 text-xl -z-10' fontSize='large' />
                                                  <img src={path.image} id='image' className='z-30 w-full h-full rounded-full' />
                                                  <input type='file' accept='image/*' className='w-full h-full opacity-0 absolute top-0' onChange={(e) => { viewImage(e); setImage(e.target.files[0]) }} />
                                             </Box>
                                             <TextField inputRef={nameEnRef} defaultValue={path.name_en} className="w-4/5" id="standard-basic" label="English Name" variant="standard" slotProps={{ htmlInput: { 'className': 'py-5' } }} />
                                             <Box className='py-3'></Box>
                                             <TextField inputRef={nameArRef} defaultValue={path.name_ar} className="w-4/5" id="standard-basic" label="Arabic Name" variant="standard" slotProps={{ htmlInput: { 'className': 'py-5' } }} />
                                             <Box className='py-3'></Box>
                                             <TextField
                                                  inputRef={descriptionEnRef}
                                                  defaultValue={path.description_en}
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
                                                  defaultValue={path.description_ar}
                                                  className='w-4/5'
                                                  id="standard-multiline-static"
                                                  label="Arabic Description"
                                                  multiline
                                                  rows={4}
                                                  variant="standard"
                                             />
                                             <Box className='py-3'></Box>
                                             <Box className='w-4/5'>
                                                  <AsyncPaginate
                                                       className='z-50'
                                                       value={option}
                                                       loadOptions={loadOptions}
                                                       onChange={option => {
                                                            setOption(option);
                                                            setCategoryId(option.value);
                                                       }}
                                                       placeholder="Select Category"
                                                       additional={{ page: 1 }}
                                                  />
                                             </Box>
                                             <Box className='py-3'></Box>
                                             <Box className='w-4/5'>
                                                  <MultipleSelectChip selected={selectedCourses} title="Courses" data={courses} onChange={(value) => setSelectedCourses(value)} />
                                             </Box>
                                             <Box className='py-2'></Box>
                                             <TextField type='number' inputRef={priceRef} defaultValue={path.price} className="w-4/5" id="standard-basic" label="Price" variant="standard" slotProps={{ htmlInput: { 'className': 'py-5' } }} />
                                             <Box className='py-3'></Box>
                                             <Button onClick={updatePath} variant="contained">
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

export default UpdatePath;