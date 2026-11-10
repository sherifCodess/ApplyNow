import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import Button from "./Button.jsx";

const linkBase =
  "text-sm font-medium tracking-wide transition-colors hover:text-gold-400";

function Navbar() {
  const { user, loading, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login", { replace: true });
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const linkClass = ({ isActive }) =>
    `${linkBase} ${isActive ? "text-gold-400" : "text-paper/80"}`;

  return (
    <header className="border-b border-navy-800/10 bg-navy-800">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4 sm:px-6">
        <NavLink
          to="/"
          className="font-display text-xl font-semibold text-paper"
        >
          ApplyNow
        </NavLink>

        <nav className="flex items-center gap-5">
          {!loading && user?.role === "STUDENT" && (
            <>
              <NavLink to="/apply" className={linkClass}>
                Apply
              </NavLink>
              <NavLink to="/dashboard" className={linkClass}>
                My Status
              </NavLink>
            </>
          )}

          {!loading &&
            ["ADMISSIONS_ADMIN", "SUPER_ADMIN"].includes(user?.role) && (
              <NavLink to="/admin" className={linkClass}>
                Admin
              </NavLink>
            )}

          {!loading && !user && (
            <>
              <NavLink to="/login" className={linkClass}>
                Sign in
              </NavLink>
              <NavLink to="/register" className={linkClass}>
                Register
              </NavLink>
            </>
          )}

          {!loading && user && (
            <Button variant="gold" onClick={handleLogout}>
              Sign out
            </Button>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Navbar;
