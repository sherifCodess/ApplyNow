import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import Button from "../components/Button.jsx";
import FormInput from "../components/FormInput.jsx";
import { ErrorBanner } from "../components/Feedback.jsx";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

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
      const user = await login(form);

      if (!user) {
        throw new Error("Unable to retrieve your account. Please try again.");
      }

      const destination =
        location.state?.from?.pathname ||
        (user.role === "STUDENT" ? "/dashboard" : "/admin");

      navigate(destination, { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="mx-auto max-w-md px-4 py-16">
      <h1 className="font-display text-3xl font-semibold text-navy-800">
        Sign in
      </h1>
      <p className="mt-2 text-sm text-ink/60">Access your ApplyNow account.</p>

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
        />

        <Button type="submit" disabled={submitting} className="w-full">
          {submitting ? "Signing in..." : "Sign in"}
        </Button>
      </form>

      <p className="mt-6 text-sm text-ink/70">
        Don't have an account?{" "}
        <Link to="/register" className="font-semibold text-navy-800 underline">
          Create one
        </Link>
      </p>
    </section>
  );
}
