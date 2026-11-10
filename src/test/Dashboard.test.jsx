import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Dashboard from "../pages/Dashboard.jsx";
import { ApplicationProvider } from "../context/ApplicationContext.jsx";
import * as api from "../services/api.js";

vi.mock("../services/api.js", () => ({
  getMyApplication: vi.fn(),
}));

function renderDashboard() {
  return render(
    <MemoryRouter>
      <ApplicationProvider>
        <Dashboard />
      </ApplicationProvider>
    </MemoryRouter>,
  );
}

describe("Dashboard", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("shows the loading state initially", () => {
    api.getMyApplication.mockReturnValue(new Promise(() => {}));

    renderDashboard();

    expect(
      screen.getByText("Fetching your application..."),
    ).toBeInTheDocument();
  });

  it("shows the empty state when there is no application", async () => {
    api.getMyApplication.mockResolvedValue(null);

    renderDashboard();

    expect(
      await screen.findByText("No application on file"),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("link", { name: /start an application/i }),
    ).toHaveAttribute("href", "/apply");
  });

  it("fetches and displays the student's application", async () => {
    const application = {
      id: "550e8400-e29b-41d4-a716-446655440000",
      status: "Pending",
      personal: {
        firstName: "Sherif",
        lastName: "Abdulazeez",
      },
      academic: {
        programme: "Computer Science",
      },
      submittedAt: "2026-08-13T10:00:00.000Z",
    };

    api.getMyApplication.mockResolvedValue(application);

    renderDashboard();

    expect(
      await screen.findByText("Track your application"),
    ).toBeInTheDocument();

    expect(api.getMyApplication).toHaveBeenCalledTimes(1);
    expect(screen.getByText(application.id)).toBeInTheDocument();
    expect(screen.getByText("Sherif Abdulazeez")).toBeInTheDocument();
    expect(
      screen.getByText("Applying for Computer Science"),
    ).toBeInTheDocument();
  });

  it("displays the application's status", async () => {
    api.getMyApplication.mockResolvedValue({
      id: "550e8400-e29b-41d4-a716-446655440001",
      status: "Approved",
      personal: {
        firstName: "Sherif",
        lastName: "Abdulazeez",
      },
      academic: {
        programme: "Software Engineering",
      },
    });

    renderDashboard();

    expect(await screen.findByText("Approved")).toBeInTheDocument();
  });

  it("displays the correct message for an approved application", async () => {
    api.getMyApplication.mockResolvedValue({
      id: "550e8400-e29b-41d4-a716-446655440002",
      status: "Approved",
      personal: {
        firstName: "Sherif",
        lastName: "Abdulazeez",
      },
      academic: {
        programme: "Computer Science",
      },
    });

    renderDashboard();

    expect(
      await screen.findByText(
        "Congratulations — your application has been approved!",
      ),
    ).toBeInTheDocument();
  });

  it("displays an error when the application cannot be fetched", async () => {
    api.getMyApplication.mockRejectedValue(
      new Error("Failed to fetch application"),
    );

    renderDashboard();

    expect(
      await screen.findByText("Failed to fetch application"),
    ).toBeInTheDocument();

    expect(screen.getByRole("button", { name: /retry/i })).toBeInTheDocument();
  });
});
