import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ProgressBar from "../components/ProgressBar.jsx";
import Button from "../components/Button.jsx";
import { ErrorBanner } from "../components/Feedback.jsx";
import PersonalForm from "../forms/PersonalForm.jsx";
import AcademicForm from "../forms/AcademicForm.jsx";
import GuardianForm from "../forms/GuardianForm.jsx";
import { useApplication } from "../context/ApplicationContext.jsx";
import { validators } from "../utils/validation.js";
import { createApplication } from "../services/api.js";

const SECTIONS = ["personal", "academic", "guardian"];
const TITLES = {
  personal: "Personal Information",
  academic: "Academic Information",
  guardian: "Guardian Information",
};
const DESCRIPTIONS = {
  personal: "Tell us who you are and how to reach you.",
  academic: "Your academic background and the programme you're applying to.",
  guardian: "Contact details for your parent or guardian.",
};

function Application() {
  const navigate = useNavigate();
  const { formData, updateSection, currentStep, setCurrentStep, setLastSubmission } =
    useApplication();
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const sectionKey = SECTIONS[currentStep];
  const isLastStep = currentStep === SECTIONS.length - 1;

  function handleChange(values) {
    updateSection(sectionKey, values);
  }

  function validateCurrentStep() {
    const sectionErrors = validators[sectionKey](formData[sectionKey]);
    setErrors(sectionErrors);
    return Object.keys(sectionErrors).length === 0;
  }

  function handleBack() {
    setErrors({});
    setCurrentStep((step) => Math.max(step - 1, 0));
  }

  async function handleNext() {
    if (!validateCurrentStep()) return;

    if (!isLastStep) {
      setErrors({});
      setCurrentStep((step) => step + 1);
      return;
    }

    setSubmitting(true);
    setSubmitError("");
    try {
      const payload = {
        ...formData,
        status: "Pending",
        submittedAt: new Date().toISOString(),
      };
      const created = await createApplication(payload);
      setLastSubmission(created);
      window.localStorage.setItem("applynow_last_application_id", created.id);
      navigate("/confirmation");
    } catch (error) {
      setSubmitError(error.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-navy-800/50">
        Application Form
      </p>
      <h1 className="mt-2 font-display text-3xl font-semibold text-navy-800">
        {TITLES[sectionKey]}
      </h1>
      <p className="mt-1 mb-8 text-sm text-navy-800/60">
        {DESCRIPTIONS[sectionKey]}
      </p>

      <ProgressBar currentStep={currentStep} />

      <ErrorBanner message={submitError} />

      <div className="rounded-lg border border-navy-800/10 bg-white/60 p-6 shadow-stub sm:p-8">
        {sectionKey === "personal" && (
          <PersonalForm data={formData.personal} errors={errors} onChange={handleChange} />
        )}
        {sectionKey === "academic" && (
          <AcademicForm data={formData.academic} errors={errors} onChange={handleChange} />
        )}
        {sectionKey === "guardian" && (
          <GuardianForm data={formData.guardian} errors={errors} onChange={handleChange} />
        )}
      </div>

      <div className="mt-8 flex items-center justify-between">
        <Button variant="ghost" onClick={handleBack} disabled={currentStep === 0}>
          Back
        </Button>
        <Button variant="gold" onClick={handleNext} disabled={submitting}>
          {submitting ? "Submitting..." : isLastStep ? "Submit Application" : "Next"}
        </Button>
      </div>
    </div>
  );
}

export default Application;
