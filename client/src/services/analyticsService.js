const API_BASE_URL = "http://localhost:3000/api";

export async function fetchSessions() {
  const response = await fetch(`${API_BASE_URL}/sessions`);

  if (!response.ok) {
    throw new Error("Failed to fetch sessions");
  }

  const result = await response.json();
  return result.data;
}
