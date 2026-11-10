
import axios from "axios";

const client = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api/v1",
  timeout: 10000,
  withCredentials: true,
});

function unwrap(promise) {
  return promise.then((response) => response.data.data);
}

function friendlyError(error) {
  if (error?.code === "ECONNABORTED") {
    return new Error("The request timed out. Please try again.");
  }

  if (!error?.response) {
    return new Error(
      "Can't reach the admissions server. Make sure it is running and try again."
    );
  }

  return new Error(
    error.response.data?.message || "Something went wrong. Please try again."
  );
}

async function request(promise) {
  try {
    return await unwrap(promise);
  } catch (error) {
    throw friendlyError(error);
  }
}

// Authentication

export function registerStudent(payload) {
  return request(client.post("/auth/register", payload));
}

export function verifyEmail(token) {
  return request(client.post("/auth/verify-email", { token }));
}

export function resendVerificationEmail(email) {
  return request(client.post("/auth/verification/resend", { email }));
}

export function loginStudent(payload) {
  return request(client.post("/auth/login", payload));
}

export function getCurrentUser() {
  return request(client.get("/auth/me"));
}

export function logoutStudent() {
  return request(client.post("/auth/logout"));
}

// Applications

export function createApplication(payload) {
  return request(client.post("/applications", payload));
}

export function getMyApplication() {
  return request(client.get("/applications/mine"));
}

export function getApplications(status = "All") {
  const params = status === "All" ? {} : { status };

  return request(client.get("/applications", { params }));
}

export function getApplicationById(id) {
  return request(client.get(`/applications/${id}`));
}

export function updateApplicationStatus(id, status) {
  return request(client.patch(`/applications/${id}`, { status }));
}

export default client;
