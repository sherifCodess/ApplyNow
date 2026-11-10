// @vitest-environment node

import { describe, expect, it } from "vitest";
import request from "supertest";
import app from "../src/app.js";

describe("GET /api/v1/health", () => {
  it("returns a successful health response", async () => {
    const response = await request(app).get("/api/v1/health");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      success: true,
      message: "ApplyNow API is running.",
      data: {
        status: "ok",
      },
    });
  });

  it("includes security headers", async () => {
    const response = await request(app).get("/api/v1/health");

    expect(response.headers["x-content-type-options"]).toBe("nosniff");
    expect(response.headers["x-powered-by"]).toBeUndefined();
  });
});
