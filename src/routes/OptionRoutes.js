import CreateOption from "../pages/option_pages/CreateOption";
import Options from "../pages/option_pages/Options";

function OptionRoutes () {
     return [
          {
               path: '/courses/:course_id/exams/:exam_id/questions/:question_id/create-option',
               element: <CreateOption />
          },
          {
               path: 'courses/:course_id/exams/:exam_id/questions/:question_id/options',
               element: <Options />
          },
     ];
}

export default OptionRoutes;