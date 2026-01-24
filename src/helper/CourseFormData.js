export function buildCourseFormData({
     nameEn,
     nameAr,
     descriptionEn,
     descriptionAr,
     price,
     image,
     categoryId,
     majors
}) {
     const formData = new FormData();
     formData.append('name_en', nameEn);
     formData.append('name_ar', nameAr);
     formData.append('description_en', descriptionEn);
     formData.append('description_ar', descriptionAr);
     formData.append('price', price);
     formData.append('image', image);
     formData.append('category_id', categoryId);
     majors.forEach((id) => { formData.append('major_ids[]', id); });
     return formData;
}