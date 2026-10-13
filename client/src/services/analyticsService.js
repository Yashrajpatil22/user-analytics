const API_BASE_URL = "http://localhost:3000/api";

export async function fetchSessions() {
  const response = await fetch(`${API_BASE_URL}/sessions`);

  if (!response.ok) {
    throw new Error("Failed to fetch sessions");
  }

  const result = await response.json();
  return result.data;
}

export async function fetchSessionEvents(sessionId) {
  const response = await fetch(
    `${API_BASE_URL}/sessions/${encodeURIComponent(sessionId)}/events`,
  );

  if (!response.ok) {
    throw new Error("Failed to fetch session events");
  }

  const result = await response.json();
  return result.data;
}

export async function fetchPageUrls() {
  const response = await fetch(`${API_BASE_URL}/events/pages`);

  if (!response.ok) {
    throw new Error("Failed to fetch page URLs");
  }

  const result = await response.json();
  return result.data;
}

export async function fetchPageClicks(pageUrl) {
  const response = await fetch(
    `${API_BASE_URL}/events/clicks?pageUrl=${encodeURIComponent(pageUrl)}`,
  );

  if (!response.ok) {
    throw new Error("Failed to fetch page click data");
  }

  const result = await response.json();
  return result.data;
}