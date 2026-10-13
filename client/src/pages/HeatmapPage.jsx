import { useEffect, useState, useRef } from "react";
import Header from "../components/layouts/Header.jsx";
import {
  fetchPageUrls,
  fetchPageClicks,
} from "../services/analyticsService.js";

function HeatmapPage() {

    const [pageUrls, setPageUrls] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [selectedPageUrl, setSelectedPageUrl] = useState("");
    const [clicks, setClicks] = useState([]);
    const [clicksLoading, setClicksLoading] = useState(false);
    const [clicksError, setClicksError] = useState("");
    const [previewMode, setPreviewMode] = useState("website");
    const [iframeLoaded, setIframeLoaded] = useState(false);
    const iframeRef = useRef(null);
    useEffect(() => {
      iframeRef.current?.contentWindow?.postMessage(
        {
          type: "USER_ANALYTICS_HEATMAP",
          clicks,
        },
        "*",
      );
    }, [clicks, selectedPageUrl]);

    useEffect(() => {
      const loadPageUrls = async () => {
        try {
          const urls = await fetchPageUrls();
          setPageUrls(urls);
        } catch (err) {
          setError(err.message || "Failed to load page URLs");
        } finally {
          setLoading(false);
        }
      };

      loadPageUrls();
    }, []);

    useEffect(() => {
      if (!selectedPageUrl) {
        setClicks([]);
        setClicksError("");
        setClicksLoading(false);
        return;
      }

      const loadClicks = async () => {
        try {
          setClicksLoading(true);
          setClicksError("");

          const data = await fetchPageClicks(selectedPageUrl);
          setClicks(data);
        } catch (err) {
          setClicks([]);
          setClicksError(err.message || "Failed to load click data");
        } finally {
          setClicksLoading(false);
        }
      };

      loadClicks();
    }, [selectedPageUrl]);

    function getScaledPosition(click, referenceWidth = 1200) {
      const scale = referenceWidth / (click.viewport_width || referenceWidth);

      return {
        left: `${click.x * scale}px`,
        top: `${click.y * scale}px`,
      };
    }

    useEffect(() => {
      setPreviewMode("website");
      setIframeLoaded(false);
    }, [selectedPageUrl]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Header />

      <main className="mx-auto max-w-7xl px-5 py-9 sm:px-8 sm:py-11">
        <div className="mb-9">
          <p className="mb-2 text-sm font-semibold text-blue-700">Analytics</p>

          <h2 className="text-3xl font-semibold tracking-tight text-slate-900">
            Click heatmap
          </h2>

          <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600">
            Explore where visitors click on a page using recorded click events.
          </p>
        </div>

        <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 px-5 py-5 sm:px-6">
            <h3 className="text-base font-semibold text-slate-900">
              Page selection
            </h3>

            <p className="mt-1.5 text-sm leading-6 text-slate-600">
              Choose a page URL to inspect its recorded clicks.
            </p>
          </div>

          <div className="px-5 py-6 sm:px-6">
            <label
              htmlFor="page-url"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Page URL
            </label>

            <select
              id="page-url"
              value={selectedPageUrl}
              onChange={(event) => setSelectedPageUrl(event.target.value)}
              disabled={loading || Boolean(error) || pageUrls.length === 0}
              className="w-full max-w-2xl rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-700 disabled:cursor-not-allowed disabled:bg-slate-50"
            >
              <option value="">
                {loading
                  ? "Loading page URLs..."
                  : error
                    ? "Unable to load page URLs"
                    : pageUrls.length === 0
                      ? "No pages with recorded clicks"
                      : "Select a page"}
              </option>

              {pageUrls.map((url) => (
                <option key={url} value={url}>
                  {url}
                </option>
              ))}
            </select>

            {error ? (
              <p role="alert" className="mt-2 text-xs text-red-700">
                {error}
              </p>
            ) : (
              <p className="mt-2 text-xs leading-5 text-slate-500">
                {pageUrls.length > 0
                  ? `${pageUrls.length} page(s) with recorded clicks`
                  : "Pages will appear here after click events are recorded."}
              </p>
            )}
          </div>
        </section>

        <section className="mt-6 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 px-5 py-5 sm:px-6">
            <h3 className="text-base font-semibold text-slate-900">
              Click distribution
            </h3>

            <p className="mt-1.5 text-sm leading-6 text-slate-600">
              {selectedPageUrl
                ? "Click activity for the selected page."
                : "Click positions for the selected page will appear here."}
            </p>
          </div>

          <div className="px-4 py-5 sm:px-6">
            {selectedPageUrl &&
              !clicksLoading &&
              !clicksError &&
              clicks.length > 0 && (
                <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                  <p className="text-sm text-slate-600">
                    {previewMode === "website"
                      ? "Attempting to display the selected website."
                      : "Showing a proportional fallback preview."}
                  </p>

                  <button
                    type="button"
                    className="cursor-pointer rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
                    onClick={() => {
                      setPreviewMode((mode) =>
                        mode === "website" ? "fallback" : "website",
                      );
                      setIframeLoaded(false);
                    }}
                  >
                    {previewMode === "website"
                      ? "Use fallback preview"
                      : "Try website preview"}
                  </button>
                </div>
              )}

            {!selectedPageUrl ? (
              <p className="py-12 text-center text-sm text-slate-500">
                Select a page to view its click distribution.
              </p>
            ) : clicksLoading ? (
              <p className="py-12 text-center text-sm text-slate-500">
                Loading click data...
              </p>
            ) : clicksError ? (
              <p
                role="alert"
                className="py-12 text-center text-sm text-red-700"
              >
                {clicksError}
              </p>
            ) : clicks.length === 0 ? (
              <p className="py-12 text-center text-sm text-slate-500">
                No clicks recorded for this page yet.
              </p>
            ) : (
              <div className="mx-auto w-full max-w-5xl">
                {previewMode === "website" ? (
                  <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
                    <div className="flex items-center gap-2 border-b border-slate-200 bg-slate-50 px-3 py-2">
                      <span className="h-2.5 w-2.5 rounded-full bg-slate-300" />
                      <span className="h-2.5 w-2.5 rounded-full bg-slate-300" />
                      <span className="h-2.5 w-2.5 rounded-full bg-slate-300" />
                      <p className="ml-2 truncate text-xs text-slate-500">
                        {selectedPageUrl}
                      </p>
                    </div>

                    <div className="relative aspect-[16/10] w-full overflow-hidden">
                      <iframe
                        ref={iframeRef}
                        key={selectedPageUrl}
                        src={selectedPageUrl}
                        title="Selected website preview"
                        className="absolute inset-0 h-full w-full border-0"
                        onLoad={(event) => {
                          event.currentTarget.contentWindow?.postMessage(
                            {
                              type: "USER_ANALYTICS_HEATMAP",
                              clicks,
                            },
                            "*",
                          );
                        }}
                        sandbox="allow-scripts allow-same-origin allow-forms"
                      />

                      {/* <div className="pointer-events-none absolute inset-0">
                        {clicks.map((click) => (
                          <span
                            key={click._id}
                            title={`Click at (${click.x}, ${click.y})`}
                            className="absolute h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-600/75 ring-2 ring-blue-200/80"
                            style={{
                              left: `${(click.x / 1200) * 100}%`,
                              top: `${(click.y / 750) * 100}%`,
                            }}
                          />
                        ))}
                      </div> */}
                    </div>

                    {!iframeLoaded && (
                      <p className="border-t border-slate-200 px-3 py-2 text-xs text-slate-500">
                        Loading preview. If the website cannot be displayed,
                        switch to the fallback preview.
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="relative aspect-[16/10] w-full overflow-hidden rounded-lg border border-slate-200 bg-slate-50">
                    {clicks.map((click) => (
                      <span
                        key={click._id}
                        title={`Click at (${click.x}, ${click.y})`}
                        className="absolute h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-600/75 ring-2 ring-blue-200/80"
                        style={getScaledPosition(click)}
                      />
                    ))}
                  </div>
                )}

                <p className="mt-3 text-center text-xs text-slate-500">
                  {clicks.length} recorded click(s). The preview uses a fixed
                  display viewport; coordinate alignment may vary with the
                  original page layout.
                </p>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

export default HeatmapPage;
