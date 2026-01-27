import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import './styles/colors.css';
import './styles/constants.css';
import AuthRoutes from './routes/AuthRoutes';
import AccountRoutes from './routes/AccountRoutes';
import AuthProvider from './providers/AuthProvider';
import NotAuthProvider from './providers/NotAuthProvider';
import CourseRoutes from './routes/CourseRoutes';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import ExamRoutes from './routes/ExamRoutes';
import QuestionRoutes from './routes/QuestionRoutes';
import OptionRoutes from './routes/OptionRoutes';
import FileRoutes from './routes/FileRoutes';
import PathRoutes from './routes/PathRoutes';

// const darkTheme = createTheme({
//   palette: {
//     mode: 'dark',
//   },
// });

// const lightTheme = createTheme({
//   palette: {
//     mode: 'light',
//   },
// });

function App() {
  return (
    // <ThemeProvider theme={lightTheme}>
    //   <CssBaseline />
      <main>
      <div className="App">
        <BrowserRouter>
            <Routes>
              <Route path='/' element={<Navigate to='/login' />} />
              {
                AuthRoutes().map((route, index) =>
                  <Route key={index} path={route.path} element={<NotAuthProvider>{route.element}</NotAuthProvider>} />
                )
              }
              {
                AccountRoutes().map((route, index) => 
                  <Route key={index} path={route.path} element={<AuthProvider role="teacher">{route.element}</AuthProvider>} />
                )
              }
              {
                CourseRoutes().map((route, index) =>
                  <Route key={index} path={route.path} element={<AuthProvider role="teacher">{route.element}</AuthProvider>} />
                )
              }
              {
                ExamRoutes().map((route, index) => 
                  <Route key={index} path={route.path} element={<AuthProvider role="teacher">{route.element}</AuthProvider>} />
                )
              }
              {
                QuestionRoutes().map((route, index) =>
                  <Route key={index} path={route.path} element={<AuthProvider role="teacher">{route.element}</AuthProvider>} />
                )
              }
              {
                OptionRoutes().map((route, index) =>
                  <Route key={index} path={route.path} element={<AuthProvider role="teacher">{route.element}</AuthProvider>} />
                )
              }
              {
                FileRoutes().map((route, index) =>
                  <Route key={index} path={route.path} element={<AuthProvider role="teacher">{route.element}</AuthProvider>} />
                )
              }
              {
                PathRoutes().map((route, index) =>
                  <Route key={index} path={route.path} element={<AuthProvider role="teacher">{route.element}</AuthProvider>} />
                )
              }
            </Routes>
        </BrowserRouter>
      </div>

      </main>
    // </ThemeProvider>
  );
}

export default App;
