import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { fetchSessionEvents } from "../services/analyticsService.js";
import Header from "../components/layouts/Header.jsx";

function SessionDetailsPage() {
  const { sessionId } = useParams();

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadEvents = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await fetchSessionEvents(sessionId);
        setEvents(data);
      } catch (err) {
        setError(err.message || "Failed to load session events");
      } finally {
        setLoading(false);
      }
    };

    loadEvents();
  }, [sessionId]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Header />

      <main className="mx-auto max-w-7xl px-5 py-9 sm:px-8 sm:py-11">
        <Link
          to="/sessions"
          className="text-sm font-medium text-blue-700 transition-colors hover:text-blue-900"
        >
          Back to sessions
        </Link>

        <div className="mb-9 mt-6">
          <p className="mb-2 text-sm font-semibold text-blue-700">Analytics</p>

          <h2 className="text-3xl font-semibold tracking-tight text-slate-900">
            Session details
          </h2>

          <p className="mt-3 break-all text-sm leading-6 text-slate-600">
            Session ID: {sessionId}
          </p>
        </div>

        <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 px-5 py-5 sm:px-6">
            <h3 className="text-base font-semibold text-slate-900">
              Event history
            </h3>

            <p className="mt-1.5 text-sm leading-6 text-slate-600">
              Events are displayed in chronological order.
            </p>
          </div>

          <div className="px-5 py-6 sm:px-6">
            {loading ? (
              <p className="text-sm text-slate-600">Loading event history...</p>
            ) : error ? (
              <p role="alert" className="text-sm text-red-700">
                {error}
              </p>
            ) : events.length === 0 ? (
              <p className="text-sm text-slate-600">
                No events found for this session.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[650px] text-left text-sm">
                  <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                    <tr>
                      <th className="px-4 py-3 font-medium">Event type</th>
                      <th className="px-4 py-3 font-medium">Page URL</th>
                      <th className="px-4 py-3 font-medium">Timestamp</th>
                      <th className="px-4 py-3 font-medium">Coordinates</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100">
                    {events.map((event) => (
                      <tr
                        key={event._id}
                        className="transition-colors hover:bg-slate-50"
                      >
                        <td className="whitespace-nowrap px-4 py-4 font-medium text-slate-900">
                          {event.event_type === "page_view"
                            ? "Page view"
                            : "Click"}
                        </td>

                        <td className="max-w-sm break-all px-4 py-4 text-slate-600">
                          {event.page_url}
                        </td>

                        <td className="whitespace-nowrap px-4 py-4 text-slate-600">
                          {new Date(event.timestamp).toLocaleString()}
                        </td>

                        <td className="whitespace-nowrap px-4 py-4 text-slate-600">
                          {event.event_type === "click"
                            ? `(${event.x}, ${event.y})`
                            : "—"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

export default SessionDetailsPage;
