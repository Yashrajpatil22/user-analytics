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

function renderHeatmapMarkers(clicks) {
  document
    .querySelectorAll("[data-user-analytics-heatmap-marker]")
    .forEach((marker) => marker.remove());

  clicks.forEach((click) => {
    const marker = document.createElement("div");

    const scale =
      window.innerWidth / (click.viewport_width || window.innerWidth);

    marker.dataset.userAnalyticsHeatmapMarker = "true";
    marker.style.position = "absolute";
    marker.style.left = `${click.x * scale}px`;
    marker.style.top = `${click.y * scale}px`;
    marker.style.width = "14px";
    marker.style.height = "14px";
    marker.style.borderRadius = "50%";
    marker.style.backgroundColor = "rgba(37, 99, 235, 0.75)";
    marker.style.border = "2px solid rgba(191, 219, 254, 0.9)";
    marker.style.boxSizing = "border-box";
    marker.style.pointerEvents = "none";
    marker.style.zIndex = "2147483647";
    marker.style.transform = "translate(-50%, -50%)";

    document.body.appendChild(marker);
  });
}

window.addEventListener("message", (event) => {
  if (event.source !== window.parent) return;

  if (event.data?.type !== "USER_ANALYTICS_HEATMAP") return;

  if (!Array.isArray(event.data.clicks)) return;

  renderHeatmapMarkers(event.data.clicks);
});

trackPageView();
document.addEventListener("click", trackClick);