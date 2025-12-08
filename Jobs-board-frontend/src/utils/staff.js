import { fetchWithAuth } from "./api.js";

export async function markCompanyAsStar(company) {
  return fetchWithAuth("/staff/star-company", {
    method: "POST",
    body: JSON.stringify({ company })
  });
}

export async function unstarCompany(company) {
  return fetchWithAuth(`/staff/star-company/${company}`, {
    method: "DELETE"
  });
}