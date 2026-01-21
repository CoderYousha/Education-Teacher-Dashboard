import { useContext, useEffect, useRef, useState } from "react";
import AuthContext from "../../context/AuthContext";
import { useNavigate, useParams } from "react-router-dom";
import Fetch from "../../services/Fetch";
import { Box, Button, CircularProgress, major, TextField } from "@mui/material";
import Header from "../../components/Header";
import { AsyncPaginate } from "react-select-async-paginate";
import MultipleSelectChip from "../../components/MultiSelect";
import SnackbarAlert from "../../components/SnackBar";
import Image1 from '../../images/courses/image1.jpg';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';

function UpdateCourse() {
     const host = `${process.env.REACT_APP_LOCAL_HOST}`;
     const { wait } = useContext(AuthContext);
     const [message, setMessage] = useState('');
     const [type, setType] = useState('');
     const [open, setOpen] = useState(false);
     const [getWait, setGetWait] = useState(true);
     const [sendWait, setSendWait] = useState(false);
     const [option, setOption] = useState('');
     const language = localStorage.getItem('language');
     const [course, setCourse] = useState('');
     const [majors, setMajors] = useState([]);
     const [categories, setCategories] = useState([]);
     const [selectedMajors, setSelectedMajors] = useState([]);
     const [image, setImage] = useState('');
     const nameEnRef = useRef();
     const nameArRef = useRef();
     const descriptionEnRef = useRef();
     const descriptionArRef = useRef();
     const [categoryId, setCategoryId] = useState('');
     const navigate = useNavigate();
     const param = useParams();

     function setSnackBar(type, message) {
          setOpen(true);
          setType(type);
          setMessage(message);
     }

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

     const getMajors = async () => {
          let result = await Fetch(host + '/majors', "GET", null);

          if (result.status == 200) {
               setMajors(result.data.data);
          }
     }

     const getCourse = async () => {
          let result = await Fetch(host + `/courses/${param.id}/show`, 'GET', null);

          if (result.status == 200) {
               setCourse(result.data.data);
               setCategoryId(result.data.data.category.id);
               const ids = result.data.data.majors.map(major => major.id);
               setSelectedMajors(ids);
               setOption({ value: result.data.data.category.id, label: language == 'ar' ? result.data.data.category.name_ar : result.data.data.category.name_en });
          }
     }

     const updateCourse = async () => {
          setSendWait(true);

          const formData = new FormData();
          formData.append('name_en', nameEnRef.current.value);
          formData.append('name_ar', nameArRef.current.value);
          formData.append('description_en', descriptionEnRef.current.value);
          formData.append('description_ar', descriptionArRef.current.value);
          formData.append('image', image);
          formData.append('category_id', categoryId);
          selectedMajors.forEach((id) => { formData.append('major_ids[]', id); });

          let result = await Fetch(host + `/teacher/courses/${param.id}/update`, 'POST', formData);

          if(result.status == 200){
               setSnackBar('success', 'Updated Successfully');
          }else if(result.status == 422){
               setSnackBar('error', result.data.errors[0]);
          }

          setSendWait(false);
     }

     useEffect(() => {
          const runSequential = async () => {
               try {
                    await getCategories();
                    await getMajors();
                    await getCourse();
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
                         <Box className="bg-blue-color w-screen h-screen overflow-hidden">
                              <Header />
                              <Box className="w-4/5 h-5/6 rounded-xl absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white">
                                   <Box className='h-full float-left w-1/2'>
                                        <img src={Image1} className='w-1/2 rounded-xl absolute top-1/2 -translate-y-1/2' />
                                   </Box>
                                   <Box className=''>
                                        <h1 className='text-2xl font-bold py-10 text-purple-600'>Update Your Course</h1>
                                        <Box className='overflow-y-scroll h-96 w-1/2 none-view-scroll'>
                                             <Box className='w-32 h-32 rounded-full mb-2 relative border-2'>
                                                  <AddPhotoAlternateIcon className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-gray-500 text-xl -z-10' fontSize='large' />
                                                  <img src={course.image} id='image' className='z-30 w-full h-full rounded-full' />
                                                  <input type='file' accept='image/*' className='w-full h-full opacity-0 absolute top-0' onChange={(e) => { viewImage(e); setImage(e.target.files[0]) }} />
                                             </Box>
                                             <TextField inputRef={nameEnRef} defaultValue={course.name_en} className="w-4/5" id="standard-basic" label="English Name" variant="standard" slotProps={{ htmlInput: { 'className': 'py-5' } }} />
                                             <Box className='py-3'></Box>
                                             <TextField inputRef={nameArRef} defaultValue={course.name_ar} className="w-4/5" id="standard-basic" label="Arabic Name" variant="standard" slotProps={{ htmlInput: { 'className': 'py-5' } }} />
                                             <Box className='py-3'></Box>
                                             <TextField
                                                  inputRef={descriptionEnRef}
                                                  defaultValue={course.description_en}
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
                                                  defaultValue={course.description_ar}
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
                                                  <MultipleSelectChip selected={selectedMajors} title="Majors" data={majors} onChange={(value) => setSelectedMajors(value)} />
                                             </Box>
                                             <Box className='py-2'></Box>
                                             <Button onClick={updateCourse} variant="contained">
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
               <SnackbarAlert open={open} message={message} severity={type} onClose={() => setOpen(false)} />
          </>
     );
}

export default UpdateCourse;