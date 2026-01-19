import Profile from "../pages/account_pages/Profile";
import UpdatePassword from "../pages/account_pages/UpdatePassword";

function AccountRoutes (){
     return [
          {
               path: "/profile",
               element: <Profile />
          },
          {
               path: "/update-password",
               element: <UpdatePassword />
          },
     ];
}

export default AccountRoutes;