import { Box, Container } from '@mui/material';
import SwipeableTemporaryDrawer from './Drawer';

function Header() {
     return (
          <Container maxWidth="xl" className="fixed top-0 w-full z-10 pl-10">
               <Box className='h-14 flex justify-between items-center w-full float-right'>
                    <SwipeableTemporaryDrawer />
               </Box>
          </Container>
     );
}

export default Header;