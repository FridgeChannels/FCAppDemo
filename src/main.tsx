import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// #region agent log
window.addEventListener("error", (e) => {
  fetch("http://127.0.0.1:7243/ingest/d259a774-2bef-46a8-b9a0-7c6200d29034", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      sessionId: "debug-session",
      runId: "repro1",
      hypothesisId: "H4",
      location: "src/main.tsx:global-error",
      message: "window.error",
      data: { message: e.message, filename: e.filename, lineno: e.lineno, colno: e.colno },
      timestamp: Date.now(),
    }),
  }).catch(() => {});
});
window.addEventListener("unhandledrejection", (e) => {
  fetch("http://127.0.0.1:7243/ingest/d259a774-2bef-46a8-b9a0-7c6200d29034", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      sessionId: "debug-session",
      runId: "repro1",
      hypothesisId: "H4",
      location: "src/main.tsx:unhandledrejection",
      message: "unhandledrejection",
      data: { reason: String((e as PromiseRejectionEvent).reason ?? "") },
      timestamp: Date.now(),
    }),
  }).catch(() => {});
});
// #endregion agent log

createRoot(document.getElementById("root")!).render(<App />);
