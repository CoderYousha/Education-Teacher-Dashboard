import AddFile from "../pages/file_pages/AddFile";
import UpdateFile from "../pages/file_pages/UpdateFile";

function FileRoutes (){
     return [
          {
               path: '/course-details/:course_id/add-file',
               element: <AddFile />
          },
          {
               path: '/course-details/:course_id/update_file/:file_id',
               element: <UpdateFile />
          }
     ];
}

export default FileRoutes;