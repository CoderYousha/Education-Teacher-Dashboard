export function buildExamFormData({
     nameEn,
     nameAr,
     descriptionEn,
     descriptionAr,
     courseId
}) {
     const formData = new FormData();
     formData.append('name_en', nameEn);
     formData.append('name_ar', nameAr);
     formData.append('description_en', descriptionEn);
     formData.append('description_ar', descriptionAr);
     formData.append('course_id', courseId);

     return formData
}