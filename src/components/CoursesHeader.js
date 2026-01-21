import Image1 from '../images/login/image1.png';
import SearchIcon from '@mui/icons-material/Search';
import { Avatar, Box, Container, Typography } from '@mui/material';
import { useRef } from 'react';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import SwipeableTemporaryDrawer from './Drawer';
import { useNavigate } from 'react-router-dom';

function CoursesHeader({data, onChange, selected, onClick}) {
     const scrollRef = useRef(null);
     const searchRef = useRef();
     const navigate = useNavigate();
     const handleScrollRight = () => {
          if (scrollRef.current) {
               scrollRef.current.scrollBy({
                    left: 100, behavior: "smooth",
               });
          }
     };
     const handleScrollLeft = () => {
          if (scrollRef.current) {
               scrollRef.current.scrollBy({
                    left: -100, behavior: "smooth",
               });
          }
     };
     return (
          <Container maxWidth="xl" className="fixed top-0 right-5 w-full bg-blue-color z-10 pl-10">
               <Box className='flex justify-between items-center w-full float-right'>
                    <SwipeableTemporaryDrawer />
                    <Box className="w-fit h-16 flex items-center">
                         <img src={Image1} className='w-16 h-16 max-sm:w-10 max-sm:h-10' />
                         <Typography variant='h6' className='text-xl font-bold text-white'>Education</Typography>
                    </Box>    
                    <Box className="w-2/5 relative">
                         <input ref={searchRef} className='w-full h-10 rounded-full indent-5 outline-none max-sm:h-8' type='text' placeholder='Search' />
                         <button onClick={() => onClick(searchRef.current.value)} className='absolute right-0 w-1/6 h-full rounded-r-full bg-gray-300 text-gray-100 max-sm:w-2/6'>
                              <SearchIcon fontSize='large' />
                         </button>
                    </Box>
                    <Box onClick={() => navigate('/profile')} className='cursor-pointer'>
                         <Avatar className='mr-5' alt="Remy Sharp" src="/static/images/avatar/1.jpg" />
                    </Box>

               </Box>
               <Box className='relative mt-5 w-full float-right'>
                    <Box ref={scrollRef} className='w-11/12 overflow-x-scroll flex none-view-scroll mx-auto'>
                    {
                         data.map((item, index) => 
                              <Box style={{backgroundColor: item.id == selected? 'gray' : 'white'}} onClick={() => item.id != selected ? onChange(item.id) : onChange(null)} key={index} className='w-fit px-1 py-1 mx-2 rounded-xl bg-white cursor-pointer hover:bg-gray-200 duration-400 max-sm:text-xs'>{localStorage.getItem('language') == 'en'? item.name_en : item.name_ar}</Box>
                         )
                    }
                    </Box>
                    <button onClick={handleScrollLeft} className='absolute top-1/2 -translate-y-1/2 left-5 bg-black text-white w-7 h-7 rounded-full'>
                         <ArrowBackIosNewIcon />
                    </button>
                    <button onClick={handleScrollRight} className='absolute top-1/2 -translate-y-1/2 right-5 bg-black text-white w-7 h-7 rounded-full'>
                         <ArrowForwardIosIcon />
                    </button>
               </Box>
          </Container>
     );
}

export default CoursesHeader;