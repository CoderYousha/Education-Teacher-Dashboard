import CreateQuestion from "../pages/question_pages/CreateQuestion";
import Questions from "../pages/question_pages/Questions";
import UpdateQuestion from "../pages/question_pages/UpdateQuestion";

function QuestionRoutes (){
     return [
          {
               path: "/courses/:course_id/exams/:exam_id/questions",
               element: <Questions />
          },
          {
               path: "courses/:course_id/exams/:exam_id/create-question",
               element: <CreateQuestion />
          },
          {
               path: "/courses/:course_id/exams/:exam_id/update-question/:question_id",
               element: <UpdateQuestion />
          },
     ];
}

export default QuestionRoutes;