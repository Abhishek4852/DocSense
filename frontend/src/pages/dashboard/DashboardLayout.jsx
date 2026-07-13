import { useState, useEffect } from 'react';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { MessageSquare, Upload, LogOut, Menu, X, Moon, Sun, Smartphone } from 'lucide-react';

export default function DashboardLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Check initial dark mode preference
    if (document.documentElement.classList.contains('dark')) {
      setIsDarkMode(true);
    }
  }, []);

  const toggleDarkMode = () => {
    if (isDarkMode) {
      document.documentElement.classList.remove('dark');
      setIsDarkMode(false);
    } else {
      document.documentElement.classList.add('dark');
      setIsDarkMode(true);
    }
  };

  const logout = () => {
    localStorage.clear();
    navigate('/');
  };

  return (
    <div className={`flex h-screen overflow-hidden ${isDarkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      
      {/* Sidebar Overlay (Mobile) */}
      {!isSidebarOpen && (
        <button 
          onClick={() => setIsSidebarOpen(true)}
          className={`absolute top-4 left-4 z-50 p-2 rounded-md ${isDarkMode ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-600 hover:bg-gray-200'} transition-colors md:hidden`}
        >
          <Menu className="h-6 w-6" />
        </button>
      )}

      {/* Sidebar */}
      <div 
        className={`fixed md:relative z-40 bg-gray-900 dark:bg-black text-white flex flex-col h-full border-r border-gray-800 shrink-0 transition-all duration-300 ease-in-out
          ${isSidebarOpen ? 'w-64 translate-x-0' : 'w-0 -translate-x-full overflow-hidden'}`}
      >
        <div className="p-4 border-b border-gray-800 flex items-center justify-between">
          <div className="flex items-center gap-2 truncate">
            <span className="bg-primary text-white p-1.5 rounded-lg text-sm shrink-0">DS</span>
            <h1 className="text-xl font-bold truncate">DocSense</h1>
          </div>
          <button 
            onClick={() => setIsSidebarOpen(false)}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        {isSidebarOpen && (
          <div className="px-4 pt-2 pb-4 border-b border-gray-800">
             <p className="text-xs text-gray-400 truncate">{user.organization}</p>
          </div>
        )}
        
        <div className="flex-1 p-4 space-y-2 overflow-y-auto">
          <Link
            to="/dashboard/upload"
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors w-full
              ${location.pathname === '/dashboard/upload' ? 'bg-primary text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}
          >
            <Upload className="h-4 w-4 shrink-0" />
            <span className="truncate">Upload Documents</span>
          </Link>
          <Link
            to="/dashboard/chat"
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors w-full
              ${location.pathname.includes('/dashboard/chat') ? 'bg-primary text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}
          >
            <MessageSquare className="h-4 w-4 shrink-0" />
            <span className="truncate">Chat</span>
          </Link>
          <Link
            to="/dashboard/whatsapp"
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors w-full
              ${location.pathname.includes('/dashboard/whatsapp') ? 'bg-primary text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}
          >
            <Smartphone className="h-4 w-4 shrink-0" />
            <span className="truncate">WhatsApp Settings</span>
          </Link>
        </div>

        <div className="p-4 border-t border-gray-800 space-y-2">
          <button onClick={toggleDarkMode} className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors w-full px-2 py-2 text-sm rounded-lg hover:bg-gray-800">
            {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            {isDarkMode ? 'Light Mode' : 'Dark Mode'}
          </button>
          <button onClick={logout} className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors w-full px-2 py-2 text-sm rounded-lg hover:bg-gray-800">
            <LogOut className="h-4 w-4 shrink-0" />
            Sign Out
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className={`flex-1 flex flex-col h-full overflow-hidden transition-all duration-300 dark:bg-gray-900 ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
        {/* Toggle Button for Main Area (when sidebar is closed on desktop) */}
        {!isSidebarOpen && (
           <div className="hidden md:flex absolute top-4 left-4 z-10">
              <button 
                onClick={() => setIsSidebarOpen(true)}
                className={`p-2 rounded-md ${isDarkMode ? 'text-gray-300 hover:bg-gray-800 bg-gray-900 border border-gray-700' : 'text-gray-600 hover:bg-gray-200 bg-white border border-gray-200'} transition-colors shadow-sm`}
              >
                <Menu className="h-5 w-5" />
              </button>
           </div>
        )}
        <Outlet />
      </div>
    </div>
  );
}
