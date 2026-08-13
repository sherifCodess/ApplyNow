import FormInput from "../components/FormInput.jsx";

function PersonalForm({ data, errors, onChange }) {
  function handleChange(e) {
    onChange({ [e.target.name]: e.target.value });
  }

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
      <FormInput
        label="First Name"
        name="firstName"
        value={data.firstName}
        onChange={handleChange}
        error={errors.firstName}
        placeholder="Sherif"
      />
      <FormInput
        label="Last Name"
        name="lastName"
        value={data.lastName}
        onChange={handleChange}
        error={errors.lastName}
        placeholder="Abdulazeez"
      />
      <FormInput
        label="Date of Birth"
        name="dateOfBirth"
        type="date"
        value={data.dateOfBirth}
        onChange={handleChange}
        error={errors.dateOfBirth}
      />
      <FormInput
        label="Gender"
        name="gender"
        as="select"
        options={["Female", "Male", "Prefer not to say"]}
        value={data.gender}
        onChange={handleChange}
        error={errors.gender}
      />
      <FormInput
        label="Email"
        name="email"
        type="email"
        value={data.email}
        onChange={handleChange}
        error={errors.email}
        placeholder="you@example.com"
      />
      <FormInput
        label="Phone Number"
        name="phone"
        type="tel"
        value={data.phone}
        onChange={handleChange}
        error={errors.phone}
        placeholder="+234 800 000 0000"
      />
      <div className="sm:col-span-2">
        <FormInput
          label="Address"
          name="address"
          value={data.address}
          onChange={handleChange}
          error={errors.address}
          placeholder="Street, city, state"
        />
      </div>
    </div>
  );
}

export default PersonalForm;
