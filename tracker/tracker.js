const SESSION_KEY = "user_analytics_session_id";

function getSessionId() {
  let sessionId = localStorage.getItem(SESSION_KEY);

  if (!sessionId) {
    sessionId = crypto.randomUUID();
    localStorage.setItem(SESSION_KEY, sessionId);
  }

  return sessionId;
}


const API_URL = "http://localhost:3000/api/events";

async function trackPageView() {
  const eventData = {
    session_id: getSessionId(),
    event_type: "page_view",
    page_url: window.location.href,
    timestamp: new Date().toISOString(),
  };

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(eventData),
    });

    if (!response.ok) {
      throw new Error(`Failed to track page view: ${response.status}`);
    }

    console.log("Page view tracked successfully");
  } catch (error) {
    console.error("Error tracking page view:", error);
  }
}
