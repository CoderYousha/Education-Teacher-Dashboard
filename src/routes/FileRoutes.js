import AddFile from "../pages/file_pages/AddFile";

function FileRoutes (){
     return [
          {
               path: 'course-details/:course_id/add-file',
               element: <AddFile />
          }
     ];
}

export default FileRoutes;