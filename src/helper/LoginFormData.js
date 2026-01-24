export function buildLoginFormData({
     email,
     password,
}) {
     const formData = new FormData();
     formData.append('email', email);
     formData.append('password', password);
     return formData;
}