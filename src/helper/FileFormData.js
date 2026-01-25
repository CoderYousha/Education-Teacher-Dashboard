export function buildFileFormData ({
     nameEn,
     nameAr,
     file,
     courseId,
     thumbnail
}) {
     const formData = new FormData();
     formData.append('name_en', nameEn);
     formData.append('name_ar', nameAr);
     formData.append('file', file);
     formData.append('course_id', courseId);
     formData.append('thumbnail', thumbnail);

     return formData;
}