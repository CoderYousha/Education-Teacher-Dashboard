import CreatePath from "../pages/path_pages/CreatePath";
import PathDetails from "../pages/path_pages/PathDetails";
import Paths from "../pages/path_pages/Paths";
import UpdatePath from "../pages/path_pages/UpdatePath";

function PathRoutes () {
     return [
          {
               path: '/my-paths',
               element: <Paths />
          },
          {
               path: '/path-details/:id',
               element: <PathDetails />
          },
          {
               path: '/create-path',
               element: <CreatePath />
          },
          {
               path: '/update-path/:id',
               element: <UpdatePath />
          },
     ];
}

export default PathRoutes;