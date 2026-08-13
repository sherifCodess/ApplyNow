import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { ApplicationProvider } from "../context/ApplicationContext.jsx";
import Application from "../pages/Application.jsx";
import { createApplication } from "../services/api.js";
import { Route, Routes, MemoryRouter } from "react-router-dom";
import Confirmation from "../pages/Confirmation.jsx";

function renderApplication() {
  return render(
    <MemoryRouter>
      <ApplicationProvider>
        <Application />
      </ApplicationProvider>
    </MemoryRouter>,
  );
}

vi.mock("../services/api.js", () => ({
  createApplication: vi.fn(),
}));

describe("Application page", () => {
  it("displays the Personal Information step initially", () => {
    renderApplication();

    expect(
      screen.getByRole("heading", {
        name: "Personal Information",
      }),
    ).toBeInTheDocument();
  });

  it("displays the personal information form", () => {
    renderApplication();

    expect(
      screen.getByRole("textbox", { name: "First Name" }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("textbox", { name: "Last Name" }),
    ).toBeInTheDocument();

    expect(screen.getByRole("textbox", { name: "Email" })).toBeInTheDocument();

    expect(
      screen.getByRole("textbox", { name: "Phone Number" }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("textbox", { name: "Address" }),
    ).toBeInTheDocument();

    expect(screen.getByLabelText("Date of Birth")).toBeInTheDocument();

    expect(screen.getByLabelText("Gender")).toBeInTheDocument();
  });

  it("disables the Back button on the first step", () => {
    renderApplication();

    expect(screen.getByRole("button", { name: "Back" })).toBeDisabled();
  });

  it("displays the Next button", () => {
    renderApplication();

    expect(screen.getByRole("button", { name: "Next" })).toBeInTheDocument();
  });
});

it("prevents moving to the next step when personal information is invalid", async () => {
  const user = userEvent.setup();

  renderApplication();

  const nextButton = screen.getByRole("button", { name: "Next" });

  await user.click(nextButton);

  expect(
    screen.getByRole("heading", {
      name: "Personal Information",
    }),
  ).toBeInTheDocument();

  expect(screen.getByText("First name is required.")).toBeInTheDocument();

  expect(screen.getByText("Last name is required.")).toBeInTheDocument();

  expect(screen.getByText("Email is required.")).toBeInTheDocument();

  expect(screen.getByText("Phone number is required.")).toBeInTheDocument();
});

it("moves to the Academic Information step when personal information is valid", async () => {
  const user = userEvent.setup();

  renderApplication();

  await user.type(
    screen.getByRole("textbox", { name: "First Name" }),
    "Sherif",
  );

  await user.type(
    screen.getByRole("textbox", { name: "Last Name" }),
    "Abdulazeez",
  );

  await user.type(screen.getByLabelText("Date of Birth"), "2000-01-01");

  await user.selectOptions(screen.getByLabelText("Gender"), "Male");

  await user.type(
    screen.getByRole("textbox", { name: "Email" }),
    "sherif@example.com",
  );

  await user.type(
    screen.getByRole("textbox", { name: "Phone Number" }),
    "+2348012345678",
  );

  await user.type(
    screen.getByRole("textbox", { name: "Address" }),
    "Lagos, Nigeria",
  );

  await user.click(screen.getByRole("button", { name: "Next" }));

  expect(
    screen.getByRole("heading", {
      name: "Academic Information",
    }),
  ).toBeInTheDocument();
});

it("prevents moving to the Guardian step when academic information is invalid", async () => {
  const user = userEvent.setup();

  renderApplication();

  // Fill valid personal information
  await user.type(
    screen.getByRole("textbox", { name: "First Name" }),
    "Sherif",
  );

  await user.type(
    screen.getByRole("textbox", { name: "Last Name" }),
    "Abdulazeez",
  );

  await user.type(screen.getByLabelText("Date of Birth"), "2000-01-01");

  await user.selectOptions(screen.getByLabelText("Gender"), "Male");

  await user.type(
    screen.getByRole("textbox", { name: "Email" }),
    "sherif@example.com",
  );

  await user.type(
    screen.getByRole("textbox", { name: "Phone Number" }),
    "+2348012345678",
  );

  await user.type(
    screen.getByRole("textbox", { name: "Address" }),
    "Lagos, Nigeria",
  );

  // Move to Academic step
  await user.click(screen.getByRole("button", { name: "Next" }));

  // Try to continue without filling Academic information
  await user.click(screen.getByRole("button", { name: "Next" }));

  // We should still be on Academic Information
  expect(
    screen.getByRole("heading", {
      name: "Academic Information",
    }),
  ).toBeInTheDocument();

  // Validation errors should appear
  expect(screen.getByText("Previous school is required.")).toBeInTheDocument();

  expect(screen.getByText("Qualification is required.")).toBeInTheDocument();

  expect(screen.getByText("Graduation year is required.")).toBeInTheDocument();

  expect(screen.getByText("GPA is required.")).toBeInTheDocument();

  expect(
    screen.getByText("Intended programme is required."),
  ).toBeInTheDocument();
});

it("moves to the Guardian step when academic information is valid", async () => {
  const user = userEvent.setup();

  renderApplication();

  // Fill valid Personal Information
  await user.type(
    screen.getByRole("textbox", { name: "First Name" }),
    "Sherif",
  );

  await user.type(
    screen.getByRole("textbox", { name: "Last Name" }),
    "Abdulazeez",
  );

  await user.type(screen.getByLabelText("Date of Birth"), "2000-01-01");

  await user.selectOptions(screen.getByLabelText("Gender"), "Male");

  await user.type(
    screen.getByRole("textbox", { name: "Email" }),
    "sherif@example.com",
  );

  await user.type(
    screen.getByRole("textbox", { name: "Phone Number" }),
    "+2348012345678",
  );

  await user.type(
    screen.getByRole("textbox", { name: "Address" }),
    "Lagos, Nigeria",
  );

  // Move to Academic
  await user.click(screen.getByRole("button", { name: "Next" }));

  // Fill valid Academic Information
  await user.type(
    screen.getByRole("textbox", { name: "Previous School" }),
    "Federal Government College",
  );

  await user.selectOptions(
    screen.getByLabelText("Qualification"),
    "WAEC / SSCE",
  );

  await user.type(screen.getByLabelText("Graduation Year"), "2024");

  await user.type(screen.getByLabelText("GPA (0 - 5.0)"), "4.2");

  await user.selectOptions(
    screen.getByLabelText("Intended Programme"),
    "Computer Science",
  );

  // Move to Guardian
  await user.click(screen.getByRole("button", { name: "Next" }));

  // Verify Guardian step
  expect(
    screen.getByRole("heading", {
      name: "Guardian Information",
    }),
  ).toBeInTheDocument();

  // Verify Guardian form is actually rendered
  expect(
    screen.getByRole("textbox", { name: "Guardian Name" }),
  ).toBeInTheDocument();

  expect(screen.getByLabelText("Relationship")).toBeInTheDocument();

  expect(
    screen.getByRole("textbox", { name: "Guardian Phone" }),
  ).toBeInTheDocument();

  expect(
    screen.getByRole("textbox", {
      name: "Guardian Email (optional)",
    }),
  ).toBeInTheDocument();

  expect(
    screen.getByRole("textbox", { name: "Guardian Address" }),
  ).toBeInTheDocument();
});

it("submits a complete application successfully", async () => {
  const user = userEvent.setup();

  createApplication.mockResolvedValue({
    id: "app-123",
    status: "Pending",
  });

  renderApplication();

  // -------------------------
  // Personal Information
  // -------------------------

  await user.type(
    screen.getByRole("textbox", { name: "First Name" }),
    "Sherif",
  );

  await user.type(
    screen.getByRole("textbox", { name: "Last Name" }),
    "Abdulazeez",
  );

  await user.type(screen.getByLabelText("Date of Birth"), "2000-01-01");

  await user.selectOptions(screen.getByLabelText("Gender"), "Male");

  await user.type(
    screen.getByRole("textbox", { name: "Email" }),
    "sherif@example.com",
  );

  await user.type(
    screen.getByRole("textbox", { name: "Phone Number" }),
    "+2348012345678",
  );

  await user.type(
    screen.getByRole("textbox", { name: "Address" }),
    "Lagos, Nigeria",
  );

  await user.click(screen.getByRole("button", { name: "Next" }));

  // -------------------------
  // Academic Information
  // -------------------------

  await user.type(
    screen.getByRole("textbox", { name: "Previous School" }),
    "Federal Government College",
  );

  await user.selectOptions(
    screen.getByLabelText("Qualification"),
    "WAEC / SSCE",
  );

  await user.type(screen.getByLabelText("Graduation Year"), "2024");

  await user.type(screen.getByLabelText("GPA (0 - 5.0)"), "4.2");

  await user.selectOptions(
    screen.getByLabelText("Intended Programme"),
    "Computer Science",
  );

  await user.click(screen.getByRole("button", { name: "Next" }));

  // -------------------------
  // Guardian Information
  // -------------------------

  await user.type(
    screen.getByRole("textbox", { name: "Guardian Name" }),
    "Ahmed Abdulazeez",
  );

  await user.selectOptions(screen.getByLabelText("Relationship"), "Parent");

  await user.type(
    screen.getByRole("textbox", { name: "Guardian Phone" }),
    "+2348012345678",
  );

  await user.type(
    screen.getByRole("textbox", {
      name: "Guardian Email (optional)",
    }),
    "ahmed@example.com",
  );

  await user.type(
    screen.getByRole("textbox", { name: "Guardian Address" }),
    "Lagos, Nigeria",
  );

  // -------------------------
  // Submit
  // -------------------------

  await user.click(
    screen.getByRole("button", {
      name: "Submit Application",
    }),
  );

  // Verify API was called
  expect(createApplication).toHaveBeenCalledTimes(1);

  // Verify the submitted payload
  expect(createApplication).toHaveBeenCalledWith(
    expect.objectContaining({
      personal: expect.objectContaining({
        firstName: "Sherif",
        lastName: "Abdulazeez",
        email: "sherif@example.com",
      }),
      academic: expect.objectContaining({
        previousSchool: "Federal Government College",
        programme: "Computer Science",
      }),
      guardian: expect.objectContaining({
        guardianName: "Ahmed Abdulazeez",
        relationship: "Parent",
      }),
      status: "Pending",
    }),
  );

  // Verify the application ID was saved
  expect(window.localStorage.getItem("applynow_last_application_id")).toBe(
    "app-123",
  );
});

it("redirects to the confirmation page after successful submission", async () => {
  const user = userEvent.setup();

  createApplication.mockResolvedValue({
    id: "app-456",
    status: "Pending",
  });

  render(
    <ApplicationProvider>
      <MemoryRouter initialEntries={["/apply"]}>
        <Routes>
          <Route path="/apply" element={<Application />} />
          <Route path="/confirmation" element={<Confirmation />} />
        </Routes>
      </MemoryRouter>
    </ApplicationProvider>,
  );

  // Personal
  await user.type(
    screen.getByRole("textbox", { name: "First Name" }),
    "Sherif",
  );

  await user.type(
    screen.getByRole("textbox", { name: "Last Name" }),
    "Abdulazeez",
  );

  await user.type(screen.getByLabelText("Date of Birth"), "2000-01-01");

  await user.selectOptions(screen.getByLabelText("Gender"), "Male");

  await user.type(
    screen.getByRole("textbox", { name: "Email" }),
    "sherif@example.com",
  );

  await user.type(
    screen.getByRole("textbox", { name: "Phone Number" }),
    "+2348012345678",
  );

  await user.type(
    screen.getByRole("textbox", { name: "Address" }),
    "Lagos, Nigeria",
  );

  await user.click(screen.getByRole("button", { name: "Next" }));

  // Academic
  await user.type(
    screen.getByRole("textbox", { name: "Previous School" }),
    "Federal Government College",
  );

  await user.selectOptions(
    screen.getByLabelText("Qualification"),
    "WAEC / SSCE",
  );

  await user.type(screen.getByLabelText("Graduation Year"), "2024");

  await user.type(screen.getByLabelText("GPA (0 - 5.0)"), "4.2");

  await user.selectOptions(
    screen.getByLabelText("Intended Programme"),
    "Computer Science",
  );

  await user.click(screen.getByRole("button", { name: "Next" }));

  // Guardian
  await user.type(
    screen.getByRole("textbox", { name: "Guardian Name" }),
    "Ahmed Abdulazeez",
  );

  await user.selectOptions(screen.getByLabelText("Relationship"), "Parent");

  await user.type(
    screen.getByRole("textbox", { name: "Guardian Phone" }),
    "+2348012345678",
  );

  await user.type(
    screen.getByRole("textbox", {
      name: "Guardian Email (optional)",
    }),
    "ahmed@example.com",
  );

  await user.type(
    screen.getByRole("textbox", { name: "Guardian Address" }),
    "Lagos, Nigeria",
  );

  await user.click(
    screen.getByRole("button", {
      name: "Submit Application",
    }),
  );

  // Wait for navigation to complete
  // Verify confirmation page
  expect(
    await screen.findByRole("heading", {
      name: "Application submitted",
    }),
  ).toBeInTheDocument();

  expect(screen.getByText("Application ID")).toBeInTheDocument();

  expect(screen.getByText("APP-app-456")).toBeInTheDocument();

  // Verify the confirmation page is being displayed
  expect(
    screen.getByRole("heading", {
      name: /application submitted/i,
    }),
  ).toBeInTheDocument();
});
