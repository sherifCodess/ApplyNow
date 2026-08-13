import FormInput from "../components/FormInput.jsx";

function GuardianForm({ data, errors, onChange }) {
  function handleChange(e) {
    onChange({ [e.target.name]: e.target.value });
  }

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
      <FormInput
        label="Guardian Name"
        name="guardianName"
        value={data.guardianName}
        onChange={handleChange}
        error={errors.guardianName}
        placeholder="Full name"
      />
      <FormInput
        label="Relationship"
        name="relationship"
        as="select"
        options={["Parent", "Sibling", "Legal Guardian", "Other"]}
        value={data.relationship}
        onChange={handleChange}
        error={errors.relationship}
      />
      <FormInput
        label="Guardian Phone"
        name="guardianPhone"
        type="tel"
        value={data.guardianPhone}
        onChange={handleChange}
        error={errors.guardianPhone}
        placeholder="+234 800 000 0000"
      />
      <FormInput
        label="Guardian Email (optional)"
        name="guardianEmail"
        type="email"
        value={data.guardianEmail}
        onChange={handleChange}
        error={errors.guardianEmail}
        placeholder="guardian@example.com"
      />
      <div className="sm:col-span-2">
        <FormInput
          label="Guardian Address"
          name="guardianAddress"
          value={data.guardianAddress}
          onChange={handleChange}
          error={errors.guardianAddress}
          placeholder="Street, city, state"
        />
      </div>
    </div>
  );
}

export default GuardianForm;
