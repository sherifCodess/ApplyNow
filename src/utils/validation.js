
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^[0-9+()\-\s]{7,20}$/;
const GPA_RE = /^(?:\d+(?:\.\d*)?|\.\d+)$/;

const GENDERS = ["Female", "Male", "Prefer not to say"];
const QUALIFICATIONS = [
  "WAEC / SSCE",
  "NECO",
  "IB Diploma",
  "A-Levels",
  "Other",
];
const PROGRAMMES = [
  "Computer Science",
  "Software Engineering",
  "Information Technology",
  "Business Administration",
  "Mass Communication",
];
const RELATIONSHIPS = ["Parent", "Sibling", "Legal Guardian", "Other"];

function required(value, label, max = 200) {
  if (typeof value !== "string" || !value.trim()) {
    return `${label} is required.`;
  }

  if (value.trim().length > max) {
    return `${label} must be ${max} characters or fewer.`;
  }

  return null;
}

function validEmail(value) {
  return (
    typeof value === "string" &&
    value.trim().length <= 254 &&
    EMAIL_RE.test(value.trim())
  );
}

function validPhone(value) {
  return (
    typeof value === "string" &&
    PHONE_RE.test(value.trim())
  );
}

function validDateOfBirth(value) {
  if (
    typeof value !== "string" ||
    !/^\d{4}-\d{2}-\d{2}$/.test(value)
  ) {
    return false;
  }

  const date = new Date(`${value}T00:00:00.000Z`);

  if (
    Number.isNaN(date.getTime()) ||
    date.toISOString().slice(0, 10) !== value
  ) {
    return false;
  }

  return value <= new Date().toISOString().slice(0, 10);
}

function validOption(value, options) {
  return options.includes(value);
}

function cleanErrors(errors) {
  Object.keys(errors).forEach((key) => {
    if (errors[key] === null) delete errors[key];
  });

  return errors;
}

export function validatePersonal(data = {}) {
  const errors = {};

  errors.firstName = required(data.firstName, "First name", 100);
  errors.lastName = required(data.lastName, "Last name", 100);

  if (!data.dateOfBirth) {
    errors.dateOfBirth = "Date of birth is required.";
  } else if (!validDateOfBirth(data.dateOfBirth)) {
    errors.dateOfBirth = "Enter a valid date of birth.";
  }

  errors.gender = required(data.gender, "Gender");

  if (errors.gender === null && !validOption(data.gender, GENDERS)) {
    errors.gender = "Select a valid gender.";
  }

  if (!data.email || !data.email.trim()) {
    errors.email = "Email is required.";
  } else if (!validEmail(data.email)) {
    errors.email = "Enter a valid email address.";
  }

  if (!data.phone || !data.phone.trim()) {
    errors.phone = "Phone number is required.";
  } else if (!validPhone(data.phone)) {
    errors.phone = "Enter a valid phone number.";
  }

  errors.address = required(data.address, "Address", 500);

  return cleanErrors(errors);
}

export function validateAcademic(data = {}) {
  const errors = {};

  errors.previousSchool = required(
    data.previousSchool,
    "Previous school",
    200
  );

  errors.qualification = required(data.qualification, "Qualification");

  if (
    errors.qualification === null &&
    !validOption(data.qualification, QUALIFICATIONS)
  ) {
    errors.qualification = "Select a valid qualification.";
  }

  const year = Number(data.graduationYear);

  if (!data.graduationYear || !String(data.graduationYear).trim()) {
    errors.graduationYear = "Graduation year is required.";
  } else if (!Number.isInteger(year) || year < 1980 || year > 2035) {
    errors.graduationYear = "Enter a valid graduation year.";
  }

  const gpa = String(data.gpa ?? "").trim();

  if (!gpa) {
    errors.gpa = "GPA is required.";
  } else if (
    !GPA_RE.test(gpa) ||
    !Number.isFinite(Number(gpa)) ||
    Number(gpa) < 0 ||
    Number(gpa) > 5
  ) {
    errors.gpa = "GPA must be a number between 0 and 5.";
  }

  errors.programme = required(data.programme, "Intended programme");

  if (
    errors.programme === null &&
    !validOption(data.programme, PROGRAMMES)
  ) {
    errors.programme = "Select a valid programme.";
  }

  return cleanErrors(errors);
}

export function validateGuardian(data = {}) {
  const errors = {};

  errors.guardianName = required(data.guardianName, "Guardian name", 200);
  errors.relationship = required(data.relationship, "Relationship");

  if (
    errors.relationship === null &&
    !validOption(data.relationship, RELATIONSHIPS)
  ) {
    errors.relationship = "Select a valid relationship.";
  }

  if (!data.guardianPhone || !data.guardianPhone.trim()) {
    errors.guardianPhone = "Guardian phone is required.";
  } else if (!validPhone(data.guardianPhone)) {
    errors.guardianPhone = "Enter a valid phone number.";
  }

  const guardianEmail = data.guardianEmail ?? "";

  if (
    guardianEmail.trim() &&
    !validEmail(guardianEmail)
  ) {
    errors.guardianEmail = "Enter a valid email address.";
  }

  errors.guardianAddress = required(
    data.guardianAddress,
    "Guardian address",
    500
  );

  return cleanErrors(errors);
}

export const validators = {
  personal: validatePersonal,
  academic: validateAcademic,
  guardian: validateGuardian,
};
