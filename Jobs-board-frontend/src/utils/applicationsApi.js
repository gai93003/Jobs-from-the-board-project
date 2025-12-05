import { fetchWithAuth } from "./api";

// POST /api/applications
export async function createApplication({ userId, jobId, status }) {
  const { response, data } = await fetchWithAuth("/applications", {
    method: "POST",
    body: JSON.stringify({
      user_id: userId,
      job_id: jobId,
      status,
    }),
  });
  if (!response.ok) throw new Error(data.error || "Failed to create application");
  return data.application;
}

// PATCH /api/applications/:id/status
export async function updateApplicationStatus(applicationId, status) {
  const { response, data } = await fetchWithAuth(`/applications/${applicationId}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
  if (!response.ok) throw new Error(data.error || "Failed to update status");
  return data.application;
}

// GET /api/applications/by?userId=&jobId=
export async function getApplicationByUserAndJob(userId, jobId) {
  const { response, data } = await fetchWithAuth(
    `/applications/by?userId=${userId}&jobId=${jobId}`
  );
  if (!response.ok) throw new Error(data.error || "Failed to fetch application");
  return data.application; // can be null/undefined
}

// GET /api/applic
export async function getApplicationsByUser(userId) {
  const { response, data } = await fetchWithAuth(`/applications?userId=${userId}`);
  if (!response.ok) throw new Error(data.error || "Failed to fetch applications");
  return data.applications || [];
}
