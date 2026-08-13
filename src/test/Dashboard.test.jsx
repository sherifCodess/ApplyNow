import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Dashboard from "../pages/Dashboard.jsx";
import { ApplicationProvider } from "../context/ApplicationContext.jsx";
import * as api from "../services/api.js";

vi.mock("../services/api.js", () => ({
  getApplicationById: vi.fn(),
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
    window.localStorage.clear();
  });

  it("shows the loading state initially", () => {
    window.localStorage.setItem("applynow_last_application_id", "123");

    api.getApplicationById.mockReturnValue(new Promise(() => {}));

    renderDashboard();

    expect(
      screen.getByText("Fetching your application..."),
    ).toBeInTheDocument();
  });

  it("shows the empty state when there is no application", async () => {
    renderDashboard();

    expect(
      await screen.findByText("No application on file"),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("link", { name: /start an application/i }),
    ).toHaveAttribute("href", "/apply");
  });

  it("fetches and displays an application", async () => {
    window.localStorage.setItem("applynow_last_application_id", "123");

    api.getApplicationById.mockResolvedValue({
      id: 123,
      status: "Pending",
      personal: {
        firstName: "Sherif",
        lastName: "Abdulazeez",
      },
      academic: {
        programme: "Computer Science",
      },
      submittedAt: "2026-08-13T10:00:00.000Z",
    });

    renderDashboard();

    expect(
      await screen.findByText("Track your application"),
    ).toBeInTheDocument();

    expect(api.getApplicationById).toHaveBeenCalledWith("123");

    expect(screen.getByText("APP-123")).toBeInTheDocument();
    expect(screen.getByText("Sherif Abdulazeez")).toBeInTheDocument();
    expect(
      screen.getByText("Applying for Computer Science"),
    ).toBeInTheDocument();
  });

  it("displays the application's status", async () => {
    window.localStorage.setItem("applynow_last_application_id", "456");

    api.getApplicationById.mockResolvedValue({
      id: 456,
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
    window.localStorage.setItem("applynow_last_application_id", "789");

    api.getApplicationById.mockResolvedValue({
      id: 789,
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
    window.localStorage.setItem("applynow_last_application_id", "999");

    api.getApplicationById.mockRejectedValue(
      new Error("Failed to fetch application"),
    );

    renderDashboard();

    expect(
      await screen.findByText("Failed to fetch application"),
    ).toBeInTheDocument();

    expect(screen.getByRole("button", { name: /retry/i })).toBeInTheDocument();
  });
});
