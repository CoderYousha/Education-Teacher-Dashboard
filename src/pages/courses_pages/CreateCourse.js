import { Button, CircularProgress, TextField } from '@mui/material';
import Image1 from '../../images/courses/image1.jpg';
import BasicSelect from "../../components/Select";
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import { AsyncPaginate, useAsyncPaginateBase } from 'react-select-async-paginate';
import { useContext, useEffect, useState } from 'react';
import Fetch from '../../services/Fetch';
import MultipleSelectChip from '../../components/MultiSelect';
import AuthContext from '../../context/AuthContext';
import SnackbarAlert from '../../components/SnackBar';
import SwipeableTemporaryDrawer from '../../components/Drawer';

function CreateCourse() {
     const host = `${process.env.REACT_APP_LOCAL_HOST}`;
     const { wait } = useContext(AuthContext);
     const [message, setMessage] = useState('');
     const [type, setType] = useState('');
     const [open, setOpen] = useState(false);
     const [getWait, setGetWait] = useState(true);
     const [sendWait, setSendWait] = useState(false);
     const [option, setOption] = useState('');
     const language = localStorage.getItem('language');
     const [majors, setMajors] = useState([]);
     const [categories, setCategories] = useState([]);
     const [selectedMajors, setSelectedMajors] = useState('');
     const [image, setImage] = useState('');
     const [nameEn, setNameEn] = useState('');
     const [nameAr, setNameAr] = useState('');
     const [descriptionEn, setDescriptionEn] = useState('');
     const [descriptionAr, setDescriptionAr] = useState('');
     const [categoryId, setCategoryId] = useState('');
     const [majorsId, setMajorsId] = useState([]);

     function setSnackBar(type, message){
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

     const createCourse = async () => {
          setSendWait(true);
          const formData = new FormData();
          formData.append('name_en', nameEn);
          formData.append('name_ar', nameAr);
          formData.append('description_en', descriptionEn);
          formData.append('description_ar', descriptionAr);
          formData.append('image', image);
          formData.append('category_id', categoryId);
          selectedMajors.forEach((id) => { formData.append('major_ids[]', id); });

          let result = await Fetch(host + '/teacher/courses/store', 'POST', formData);

          if(result.status == 200){
               alert("Success");
          }else if(result.status == 422){
               setSnackBar('error', result.data.errors[0]);
          }

          setSendWait(false);
     }

     useEffect(() => {
          getCategories();
          getMajors();
          setGetWait(false);
     }, []);

     return (
          <>
               {
                    wait || getWait ?
                         <div className="w-full h-screen relative flex justify-center items-center">
                              <CircularProgress size={70} />
                         </div>
                         :
                         <section className="bg-blue-color w-screen h-screen overflow-hidden">
                              <SwipeableTemporaryDrawer />
                              <div className="w-4/5 h-5/6 rounded-xl absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white">
                                   <div className='h-full float-left w-1/2'>
                                        <img src={Image1} className='w-1/2 rounded-xl absolute top-1/2 -translate-y-1/2' />
                                   </div>
                                   <div className=''>
                                        <h1 className='text-2xl font-bold py-10 text-purple-600'>Add New Course</h1>
                                        <div className='overflow-y-scroll h-96 w-1/2 none-view-scroll'>
                                             <div className='w-32 h-32 rounded-full mb-2 relative border-2'>
                                                  <AddPhotoAlternateIcon className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-gray-500 text-xl -z-10' fontSize='large' />
                                                  <img id='image' className='z-30 w-full h-full rounded-full hidden' />
                                                  <input type='file' accept='image/*' className='w-full h-full opacity-0 absolute top-0' onChange={(e) => { viewImage(e); setImage(e.target.files[0]) }} />
                                             </div>
                                             <TextField onChange={(e) => setNameEn(e.target.value)} className="w-4/5" id="standard-basic" label="English Name" variant="standard" slotProps={{ htmlInput: { 'className': 'py-5' } }} />
                                             <div className='py-3'></div>
                                             <TextField onChange={(e) => setNameAr(e.target.value)} className="w-4/5" id="standard-basic" label="Arabic Name" variant="standard" slotProps={{ htmlInput: { 'className': 'py-5' } }} />
                                             <div className='py-3'></div>
                                             <TextField
                                                  onChange={(e) => setDescriptionEn(e.target.value)}
                                                  className='w-4/5'
                                                  id="standard-multiline-static"
                                                  label="English Description"
                                                  multiline
                                                  rows={4}
                                                  variant="standard"
                                             />
                                             <div className='py-3'></div>
                                             <TextField
                                                  onChange={(e) => setDescriptionAr(e.target.value)}
                                                  className='w-4/5'
                                                  id="standard-multiline-static"
                                                  label="Arabic Description"
                                                  multiline
                                                  rows={4}
                                                  variant="standard"
                                             />
                                             <div className='py-3'></div>
                                             <div className='w-4/5'>
                                                  <AsyncPaginate
                                                       className='z-50'
                                                       value={option}
                                                       loadOptions={loadOptions}
                                                       onChange={option => {
                                                            setOption(option);
                                                            setCategoryId(option.value);
                                                       }}
                                                       additional={{ page: 1 }}
                                                  />
                                             </div>
                                             <div className='py-3'></div>
                                             <div className='w-4/5'>
                                                  <MultipleSelectChip title="Majors" data={majors} onChange={(value) => setSelectedMajors(value)} />
                                             </div>
                                             <div className='py-2'></div>
                                             <Button onClick={createCourse} variant="contained">
                                                  {
                                                       sendWait ?
                                                            <CircularProgress size={20} className="" color="white" />
                                                            :
                                                            "Create"
                                                  }
                                             </Button>
                                        </div>
                                   </div>
                              </div>
                         </section>
               }
               <SnackbarAlert open={open} message={message} severity={type} onClose={() => setOpen(false)} />
          </>
     );
}

export default CreateCourse;