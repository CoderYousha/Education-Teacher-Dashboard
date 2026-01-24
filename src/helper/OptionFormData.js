export function buildOptionFormData ({
     textEn,
     textAr,
     isCorrect,
     questionId
}) {
     const formData = new FormData();

     formData.append("text_en", textEn);
     formData.append("text_ar", textAr);
     formData.append("is_correct", isCorrect);
     formData.append("question_id", questionId);

     return formData;
}