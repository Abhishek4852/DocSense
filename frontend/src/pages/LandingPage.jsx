import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Search, Shield, Zap, MessageSquare, Database, Smartphone, Settings, Moon, Sun, LayoutTemplate } from 'lucide-react';

export default function LandingPage() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Check initial dark mode preference
    if (localStorage.getItem('theme') === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark');
      setIsDarkMode(true);
    } else {
      document.documentElement.classList.remove('dark');
      setIsDarkMode(false);
    }
  }, []);

  const toggleDarkMode = () => {
    if (isDarkMode) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      setIsDarkMode(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setIsDarkMode(true);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 transition-colors duration-300 font-sans">
      {/* Navbar */}
      <nav className="border-b border-gray-100 dark:border-gray-800 bg-white/80 dark:bg-gray-950/80 backdrop-blur-xl sticky top-0 z-50 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-2 group cursor-pointer">
              <div className="bg-gradient-to-br from-primary to-indigo-600 text-white p-2 rounded-xl shadow-lg group-hover:scale-105 transition-transform duration-300">
                <Database className="h-6 w-6" />
              </div>
              <span className="text-xl font-extrabold text-gray-900 dark:text-white tracking-tight">DocSense</span>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={toggleDarkMode}
                className="p-2 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300"
              >
                {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </button>
              <Link to="/login" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors">
                Login
              </Link>
              <Link to="/register" className="bg-primary hover:bg-indigo-600 text-white px-5 py-2.5 rounded-lg text-sm font-semibold shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative overflow-hidden pt-28 pb-32">
        {/* Background Gradients */}
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-400/20 dark:bg-indigo-600/20 blur-[120px] rounded-full pointer-events-none"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-400/20 dark:bg-purple-600/20 blur-[120px] rounded-full pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">

          <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-8 leading-tight animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            AI-powered Enterprise <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-indigo-500 to-purple-600 drop-shadow-sm">
              Knowledge Assistant
            </span>
          </h1>
          <p className="mt-4 max-w-2xl text-xl text-gray-600 dark:text-gray-300 mx-auto mb-10 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            Transform your organization's documents into an intelligent, conversational knowledge base. Chat with your data on the web or directly through WhatsApp.
          </p>
          <div className="flex justify-center gap-4 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            <Link to="/register" className="bg-primary text-white hover:bg-indigo-600 px-8 py-4 rounded-xl text-lg font-semibold shadow-[0_8px_30px_rgb(79,70,229,0.3)] hover:shadow-[0_8px_40px_rgb(79,70,229,0.4)] transition-all duration-300 transform hover:-translate-y-1 flex items-center gap-2">
              Start Building <Zap className="h-5 w-5" />
            </Link>
            <Link to="/login" className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 px-8 py-4 rounded-xl text-lg font-semibold shadow-sm transition-all duration-300">
              Sign In
            </Link>
          </div>
        </div>
      </div>

      {/* Premium Features Section */}
      <div className="py-24 bg-gray-50 dark:bg-gray-900/50 relative border-y border-gray-100 dark:border-gray-800/50 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white tracking-tight">Enterprise-Grade Capabilities</h2>
            <p className="mt-4 text-xl text-gray-600 dark:text-gray-400">Everything you need to deploy AI over your private data.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: Smartphone, title: 'WhatsApp Integration', desc: 'Interact with your knowledge base instantly via WhatsApp. Your AI assistant is just a message away.' },
              { icon: LayoutTemplate, title: 'Dynamic Chunking', desc: 'Adaptive parsing strategies for different document types (Legal, Financial, Q&A) ensuring maximum context retention.' },
              { icon: Settings, title: 'WhatsApp One-Time Config', desc: 'Effortlessly connect your Meta Developer App with our secure, one-time configuration dashboard.' },
              { icon: BookOpen, title: 'Multi-Format Support', desc: 'Upload PDFs, Word docs, CSVs, Markdown, or paste raw text. We handle the extraction seamlessly.' },
              { icon: Search, title: 'Cross-Encoder Re-Ranking', desc: 'Retrieve fast with FAISS, and re-rank with Cross-Encoders for unparalleled answer accuracy.' },
              { icon: Shield, title: 'Secure & Isolated', desc: 'Data is strictly siloed per organization. Your proprietary knowledge remains entirely private.' },
            ].map((feature, i) => (
              <div key={i} className="bg-white dark:bg-gray-900 rounded-3xl p-8 shadow-sm hover:shadow-2xl dark:shadow-none dark:hover:bg-gray-800/80 transition-all duration-500 border border-gray-100 dark:border-gray-800 group transform hover:-translate-y-2 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="bg-indigo-50 dark:bg-indigo-900/40 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-primary transition-all duration-300">
                  <feature.icon className="h-8 w-8 text-primary dark:text-indigo-400 group-hover:text-white transition-colors duration-300" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-950 border-t border-gray-100 dark:border-gray-900 py-12 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center gap-6">
          <div className="flex items-center gap-2 opacity-80 hover:opacity-100 transition-opacity">
            <Database className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold text-gray-900 dark:text-white">DocSense</span>
          </div>
          <div className="text-center">
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              Designed & Built with ❤️ by <span className="font-semibold text-gray-900 dark:text-gray-200">Abhishek Yaduwanshi</span>
            </p>
            <p className="text-gray-400 dark:text-gray-500 text-xs mt-2">© 2026 DocSense. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function SparklesIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
      <path d="M5 3v4" />
      <path d="M19 17v4" />
      <path d="M3 5h4" />
      <path d="M17 19h4" />
    </svg>
  );
}
