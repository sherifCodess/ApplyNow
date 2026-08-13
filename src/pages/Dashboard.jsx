import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import StatusBadge from "../components/StatusBadge.jsx";
import Button from "../components/Button.jsx";
import { Loader, ErrorBanner, EmptyState } from "../components/Feedback.jsx";
import { useApplication } from "../context/ApplicationContext.jsx";
import { getApplicationById } from "../services/api.js";

const STATUS_MESSAGE = {
  Pending: "Your application is currently being reviewed by our admissions team.",
  Approved: "Congratulations — your application has been approved!",
  Rejected: "Your application was not successful this cycle.",
};

function Dashboard() {
  const { lastSubmission } = useApplication();
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const applicationId =
    lastSubmission?.id || window.localStorage.getItem("applynow_last_application_id");

  async function loadApplication() {
    if (!applicationId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError("");
    try {
      const data = await getApplicationById(applicationId);
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
  }, [applicationId]);

  if (loading) return <Loader label="Fetching your application..." />;

  if (!applicationId || (!application && !error)) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 sm:px-6">
        <EmptyState
          title="No application on file"
          description="You haven't submitted an application from this device yet."
        />
        <div className="mt-6 flex justify-center">
          <Link to="/apply">
            <Button variant="gold">Start an Application</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-16 sm:px-6">
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-navy-800/50">
        Application Status
      </p>
      <h1 className="mt-2 font-display text-3xl font-semibold text-navy-800">
        Track your application
      </h1>

      <ErrorBanner message={error} onRetry={loadApplication} />

      {application && (
        <div className="mt-6 rounded-lg border border-navy-800/15 bg-white/60 p-6 shadow-stub">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="font-mono text-xs uppercase tracking-widest text-navy-800/45">
                Application ID
              </p>
              <p className="font-mono text-base text-navy-800">
                APP-{String(application.id).padStart(3, "0")}
              </p>
            </div>
            <StatusBadge status={application.status} />
          </div>

          <div className="mt-5 border-t border-dashed border-navy-800/15 pt-5">
            <p className="text-sm text-navy-800/70">
              {application.personal?.firstName} {application.personal?.lastName}
            </p>
            <p className="mt-1 text-xs text-navy-800/50">
              Applying for {application.academic?.programme}
            </p>
            <p className="mt-1 text-xs text-navy-800/50">
              Submitted{" "}
              {application.submittedAt
                ? new Date(application.submittedAt).toLocaleDateString()
                : "—"}
            </p>
          </div>

          <p className="mt-5 text-sm text-navy-800/75">
            {STATUS_MESSAGE[application.status] || STATUS_MESSAGE.Pending}
          </p>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
