import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import StatusBadge from "../components/StatusBadge.jsx";
import { Loader, ErrorBanner, EmptyState } from "../components/Feedback.jsx";
import { getApplications } from "../services/api.js";

const FILTERS = ["All", "Pending", "Approved", "Rejected"];

function AdminDashboard() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("All");

  async function loadApplications() {
    setLoading(true);
    setError("");
    try {
      const data = await getApplications();
      setApplications(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadApplications();
  }, []);

  const visible =
    filter === "All"
      ? applications
      : applications.filter((app) => app.status === filter);

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-navy-800/50">
            Admissions Office
          </p>
          <h1 className="mt-2 font-display text-3xl font-semibold text-navy-800">
            Applications
          </h1>
        </div>

        <div className="flex gap-2">
          {FILTERS.map((label) => (
            <button
              key={label}
              onClick={() => setFilter(label)}
              className={`rounded-full border px-3 py-1.5 text-xs font-semibold uppercase tracking-wide transition-colors ${
                filter === label
                  ? "border-navy-800 bg-navy-800 text-paper"
                  : "border-navy-800/20 text-navy-800/60 hover:border-navy-800/40"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-8">
        <ErrorBanner message={error} onRetry={loadApplications} />

        {loading ? (
          <Loader label="Loading applications..." />
        ) : visible.length === 0 ? (
          <EmptyState
            title="No applications here"
            description="Nothing matches this filter yet."
          />
        ) : (
          <div className="overflow-hidden rounded-lg border border-navy-800/10 bg-white/60 shadow-stub">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-navy-800/10 bg-navy-800/5 text-xs uppercase tracking-wide text-navy-800/50">
                  <th className="px-4 py-3 font-medium">Applicant</th>
                  <th className="hidden px-4 py-3 font-medium sm:table-cell">
                    Programme
                  </th>
                  <th className="hidden px-4 py-3 font-medium md:table-cell">
                    Submitted
                  </th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody>
                {visible.map((app) => (
                  <tr
                    key={app.id}
                    className="border-b border-navy-800/5 last:border-0 hover:bg-navy-800/5"
                  >
                    <td className="px-4 py-3">
                      <p className="font-medium text-navy-800">
                        {app.personal?.firstName} {app.personal?.lastName}
                      </p>
                      <p className="font-mono text-xs text-navy-800/40">
                        APP-{String(app.id).padStart(3, "0")}
                      </p>
                    </td>
                    <td className="hidden px-4 py-3 text-navy-800/70 sm:table-cell">
                      {app.academic?.programme}
                    </td>
                    <td className="hidden px-4 py-3 text-navy-800/50 md:table-cell">
                      {app.submittedAt
                        ? new Date(app.submittedAt).toLocaleDateString()
                        : "—"}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={app.status} />
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link
                        to={`/admin/applications/${app.id}`}
                        className="text-xs font-semibold uppercase tracking-wide text-navy-800 underline underline-offset-2 hover:text-gold-600"
                      >
                        Review
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;
