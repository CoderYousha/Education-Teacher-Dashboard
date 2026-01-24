export function buildProfileFormData({
     firstName,
     lastName,
     phoneCode,
     phoneNumber,
     birthDate,
     email,
     language
}) {
     const formData = new FormData();

     formData.append('first_name', firstName);
     formData.append('last_name', lastName);
     formData.append('phone_code', phoneCode);
     formData.append('phone', phoneNumber);
     formData.append('birth_date', birthDate);
     formData.append('email', email);
     formData.append('language', language);

     return formData;
}