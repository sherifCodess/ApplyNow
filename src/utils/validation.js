const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^[0-9+()\-\s]{7,20}$/;

function required(value, label) {
  return value && String(value).trim().length > 0 ? null : `${label} is required.`;
}

export function validatePersonal(data) {
  const errors = {};
  errors.firstName = required(data.firstName, "First name");
  errors.lastName = required(data.lastName, "Last name");
  errors.dateOfBirth = required(data.dateOfBirth, "Date of birth");
  errors.gender = required(data.gender, "Gender");

  if (!data.email) {
    errors.email = "Email is required.";
  } else if (!EMAIL_RE.test(data.email)) {
    errors.email = "Enter a valid email address.";
  }

  if (!data.phone) {
    errors.phone = "Phone number is required.";
  } else if (!PHONE_RE.test(data.phone)) {
    errors.phone = "Enter a valid phone number.";
  }

  errors.address = required(data.address, "Address");

  Object.keys(errors).forEach((key) => errors[key] === null && delete errors[key]);
  return errors;
}

export function validateAcademic(data) {
  const errors = {};
  errors.previousSchool = required(data.previousSchool, "Previous school");
  errors.qualification = required(data.qualification, "Qualification");

  const year = Number(data.graduationYear);
  if (!data.graduationYear) {
    errors.graduationYear = "Graduation year is required.";
  } else if (!Number.isInteger(year) || year < 1980 || year > 2035) {
    errors.graduationYear = "Enter a valid graduation year.";
  }

  const gpa = Number(data.gpa);
  if (!data.gpa) {
    errors.gpa = "GPA is required.";
  } else if (Number.isNaN(gpa) || gpa < 0 || gpa > 5) {
    errors.gpa = "GPA must be a number between 0 and 5.";
  }

  errors.programme = required(data.programme, "Intended programme");

  Object.keys(errors).forEach((key) => errors[key] === null && delete errors[key]);
  return errors;
}

export function validateGuardian(data) {
  const errors = {};
  errors.guardianName = required(data.guardianName, "Guardian name");
  errors.relationship = required(data.relationship, "Relationship");

  if (!data.guardianPhone) {
    errors.guardianPhone = "Guardian phone is required.";
  } else if (!PHONE_RE.test(data.guardianPhone)) {
    errors.guardianPhone = "Enter a valid phone number.";
  }

  if (data.guardianEmail && !EMAIL_RE.test(data.guardianEmail)) {
    errors.guardianEmail = "Enter a valid email address.";
  }

  errors.guardianAddress = required(data.guardianAddress, "Guardian address");

  Object.keys(errors).forEach((key) => errors[key] === null && delete errors[key]);
  return errors;
}

export const validators = {
  personal: validatePersonal,
  academic: validateAcademic,
  guardian: validateGuardian,
};
