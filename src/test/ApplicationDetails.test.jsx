import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import ApplicationDetails from "../pages/ApplicationDetails.jsx";
import {
  getApplicationById,
  updateApplicationStatus,
} from "../services/api.js";

vi.mock("../services/api.js", () => ({
  getApplicationById: vi.fn(),
  updateApplicationStatus: vi.fn(),
}));

const application = {
  id: 7,
  status: "Pending",
  personal: {
    firstName: "Ahmed",
    lastName: "Abdul",
    email: "ahmed@example.com",
    phone: "+2348000000000",
    dateOfBirth: "2005-05-10",
    gender: "Male",
    address: "Lagos, Nigeria",
  },
  academic: {
    previousSchool: "Federal Government College",
    qualification: "WAEC / SSCE",
    graduationYear: "2024",
    gpa: "4.20",
    programme: "Computer Science",
  },
  guardian: {
    guardianName: "Mohammed Abdul",
    relationship: "Parent",
    guardianPhone: "+2348111111111",
    guardianEmail: "guardian@example.com",
    guardianAddress: "Lagos, Nigeria",
  },
};

function renderApplicationDetails() {
  return render(
    <MemoryRouter initialEntries={["/admin/applications/7"]}>
      <Routes>
        <Route
          path="/admin/applications/:id"
          element={<ApplicationDetails />}
        />
        <Route path="/admin" element={<div>Admin Dashboard</div>} />
      </Routes>
    </MemoryRouter>,
  );
}

describe("ApplicationDetails", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("shows the loading state initially", () => {
    getApplicationById.mockReturnValue(new Promise(() => {}));

    renderApplicationDetails();

    expect(screen.getByText("Loading applicant record...")).toBeInTheDocument();
  });

  it("displays the applicant details after fetching", async () => {
    getApplicationById.mockResolvedValue(application);

    renderApplicationDetails();

    expect(await screen.findByText("Ahmed Abdul")).toBeInTheDocument();

    expect(screen.getByText("ahmed@example.com")).toBeInTheDocument();
    expect(screen.getByText("+2348000000000")).toBeInTheDocument();
    expect(screen.getByText("Federal Government College")).toBeInTheDocument();
    expect(screen.getByText("Computer Science")).toBeInTheDocument();
    expect(screen.getByText("Mohammed Abdul")).toBeInTheDocument();
    expect(screen.getByText("Parent")).toBeInTheDocument();
  });

  it("displays an error when the application cannot be fetched", async () => {
    getApplicationById.mockRejectedValue(
      new Error("Application could not be loaded"),
    );

    renderApplicationDetails();

    expect(
      await screen.findByText("Application could not be loaded"),
    ).toBeInTheDocument();
  });

  it("provides a link back to the admin dashboard when loading fails", async () => {
    getApplicationById.mockRejectedValue(
      new Error("Application could not be loaded"),
    );

    renderApplicationDetails();

    await screen.findByText("Application could not be loaded");

    expect(
      screen.getByRole("link", { name: "Back to applications" }),
    ).toHaveAttribute("href", "/admin");
  });

  it("approves a pending application", async () => {
    getApplicationById.mockResolvedValue(application);

    const approvedApplication = {
      ...application,
      status: "Approved",
    };

    updateApplicationStatus.mockResolvedValue(approvedApplication);

    const user = userEvent.setup();

    renderApplicationDetails();

    await screen.findByText("Ahmed Abdul");

    await user.click(screen.getByRole("button", { name: "Approve" }));

    await waitFor(() => {
      expect(updateApplicationStatus).toHaveBeenCalledWith("7", "Approved");
    });

    expect(await screen.findByText("Approved")).toBeInTheDocument();
  });

  it("rejects a pending application", async () => {
    getApplicationById.mockResolvedValue(application);

    const rejectedApplication = {
      ...application,
      status: "Rejected",
    };

    updateApplicationStatus.mockResolvedValue(rejectedApplication);

    const user = userEvent.setup();

    renderApplicationDetails();

    await screen.findByText("Ahmed Abdul");

    await user.click(screen.getByRole("button", { name: "Reject" }));

    await waitFor(() => {
      expect(updateApplicationStatus).toHaveBeenCalledWith("7", "Rejected");
    });

    expect(await screen.findByText("Rejected")).toBeInTheDocument();
  });

  it("disables the appropriate decision button for an already decided application", async () => {
    getApplicationById.mockResolvedValue({
      ...application,
      status: "Approved",
    });

    renderApplicationDetails();

    await screen.findByText("Ahmed Abdul");

    expect(screen.getByRole("button", { name: "Approve" })).toBeDisabled();

    expect(screen.getByRole("button", { name: "Reject" })).not.toBeDisabled();
  });

  it("displays an error when updating the application status fails", async () => {
    getApplicationById.mockResolvedValue(application);

    updateApplicationStatus.mockRejectedValue(
      new Error("Unable to update application"),
    );

    const user = userEvent.setup();

    renderApplicationDetails();

    await screen.findByText("Ahmed Abdul");

    await user.click(screen.getByRole("button", { name: "Approve" }));

    expect(
      await screen.findByText("Unable to update application"),
    ).toBeInTheDocument();
  });
});
