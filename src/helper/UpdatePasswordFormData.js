export function buildUpdatePasswordFormData({
     oldPassword,
     newPassword,
     confirmPassword
}) {
     const formData = new FormData();

     formData.append('old_password', oldPassword);
     formData.append('new_password', newPassword);
     formData.append('new_password_confirmation', confirmPassword);

     return formData;
}