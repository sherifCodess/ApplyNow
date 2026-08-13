import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Confirmation from "../pages/Confirmation.jsx";
import { ApplicationProvider } from "../context/ApplicationContext.jsx";

function renderConfirmation() {
  return render(
    <MemoryRouter>
      <ApplicationProvider>
        <Confirmation />
      </ApplicationProvider>
    </MemoryRouter>,
  );
}

describe("Confirmation", () => {
  it("redirects to the application page when there is no submission", () => {
    renderConfirmation();

    expect(window.location.pathname).toBe("/");
  });

  it("displays the confirmation page after a successful submission", () => {
    // We'll add the submission to the context in the next step.
  });

  it("displays the applicant name and application ID", () => {
    // We'll add the submission to the context in the next step.
  });

  it("provides a link to track the application status", () => {
    // We'll add the submission to the context in the next step.
  });
});
