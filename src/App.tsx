import { Navigate, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import StewardView from "./pages/StewardView";
import AdminView from "./pages/AdminView";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Navigate to="/" replace />} />
      <Route path="/steward" element={<StewardView />} />
      <Route path="/admin" element={<AdminView />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
