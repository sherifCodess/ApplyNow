import { Link, Navigate } from "react-router-dom";
import Button from "../components/Button.jsx";
import { useApplication } from "../context/ApplicationContext.jsx";

function Confirmation() {
  const { lastSubmission, resetForm } = useApplication();

  if (!lastSubmission) {
    return <Navigate to="/apply" replace />;
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-20 text-center sm:px-6">
      <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border-2 border-dashed border-approved font-display text-2xl text-approved">
        ✓
      </span>
      <h1 className="mt-6 font-display text-3xl font-semibold text-navy-800">
        Application submitted
      </h1>
      <p className="mt-2 text-sm text-navy-800/60">
        Thank you, {lastSubmission.personal?.firstName}. We've received your
        application and it's now pending review.
      </p>

      <div className="mx-auto mt-8 max-w-xs rounded-lg border border-navy-800/15 bg-white/60 p-5 shadow-stub">
        <p className="font-mono text-xs uppercase tracking-widest text-navy-800/45">
          Application ID
        </p>
        <p className="mt-1 font-mono text-lg text-navy-800">
          APP-{String(lastSubmission.id).padStart(3, "0")}
        </p>
      </div>

      <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
        <Link to="/dashboard">
          <Button variant="gold">Track My Status</Button>
        </Link>
        <Link to="/" onClick={resetForm}>
          <Button variant="ghost">Back Home</Button>
        </Link>
      </div>
    </div>
  );
}

export default Confirmation;
