import * as React from 'react';
import Box from '@mui/material/Box';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import { useNavigate } from 'react-router-dom';
import Fetch from '../services/Fetch';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock } from '@fortawesome/free-solid-svg-icons';
import InboxIcon from '@mui/icons-material/Inbox';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import StarBorder from '@mui/icons-material/StarBorder';
import { Collapse } from '@mui/material';


export default function SwipeableTemporaryDrawer() {
     const host = `${process.env.REACT_APP_LOCAL_HOST}`;
     const navigate = useNavigate();

     const logout = async () => {
          let result = await Fetch(host + '/logout', 'POST', null);

          if (result.status == 200) {
               navigate('/login');
          }
     }

     const [openCourses, setOpenCourses] = React.useState(false);
     const handleCoursesClick = () => {
          setOpenCourses(!openCourses);
     };

     const items1 = [
          {
               "text": "Profile",
               "icon": <AccountCircleIcon />,
               "path": "/profile"
          },
          {
               "text": "Change Password",
               "icon": <FontAwesomeIcon icon={faLock} />,
               "path": "/update-password"
          },
     ];

     const items = [
          {
               "text": "Logout",
               "icon": <LogoutIcon />,
          },
     ];
     const [state, setState] = React.useState({
          left: false,
     });

     const toggleDrawer = (anchor, open) => (event) => {
          if (
               event &&
               event.type === 'keydown' &&
               (event.key === 'Tab' || event.key === 'Shift')
          ) {
               return;
          }

          setState({ ...state, [anchor]: open });
     };

     const list = (anchor) => (
          <Box
               sx={{ width: anchor === 'top' || anchor === 'bottom' ? 'auto' : 250 }}
               role="presentation"
               // onClick={toggleDrawer(anchor, false)}
               onKeyDown={toggleDrawer(anchor, false)}
          >
               <List>
                    {
                         items1.map((item, index) =>
                              <ListItem key={index} disablePadding>
                                   <ListItemButton onClick={() => navigate(item.path)}>
                                        <ListItemIcon>
                                             {item.icon}
                                        </ListItemIcon>
                                        <ListItemText primary={item.text} />
                                   </ListItemButton>
                              </ListItem>
                         )
                    }
               </List>
               <Divider />
               {/* <List>
                    {
                         items.map((item) =>
                              <ListItem disablePadding>
                                   <ListItemButton>
                                        <ListItemIcon>
                                             {item.icon}
                                        </ListItemIcon>
                                        <ListItemText primary={item.text} />
                                   </ListItemButton>
                              </ListItem>

                         )
                    }
               </List> */}
               <List>
                    <ListItem disablePadding>
                         <ListItemButton onClick={logout}>
                              <ListItemIcon>
                                   <LogoutIcon />
                              </ListItemIcon>
                              <ListItemText primary="Logout" />
                         </ListItemButton>
                    </ListItem>
                    <ListItemButton onClick={handleCoursesClick}>
                         <ListItemIcon>
                              <InboxIcon />
                         </ListItemIcon>
                         <ListItemText primary="Courses" />
                         {openCourses ? <ExpandLess /> : <ExpandMore />}
                    </ListItemButton>
                    {/* القائمة الفرعية */}
                    <Collapse in={openCourses} timeout="auto" unmountOnExit>
                         <List component="div" disablePadding>

                              <ListItemButton onClick={() => navigate('/create-course')} sx={{ pl: 4 }}>
                                   <ListItemIcon>
                                        <StarBorder />
                                   </ListItemIcon>
                                   <ListItemText primary="Create Course" />
                              </ListItemButton>

                         </List>
                    </Collapse>
               </List>
          </Box>
     );

     return (
          <div>
               <React.Fragment>
                    <Button onClick={toggleDrawer("left", true)} color='white'><MenuIcon sx={{ color: "white" }} /></Button>
                    <SwipeableDrawer
                         anchor={"left"}
                         open={state["left"]}
                         onClose={toggleDrawer("left", false)}
                         onOpen={toggleDrawer("left", true)}
                    >
                         {list("left")}
                    </SwipeableDrawer>
               </React.Fragment>
          </div>
     );
}