import CourseDetails from "../pages/courses_pages/CourseDetails";
import Courses from "../pages/courses_pages/Courses";
import CreateCourse from "../pages/courses_pages/CreateCourse";
import UpdateCourse from "../pages/courses_pages/UpdateCourse";

function CourseRoutes (){
     return [
          {
               path: "/create-course",
               element: <CreateCourse />
          },
          {
               path: "/my-courses",
               element: <Courses />
          },
          {
               path: "/update-course/:id",
               element: <UpdateCourse />
          },
          {
               path: "/course-details/:id",
               element: <CourseDetails />
          },
     ];
}

export default CourseRoutes;