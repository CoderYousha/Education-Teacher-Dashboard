import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import './styles/colors.css';
import './styles/constants.css';
import AuthRoutes from './routes/AuthRoutes';
import AccountRoutes from './routes/AccountRoutes';
import AuthProvider from './providers/AuthProvider';
import NotAuthProvider from './providers/NotAuthProvider';
import CourseRoutes from './routes/CourseRoutes';

function App() {
  return (
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
          </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
