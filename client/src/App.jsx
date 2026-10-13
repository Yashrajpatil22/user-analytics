import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import SessionsPage from "./pages/SessionPage.jsx";
import SessionDetailsPage from "./pages/SessionDetailsPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/sessions" replace />} />
        <Route path="/sessions" element={<SessionsPage />} />
        <Route path="/sessions/:sessionId" element={<SessionDetailsPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
