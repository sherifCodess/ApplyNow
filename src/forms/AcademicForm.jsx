import FormInput from "../components/FormInput.jsx";

function AcademicForm({ data, errors, onChange }) {
  function handleChange(e) {
    onChange({ [e.target.name]: e.target.value });
  }

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
      <div className="sm:col-span-2">
        <FormInput
          label="Previous School"
          name="previousSchool"
          value={data.previousSchool}
          onChange={handleChange}
          error={errors.previousSchool}
          placeholder="e.g. Federal Government College"
        />
      </div>
      <FormInput
        label="Qualification"
        name="qualification"
        as="select"
        options={["WAEC / SSCE", "NECO", "IB Diploma", "A-Levels", "Other"]}
        value={data.qualification}
        onChange={handleChange}
        error={errors.qualification}
      />
      <FormInput
        label="Graduation Year"
        name="graduationYear"
        type="number"
        value={data.graduationYear}
        onChange={handleChange}
        error={errors.graduationYear}
        placeholder="2024"
      />
      <FormInput
        label="GPA (0 - 5.0)"
        name="gpa"
        type="number"
        value={data.gpa}
        onChange={handleChange}
        error={errors.gpa}
        placeholder="4.20"
      />
      <FormInput
        label="Intended Programme"
        name="programme"
        as="select"
        options={[
          "Computer Science",
          "Software Engineering",
          "Information Technology",
          "Business Administration",
          "Mass Communication",
        ]}
        value={data.programme}
        onChange={handleChange}
        error={errors.programme}
      />
    </div>
  );
}

export default AcademicForm;
