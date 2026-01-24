export function buildQuestionFormData({
     textAr,
     textEn,
     questionType,
     fullMark,
     examId,
}) {
     const formData = new FormData();

     formData.append('text_en', textEn);
     formData.append('text_ar', textAr);
     formData.append('type', questionType);
     formData.append('full_mark', fullMark);
     if (examId)
          formData.append('exam_id', examId);

     return formData;
}