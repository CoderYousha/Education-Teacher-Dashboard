import CreateExam from "../pages/exam_pages/CreateExam";
import UpdateExam from "../pages/exam_pages/UpdateExam";

function ExamRoutes(){
     return [
          {
               path: ":id/create-exam",
               element: <CreateExam />
          },
          {
               path: "course/:course_id/update-exam/:exam_id",
               element: <UpdateExam />
          }
     ];
}

export default ExamRoutes;