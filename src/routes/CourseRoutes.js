import CreateCourse from "../pages/courses_pages/CreateCourse";

function CourseRoutes (){
     return [
          {
               path: "/create-course",
               element: <CreateCourse />
          }
     ];
}

export default CourseRoutes;