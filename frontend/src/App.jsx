import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import DashboardLayout from './pages/dashboard/DashboardLayout';
import UploadPage from './pages/dashboard/UploadPage';
import ChatPage from './pages/dashboard/ChatPage';
import WhatsAppSettingsPage from './pages/dashboard/WhatsAppSettingsPage';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('access');
  if (!token) {
    return <Navigate to="/login" />;
  }
  return children;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          } 
        >
          <Route index element={<Navigate to="/dashboard/upload" replace />} />
          <Route path="upload" element={<UploadPage />} />
          <Route path="chat" element={<ChatPage />} />
          <Route path="whatsapp" element={<WhatsAppSettingsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
