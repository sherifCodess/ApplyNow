import { Link } from "react-router-dom";
import Button from "../components/Button.jsx";

function Home() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-20 text-center sm:px-6">
      <p className="font-mono text-xs uppercase tracking-[0.3em] text-navy-800/50">
        Admissions Cycle 2026
      </p>
      <h1 className="mt-4 font-display text-4xl font-semibold leading-tight text-navy-800 sm:text-5xl">
        Your application,
        <br />
        tracked from submission to decision.
      </h1>
      <p className="mx-auto mt-5 max-w-xl text-base text-navy-800/65">
        Fill in your personal, academic, and guardian details in three short
        steps, then follow your application status right here — no waiting on
        an email that never comes.
      </p>

      <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
        <Link to="/apply">
          <Button variant="gold">Start Application</Button>
        </Link>
        <Link to="/dashboard">
          <Button variant="ghost">Check My Status</Button>
        </Link>
      </div>

      <div className="mx-auto mt-16 grid max-w-xl grid-cols-1 gap-4 text-left sm:grid-cols-3">
        {[
          { step: "01", label: "Personal", desc: "Who you are" },
          { step: "02", label: "Academic", desc: "Your background" },
          { step: "03", label: "Guardian", desc: "Emergency contact" },
        ].map((item) => (
          <div
            key={item.step}
            className="rounded-lg border border-navy-800/10 bg-white/50 p-4"
          >
            <p className="font-mono text-xs text-gold-600">{item.step}</p>
            <p className="mt-1 font-display text-lg text-navy-800">
              {item.label}
            </p>
            <p className="text-xs text-navy-800/55">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;
