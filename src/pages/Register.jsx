import { useState } from "react";
import { Link } from "react-router-dom";
import { registerStudent } from "../services/api.js";
import Button from "../components/Button.jsx";
import FormInput from "../components/FormInput.jsx";
import { ErrorBanner } from "../components/Feedback.jsx";

export default function Register() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (event) => {
    setForm((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      await registerStudent(form);
      setSubmitted(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <section className="mx-auto max-w-md px-4 py-16">
        <h1 className="font-display text-3xl font-semibold text-navy-800">
          Registration received
        </h1>
        <p className="mt-4 text-sm leading-6 text-ink/70">
          Your registration request was accepted. Email verification delivery is
          not configured yet, so a verification link will not arrive until the
          email service is enabled.
        </p>
        <Link
          to="/login"
          className="mt-6 inline-block font-semibold text-navy-800 underline"
        >
          Return to sign in
        </Link>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-md px-4 py-16">
      <h1 className="font-display text-3xl font-semibold text-navy-800">
        Create an account
      </h1>
      <p className="mt-2 text-sm text-ink/60">
        Register to begin your application.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-5">
        <ErrorBanner message={error} />

        <FormInput
          label="Email address"
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          placeholder="you@example.com"
        />

        <FormInput
          label="Password"
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
          placeholder="8–15 characters"
        />

        <p className="text-xs text-ink/60">
          Use 8–15 characters, including at least one number and one special
          character.
        </p>

        <Button type="submit" disabled={submitting} className="w-full">
          {submitting ? "Creating account..." : "Create account"}
        </Button>
      </form>

      <p className="mt-6 text-sm text-ink/70">
        Already registered?{" "}
        <Link to="/login" className="font-semibold text-navy-800 underline">
          Sign in
        </Link>
      </p>
    </section>
  );
}
