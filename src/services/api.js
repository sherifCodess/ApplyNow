import axios from "axios";

const client = axios.create({
  baseURL: "http://localhost:4000",
  timeout: 8000,
});

function unwrap(promise) {
  return promise.then((res) => res.data);
}

function friendlyError(error) {
  if (error.code === "ECONNABORTED") {
    return new Error("The request timed out. Please try again.");
  }
  if (!error.response) {
    return new Error(
      "Can't reach the admissions server. Make sure it's running and try again."
    );
  }
  return new Error(
    error.response.data?.message || "Something went wrong. Please try again."
  );
}

export async function createApplication(payload) {
  try {
    return await unwrap(client.post("/applications", payload));
  } catch (error) {
    throw friendlyError(error);
  }
}

export async function getApplications() {
  try {
    return await unwrap(client.get("/applications"));
  } catch (error) {
    throw friendlyError(error);
  }
}

export async function getApplicationById(id) {
  try {
    return await unwrap(client.get(`/applications/${id}`));
  } catch (error) {
    throw friendlyError(error);
  }
}

export async function updateApplicationStatus(id, status) {
  try {
    return await unwrap(
      client.patch(`/applications/${id}`, {
        status,
        reviewedAt: new Date().toISOString(),
      })
    );
  } catch (error) {
    throw friendlyError(error);
  }
}

export default client;
