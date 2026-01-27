export function buildPathFormData ({
     nameEn,
     nameAr,
     descriptionEn,
     descriptionAr,
     price,
     image,
     categoryId,
     courses
}) {
     const formData = new FormData();
     formData.append('name_en',nameEn);
     formData.append('name_ar',nameAr);
     formData.append('description_en',descriptionEn);
     formData.append('description_ar',descriptionAr);
     formData.append('price',price);
     formData.append('image',image);
     formData.append('category_id',categoryId);
     courses.forEach(course => {formData.append('course_ids[]', course);});

     return formData;
}