// API utility for making authenticated requests

const API_URL = "http://localhost:5501/api";

// Logout function - clears token and redirects to login
export function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  window.location.href = "/login";
}

// Helper function to make authenticated API calls
export async function fetchWithAuth(endpoint, options = {}) {
  const token = localStorage.getItem("token");
  
  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  // Add authorization header if token exists
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
    });

    const data = await response.json();

    // If unauthorized, clear token and redirect to login
    if (response.status === 401 || response.status === 403) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
      return null;
    }

    return { response, data };
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
}

// Example usage:
// const { response, data } = await fetchWithAuth("/jobs");
// if (response.ok) { /* handle success */ }
