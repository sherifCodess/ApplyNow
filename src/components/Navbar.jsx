import { NavLink } from "react-router-dom";

const linkBase =
  "text-sm font-medium tracking-wide transition-colors hover:text-gold-400";

function Navbar() {
  return (
    <header className="border-b border-navy-800/10 bg-navy-800">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4 sm:px-6">
        <NavLink to="/" className="font-display text-xl font-semibold text-paper">
          ApplyNow
        </NavLink>

        <nav className="flex items-center gap-5">
          <NavLink
            to="/apply"
            className={({ isActive }) =>
              `${linkBase} ${isActive ? "text-gold-400" : "text-paper/80"}`
            }
          >
            Apply
          </NavLink>
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `${linkBase} ${isActive ? "text-gold-400" : "text-paper/80"}`
            }
          >
            My Status
          </NavLink>
          <NavLink
            to="/admin"
            className={({ isActive }) =>
              `${linkBase} ${isActive ? "text-gold-400" : "text-paper/80"}`
            }
          >
            Admin
          </NavLink>
        </nav>
      </div>
    </header>
  );
}

export default Navbar;
