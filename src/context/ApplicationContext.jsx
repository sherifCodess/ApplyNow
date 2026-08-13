import { createContext, useContext, useMemo, useState } from "react";

const ApplicationContext = createContext(null);

const emptyForm = {
  personal: {
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    gender: "",
    email: "",
    phone: "",
    address: "",
  },
  academic: {
    previousSchool: "",
    qualification: "",
    graduationYear: "",
    gpa: "",
    programme: "",
  },
  guardian: {
    guardianName: "",
    relationship: "",
    guardianPhone: "",
    guardianEmail: "",
    guardianAddress: "",
  },
};

export function ApplicationProvider({ children }) {
  const [formData, setFormData] = useState(emptyForm);
  const [currentStep, setCurrentStep] = useState(0);
  const [lastSubmission, setLastSubmission] = useState(null);

  function updateSection(section, values) {
    setFormData((prev) => ({
      ...prev,
      [section]: { ...prev[section], ...values },
    }));
  }

  function resetForm() {
    setFormData(emptyForm);
    setCurrentStep(0);
  }

  const value = useMemo(
    () => ({
      formData,
      updateSection,
      currentStep,
      setCurrentStep,
      resetForm,
      lastSubmission,
      setLastSubmission,
    }),
    [formData, currentStep, lastSubmission]
  );

  return (
    <ApplicationContext.Provider value={value}>
      {children}
    </ApplicationContext.Provider>
  );
}

export function useApplication() {
  const ctx = useContext(ApplicationContext);
  if (!ctx) {
    throw new Error("useApplication must be used within an ApplicationProvider");
  }
  return ctx;
}
