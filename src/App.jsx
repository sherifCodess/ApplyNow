import { Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

import Home from "./pages/Home.jsx";
import Application from "./pages/Application.jsx";
import Confirmation from "./pages/Confirmation.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import ApplicationDetails from "./pages/ApplicationDetails.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import VerifyEmail from "./pages/VerifyEmail.jsx";

function App() {
  return (
    <div className="min-h-screen bg-paper">
      <Navbar />

      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify-email" element={<VerifyEmail />} />

          <Route element={<ProtectedRoute allowedRoles={["STUDENT"]} />}>
            <Route path="/apply" element={<Application />} />
            <Route path="/confirmation" element={<Confirmation />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Route>

          <Route
            element={
              <ProtectedRoute
                allowedRoles={["ADMISSIONS_ADMIN", "SUPER_ADMIN"]}
              />
            }
          >
            <Route path="/admin" element={<AdminDashboard />} />
            <Route
              path="/admin/applications/:id"
              element={<ApplicationDetails />}
            />
          </Route>
        </Routes>
      </main>
    </div>
  );
}

export default App;
