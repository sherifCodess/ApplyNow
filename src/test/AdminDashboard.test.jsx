import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import userEvent from "@testing-library/user-event";
import AdminDashboard from "../pages/AdminDashboard.jsx";
import { getApplications } from "../services/api.js";

vi.mock("../services/api.js", () => ({
  getApplications: vi.fn(),
}));

const applications = [
  {
    id: 1,
    status: "Pending",
    personal: {
      firstName: "Ahmed",
      lastName: "Abdul",
    },
    academic: {
      programme: "Computer Science",
    },
    submittedAt: "2026-08-01T10:00:00Z",
  },

  {
    id: 2,
    status: "Approved",
    personal: {
      firstName: "Fatima",
      lastName: "Ibrahim",
    },
    academic: {
      programme: "Software Engineering",
    },
    submittedAt: "2026-08-02T10:00:00Z",
  },
  {
    id: 3,
    status: "Rejected",
    personal: {
      firstName: "Yusuf",
      lastName: "Musa",
    },
    academic: {
      programme: "Information Technology",
    },
    submittedAt: "2026-08-03T10:00:00Z",
  },
];

function renderAdminDashboard() {
  return render(
    <MemoryRouter>
      <AdminDashboard />
    </MemoryRouter>,
  );
}

describe("AdminDashboard", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("shows the loading state initially", () => {
    getApplications.mockReturnValue(new Promise(() => {}));

    renderAdminDashboard();

    expect(screen.getByText("Loading applications...")).toBeInTheDocument();
  });

  it("displays applications after fetching", async () => {
    getApplications.mockResolvedValue(applications);

    renderAdminDashboard();

    expect(await screen.findByText("Ahmed Abdul")).toBeInTheDocument();
    expect(screen.getByText("Fatima Ibrahim")).toBeInTheDocument();
    expect(screen.getByText("Yusuf Musa")).toBeInTheDocument();
  });

  it("shows the empty state when there are no applications", async () => {
    getApplications.mockResolvedValue([]);

    renderAdminDashboard();

    expect(await screen.findByText("No applications here")).toBeInTheDocument();
    expect(
      screen.getByText("Nothing matches this filter yet."),
    ).toBeInTheDocument();
  });

  it("filters applications by Pending status", async () => {
    getApplications.mockResolvedValue(applications);

    const user = userEvent.setup();

    renderAdminDashboard();

    await screen.findByText("Ahmed Abdul");

    await user.click(screen.getByRole("button", { name: "Pending" }));

    expect(screen.getByText("Ahmed Abdul")).toBeInTheDocument();
    expect(screen.queryByText("Fatima Ibrahim")).not.toBeInTheDocument();
    expect(screen.queryByText("Yusuf Musa")).not.toBeInTheDocument();
  });

  it("filters applications by Approved status", async () => {
    getApplications.mockResolvedValue(applications);

    const user = userEvent.setup();

    renderAdminDashboard();

    await screen.findByText("Ahmed Abdul");

    await user.click(screen.getByRole("button", { name: "Approved" }));

    expect(screen.getByText("Fatima Ibrahim")).toBeInTheDocument();
    expect(screen.queryByText("Ahmed Abdul")).not.toBeInTheDocument();
    expect(screen.queryByText("Yusuf Musa")).not.toBeInTheDocument();
  });

  it("filters applications by Rejected status", async () => {
    getApplications.mockResolvedValue(applications);

    const user = userEvent.setup();

    renderAdminDashboard();

    await screen.findByText("Ahmed Abdul");

    await user.click(screen.getByRole("button", { name: "Rejected" }));

    expect(screen.getByText("Yusuf Musa")).toBeInTheDocument();
    expect(screen.queryByText("Ahmed Abdul")).not.toBeInTheDocument();
    expect(screen.queryByText("Fatima Ibrahim")).not.toBeInTheDocument();
  });

  it("displays an error when applications cannot be fetched", async () => {
    getApplications.mockRejectedValue(
      new Error("Unable to fetch applications"),
    );

    renderAdminDashboard();

    expect(
      await screen.findByText("Unable to fetch applications"),
    ).toBeInTheDocument();
  });

  it("provides a Review link for each application", async () => {
    getApplications.mockResolvedValue(applications);

    renderAdminDashboard();

    await screen.findByText("Ahmed Abdul");

    const reviewLinks = screen.getAllByRole("link", { name: "Review" });

    expect(reviewLinks).toHaveLength(3);

    expect(reviewLinks[0]).toHaveAttribute("href", "/admin/applications/1");

    expect(reviewLinks[1]).toHaveAttribute("href", "/admin/applications/2");

    expect(reviewLinks[2]).toHaveAttribute("href", "/admin/applications/3");
  });
});
