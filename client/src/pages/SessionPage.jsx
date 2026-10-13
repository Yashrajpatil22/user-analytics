import { useEffect, useState } from "react";
import { fetchSessions } from "../services/analyticsService.js";
import Header from "../components/layouts/Header.jsx";
function SessionsPage() {

    const [sessions, setSessions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
      const loadSessions = async () => {
        try {
          const data = await fetchSessions();
          setSessions(data);
        } catch (err) {
          setError(err.message || "Failed to load sessions");
        } finally {
          setLoading(false);
        }
      };

      loadSessions();
    }, []);

    
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Header />

      <main className="mx-auto max-w-7xl px-5 py-9 sm:px-8 sm:py-11">
        {/* Page heading */}
        <div className="mb-9">
          <p className="mb-2 text-sm font-semibold text-blue-700">Analytics</p>

          <h2 className="text-3xl font-semibold tracking-tight text-slate-900">
            Sessions
          </h2>

          <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600">
            Browse recorded sessions and inspect the sequence of events for each
            session.
          </p>
        </div>

        {/* Sessions panel */}
        <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 px-5 py-5 sm:px-6">
            <h3 className="text-base font-semibold text-slate-900">
              Recorded sessions
            </h3>

            <p className="mt-1.5 text-sm leading-6 text-slate-600">
              Select a session to view its event history.
            </p>
          </div>

          <div className="px-5 py-6 sm:px-6">
            {loading ? (
              <p className="py-10 text-center text-sm text-slate-600">
                Loading sessions...
              </p>
            ) : error ? (
              <p
                role="alert"
                className="py-10 text-center text-sm text-red-600"
              >
                {error}
              </p>
            ) : sessions.length === 0 ? (
              <p className="py-10 text-center text-sm text-slate-600">
                No sessions recorded yet.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[480px] text-left text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      <th className="px-4 py-3">Session ID</th>
                      <th className="px-4 py-3">Events</th>
                      <th className="px-4 py-3">Action</th>
                    </tr>
                  </thead>

                  <tbody>
                    {sessions.map((session) => (
                      <tr
                        key={session.session_id}
                        className="border-b border-slate-100 transition-colors duration-150 last:border-0 hover:bg-slate-50"
                      >
                        <td className="px-4 py-4 font-mono text-xs text-slate-700 sm:text-sm">
                          {session.session_id}
                        </td>

                        <td className="px-4 py-4 text-slate-700">
                          {session.total_events}
                        </td>

                        <td className="px-4 py-4">
                          <button
                            type="button"
                            className="font-medium text-blue-700 transition-colors duration-150 hover:text-blue-900 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-700"
                            onClick={() =>
                              console.log(
                                "Selected session:",
                                session.session_id,
                              )
                            }
                          >
                            View journey
                          </button>
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

export default SessionsPage;
