import { fetchWithAuth, getLoggedInUser } from "./api.js";


export async function markJobInterested(job_id) {
  const { user_id } = getLoggedInUser();

  const result = await fetchWithAuth("/applications", {
    method: "POST",
    body: JSON.stringify({
      user_id,
      job_id,
      status: "Interested" 
    }),
  });

  // Check if the request was successful
  if (!result || !result.response.ok) {
    throw new Error(result?.data?.error || "Failed to create application");
  }

  return result;
}


export async function fetchUserApplications() {
  const { user_id } = getLoggedInUser();
  return fetchWithAuth(`/applications?userId=${user_id}`);
}

export async function updateApplicationStatus(application_id, status) {
  return fetchWithAuth(`/applications/${application_id}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
}
