import { Navigate, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Library from "./pages/Library";
import BookDetail from "./pages/BookDetail";
import Guideon from "./pages/Guideon";

export default function App() {
  return <Layout><Routes>
    <Route path="/" element={<Dashboard />} />
    <Route path="/library" element={<Library />} />
    <Route path="/books/:bookId" element={<BookDetail />} />
    <Route path="/guideon" element={<Guideon />} />
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes></Layout>;
}