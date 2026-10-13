function SessionsPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex h-16 max-w-7xl items-center px-5 sm:px-8">
          <h1 className="text-xl font-semibold tracking-tight">
            User Analytics
          </h1>

          <span className="ml-auto text-sm font-medium text-slate-600">
            Event tracking
          </span>
        </div>
      </header>

      {/* Main content */}
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

        {/* Sessions section */}
        <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          {/* Section heading */}
          <div className="border-b border-slate-200 px-5 py-5 sm:px-6">
            <h3 className="text-base font-semibold text-slate-900">
              Recorded sessions
            </h3>

            <p className="mt-1.5 text-sm leading-6 text-slate-600">
              Select a session to view its event history.
            </p>
          </div>

          {/* Empty state — temporary until API integration */}
          <div className="flex min-h-64 items-center justify-center px-5 py-12 text-center">
            <div className="max-w-md">
              <p className="text-base font-medium text-slate-800">
                Sessions will appear here
              </p>

              <p className="mt-2 text-sm leading-6 text-slate-600">
                Connect to the backend to retrieve recorded sessions and explore
                their event history.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default SessionsPage;
