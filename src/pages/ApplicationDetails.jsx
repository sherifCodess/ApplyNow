import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import StatusBadge from "../components/StatusBadge.jsx";
import Button from "../components/Button.jsx";
import { Loader, ErrorBanner } from "../components/Feedback.jsx";
import { getApplicationById, updateApplicationStatus } from "../services/api.js";

function Field({ label, value }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-wide text-navy-800/45">{label}</p>
      <p className="mt-0.5 text-sm text-navy-800">{value || "—"}</p>
    </div>
  );
}

function ApplicationDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionError, setActionError] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  async function loadApplication() {
    setLoading(true);
    setError("");
    try {
      const data = await getApplicationById(id);
      setApplication(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadApplication();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  async function handleDecision(status) {
    setActionLoading(true);
    setActionError("");
    try {
      const updated = await updateApplicationStatus(id, status);
      setApplication(updated);
    } catch (err) {
      setActionError(err.message);
    } finally {
      setActionLoading(false);
    }
  }

  if (loading) return <Loader label="Loading applicant record..." />;

  if (error) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
        <ErrorBanner message={error} onRetry={loadApplication} />
        <Link to="/admin" className="text-sm text-navy-800 underline">
          Back to applications
        </Link>
      </div>
    );
  }

  if (!application) return null;

  const { personal, academic, guardian } = application;

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
      <button
        onClick={() => navigate("/admin")}
        className="text-xs font-semibold uppercase tracking-wide text-navy-800/60 hover:text-navy-800"
      >
        ← Back to applications
      </button>

      <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-navy-800/45">
            APP-{String(application.id).padStart(3, "0")}
          </p>
          <h1 className="mt-1 font-display text-3xl font-semibold text-navy-800">
            {personal?.firstName} {personal?.lastName}
          </h1>
        </div>
        <StatusBadge status={application.status} size="lg" />
      </div>

      <ErrorBanner message={actionError} />

      <section className="mt-8 rounded-lg border border-navy-800/10 bg-white/60 p-6 shadow-stub">
        <h2 className="font-display text-lg text-navy-800">Personal Information</h2>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Email" value={personal?.email} />
          <Field label="Phone" value={personal?.phone} />
          <Field label="Date of Birth" value={personal?.dateOfBirth} />
          <Field label="Gender" value={personal?.gender} />
          <div className="sm:col-span-2">
            <Field label="Address" value={personal?.address} />
          </div>
        </div>
      </section>

      <section className="mt-6 rounded-lg border border-navy-800/10 bg-white/60 p-6 shadow-stub">
        <h2 className="font-display text-lg text-navy-800">Academic Information</h2>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Previous School" value={academic?.previousSchool} />
          <Field label="Qualification" value={academic?.qualification} />
          <Field label="Graduation Year" value={academic?.graduationYear} />
          <Field label="GPA" value={academic?.gpa} />
          <Field label="Intended Programme" value={academic?.programme} />
        </div>
      </section>

      <section className="mt-6 rounded-lg border border-navy-800/10 bg-white/60 p-6 shadow-stub">
        <h2 className="font-display text-lg text-navy-800">Guardian Information</h2>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Name" value={guardian?.guardianName} />
          <Field label="Relationship" value={guardian?.relationship} />
          <Field label="Phone" value={guardian?.guardianPhone} />
          <Field label="Email" value={guardian?.guardianEmail} />
          <div className="sm:col-span-2">
            <Field label="Address" value={guardian?.guardianAddress} />
          </div>
        </div>
      </section>

      <div className="mt-8 flex justify-end gap-3">
        <Button
          variant="danger"
          onClick={() => handleDecision("Rejected")}
          disabled={actionLoading || application.status === "Rejected"}
        >
          Reject
        </Button>
        <Button
          variant="gold"
          onClick={() => handleDecision("Approved")}
          disabled={actionLoading || application.status === "Approved"}
        >
          Approve
        </Button>
      </div>
    </div>
  );
}

export default ApplicationDetails;
