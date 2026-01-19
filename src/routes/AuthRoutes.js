import ForgotPassword from "../pages/auth _pages/ForgotPassword";
import Login from "../pages/auth _pages/Login";
import Register from "../pages/auth _pages/Register";

function AuthRoutes (){
     return [
          {
               path: "/login",
               element: <Login />
          },
          {
               path: "/register",
               element: <Register />
          },
          {
               path: "/forgot-password",
               element: <ForgotPassword />
          }
     ];
}

export default AuthRoutes;