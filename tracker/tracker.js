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


async function trackClick(event) {
  const eventData = {
    session_id: getSessionId(),
    event_type: "click",
    page_url: window.location.href,
    timestamp: new Date().toISOString(),
    x: event.pageX,
    y: event.pageY,
    viewport_width: window.innerWidth,
    viewport_height: window.innerHeight,
    scroll_x: window.scrollX,
    scroll_y: window.scrollY,
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
      throw new Error(`Failed to track click: ${response.status}`);
    }

    console.log("Click tracked successfully");
  } catch (error) {
    console.error("Error tracking click:", error);
  }
}


trackPageView();
document.addEventListener("click", trackClick);