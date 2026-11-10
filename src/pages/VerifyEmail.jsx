import { useEffect, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { verifyEmail } from "../services/api.js";
import { Loader } from "../components/Feedback.jsx";

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const startedToken = useRef(null);
  const currentToken = useRef(token);
  currentToken.current = token;

  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("The verification link is missing its token.");
      return;
    }

    // Prevent React Strict Mode from submitting a single-use token twice.
    if (startedToken.current === token) {
      return;
    }

    startedToken.current = token;
    setStatus("loading");
    setMessage("");

    verifyEmail(token)
      .then(() => {
        if (currentToken.current === token) {
          setStatus("success");
        }
      })
      .catch((error) => {
        if (currentToken.current === token) {
          setStatus("error");
          setMessage(error.message);
        }
      });
  }, [token]);
  if (status === "loading") {
    return <Loader label="Verifying your email..." />;
  }

  return (
    <section className="mx-auto max-w-md px-4 py-16">
      <h1 className="font-display text-3xl font-semibold text-navy-800">
        {status === "success" ? "Email verified" : "Verification failed"}
      </h1>

      <p className="mt-4 text-sm leading-6 text-ink/70">
        {status === "success"
          ? "Your email address has been verified. You can now sign in."
          : message}
      </p>

      <Link
        to="/login"
        className="mt-6 inline-block font-semibold text-navy-800 underline"
      >
        Continue to sign in
      </Link>
    </section>
  );
}
