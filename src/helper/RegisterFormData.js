export function buildRegisterFormData({
     firstName,
     lastName,
     phoneCode,
     phoneNumber,
     birthDate,
     email,
     password,
     passwordConfirmation,
     accountRole
}) {
     const formData = new FormData();
     formData.append('first_name', firstName);
     formData.append('last_name', lastName);
     formData.append('phone_code', phoneCode);
     formData.append('phone', phoneNumber);
     formData.append('birth_date', birthDate);
     formData.append('email', email);
     formData.append('password', password);
     formData.append('password_confirmation', passwordConfirmation);
     formData.append('account_role', accountRole);

     return formData;
}