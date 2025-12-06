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

// export function getUserIdFromToken() {
//   const token = localStorage.getItem("token");
//   if (!token) return null;

//   try {
//     const payload = JSON.parse(atob(token.split(".")[1]));
//     return payload.user_id;
//   } catch (err) {
//     console.error("Invalid token", err);
//     return null;
//   }
// }


export function getLoggedInUser() {
  const token = localStorage.getItem("token");
  const userStr = localStorage.getItem("user");

  let decodedUserId = null;
  let storedUser = null;

  // Decode user_id from token
  if (token) {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      decodedUserId = payload.user_id;
    } catch (err) {
      console.error("Invalid token", err);
    }
  }

  // Load full user data from localStorage
  if (userStr) {
    try {
      storedUser = JSON.parse(userStr);
    } catch (err) {
      console.error("Invalid user object in localStorage", err);
    }
  }

  // Combine both
  return {
    user_id: decodedUserId,
    full_name: storedUser?.full_name || null,
    email: storedUser?.email || null,
    role: storedUser?.user_role || null,
    raw: storedUser || null
  };
}

// Example usage:
// const { response, data } = await fetchWithAuth("/jobs");
// if (response.ok) { /* handle success */ }
