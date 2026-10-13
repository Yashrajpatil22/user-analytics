# Simple User Analytics Application

A lightweight, full-stack analytics application that tracks user interactions on webpages and visualizes them through a dashboard. It captures page views and click events, groups activity by session, and provides a click heatmap to help understand user behavior.

## Features

- **Client-side tracking:** A reusable JavaScript tracking script that records page views and clicks.
- **Session tracking:** Assigns a persistent session identifier using browser `localStorage`.
- **Event collection:** Captures event type, page URL, timestamp, and click coordinates.
- **Sessions dashboard:** Displays sessions with their total event counts.
- **User journey:** View a session's events in chronological order.
- **Click heatmap:** Select a page URL and visualize recorded click positions.
- **Website preview:** Displays the selected webpage when embedding is supported, with a fallback visualization when necessary.
- **Persistent storage:** Stores structured event records in MongoDB.

## Live Demo

- **Frontend Dashboard:** https://user-analytics-nu.vercel.app
- **Backend API:** https://user-analytics-u55g.onrender.com

The demo website currently runs locally using VS Code Live Server. The tracking script is configured to send events to the deployed backend when testing the live dashboard.

## Tech Stack

| Layer | Technologies |
|---|---|
| Frontend | React, Vite, Tailwind CSS |
| Backend | Node.js, Express.js |
| Database | MongoDB, Mongoose |
| Event tracking | Vanilla JavaScript |
| API communication | REST API, Fetch API |

## Project Structure

```text
user-analytics/
├── client/                 # React dashboard
├── server/                 # Express backend and API routes
│   └── src/
│       ├── controllers/
│       ├── middleware/
│       ├── models/
│       ├── routes/
│       └── index.js
├── tracker/
│   └── tracker.js          # Reusable tracking script
├── demo/
│   └── index.html          # Demo webpage
├── .gitignore
└── README.md
```

## Prerequisites

Ensure the following are installed or available:

- Node.js and npm
- MongoDB Atlas account or a local MongoDB instance
- Git
- VS Code Live Server extension (for running the demo webpage locally)

## Setup and Installation

### 1. Clone the repository

```bash
git clone https://github.com/Yashrajpatil22/user-analytics.git
cd user-analytics
```

### 2. Configure the backend

Navigate to the server directory and install dependencies.

```bash
cd server
npm install
```

Create a `.env` file inside the `server/` directory:

```env
PORT=3000
MONGODB_URI=your_mongodb_connection_string
```

Replace the MongoDB connection string with your own database connection string.

Ensure that your MongoDB database is accessible and that the connection string has the required permissions.

Start the backend:

```bash
npm run dev
```

If the project does not define a `dev` script, use its configured start command, such as `npm start` or `node src/index.js`.

The API should be available at:

```text
http://localhost:3000
```

### 3. Configure and start the frontend

Open a new terminal from the project root.

```bash
cd client
npm install
npm run dev
```

Vite will display the local URL for the dashboard, typically:

```text
http://localhost:5173
```

For local development, ensure the frontend API configuration points to the local backend. For the deployed dashboard, the `VITE_API_URL` environment variable is configured in Vercel with the deployed backend's base URL, without `/api`.

### 4. Run the demo webpage

Serve the demo directory using VS Code Live Server. Open `demo/index.html` and launch it with Live Server.

The demo page loads the tracking script from `tracker/tracker.js`.

To send events to the deployed backend, configure the tracking endpoint in `demo/index.html` before loading the tracker script:

```html
<script>
  window.USER_ANALYTICS_API_URL =
    "https://user-analytics-u55g.onrender.com/api/events";
</script>

<script src="../tracker/tracker.js"></script>
```

The tracker uses this configured endpoint when available and falls back to `http://localhost:3000/api/events` when no custom endpoint is specified.

**Important:** Keep the backend, frontend, and demo webpage running when testing the complete application locally. When testing against the deployed backend, the local backend does not need to be running.

### 5. Test event tracking

1. Open the demo webpage in your browser.
2. Navigate through the page and click different elements.
3. The tracking script automatically records page views and clicks and sends the events to the backend.
4. Open the analytics dashboard.
5. Navigate to **Sessions** to inspect sessions and their event counts.
6. Open a session to view its ordered event history.
7. Navigate to **Heatmap**, select the demo page URL, and inspect the recorded click positions.

Use browser developer tools and the MongoDB collection to verify that events are being recorded correctly.

## API Overview

The backend exposes REST endpoints for collecting and retrieving analytics data.

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/events` | Receive and store an event |
| GET | `/api/sessions` | Retrieve sessions with event counts |
| GET | `/api/sessions/:sessionId/events` | Retrieve events for a specific session |
| GET | `/api/events/pages` | Retrieve page URLs with recorded clicks |
| GET | `/api/events/clicks?pageUrl=<encoded-url>` | Retrieve click events for a page |

Click coordinates and additional viewport metadata are stored with click events to support heatmap visualization.

## Event Data

Each event contains the information needed to reconstruct user activity.

| Field | Description |
|---|---|
| `session_id` | Identifier stored in browser `localStorage` |
| `event_type` | Event type: `page_view` or `click` |
| `page_url` | URL of the page where the event occurred |
| `timestamp` | Time at which the event was recorded |
| `x`, `y` | Click coordinates, present for click events |
| `viewport_width`, `viewport_height` | Browser viewport dimensions at click time |
| `scroll_x`, `scroll_y` | Page scroll offsets at click time |

## Assumptions and Trade-offs

- **Session identification:** A session identifier is stored in `localStorage` and reused across page visits in the same browser storage context. It is a persistent visitor identifier rather than a strict, time-bounded session.
- **Event scope:** The tracker records page views and click events only. Other interactions, such as form submissions, keyboard input, and scroll events, are outside the current scope.
- **Click coordinates:** Click positions are recorded in document coordinates using `pageX` and `pageY`. Viewport dimensions and scroll offsets are stored to help interpret those positions.
- **Heatmap visualization:** The heatmap uses recorded click positions to display markers. Responsive layouts, changes to page content, and differences between the original browser viewport and the preview can affect alignment.
- **Website embedding:** Some websites prevent iframe embedding through browser security policies. The dashboard therefore provides a fallback preview. Rendering markers inside an embedded webpage also requires the tracking script to be present and running on that page.
- **Database design:** Events are stored as individual MongoDB documents, making session histories and page-specific click queries straightforward. Indexes support common query patterns.
- **Deployment:** The React dashboard is deployed on Vercel, the Express API on Render, and event data is stored in MongoDB Atlas. The demo webpage currently runs locally. Production configuration uses environment variables for the frontend API URL and database connection, along with CORS settings for permitted frontend origins.
- **Scope:** Authentication, user management, advanced analytics, and additional event types are excluded to keep the implementation aligned with the assignment.

## Limitations

- Analytics are limited to pages where the tracking script is installed.
- Browser storage restrictions or disabled JavaScript can prevent reliable tracking.
- The application does not attempt to identify users across different browsers or devices.
- Heatmap accuracy depends on the recorded coordinates and how the webpage is rendered in the preview.
- The demo webpage is not currently hosted publicly and must be run locally for testing.

## Future Improvements

Potential extensions include time-bounded sessions, configurable event collection, more advanced heatmap aggregation, and public hosting for the demo webpage.
