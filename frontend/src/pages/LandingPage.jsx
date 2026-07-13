import { Link } from 'react-router-dom';
import { BookOpen, Search, Shield, Zap, MessageSquare, Database } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="border-b border-gray-100 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-2">
              <div className="bg-primary text-white p-2 rounded-lg">
                <Database className="h-6 w-6" />
              </div>
              <span className="text-xl font-bold text-gray-900">DocSense</span>
            </div>
            <div className="flex gap-4">
              <Link to="/login" className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                Login
              </Link>
              <Link to="/register" className="bg-primary text-white hover:bg-indigo-700 px-4 py-2 rounded-md text-sm font-medium transition-colors">
                Register
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-purple-50 pt-24 pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 tracking-tight mb-8">
            AI-powered Enterprise <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-600">Knowledge Assistant</span>
          </h1>
          <p className="mt-4 max-w-2xl text-xl text-gray-600 mx-auto mb-10">
            Transform your organization's documents into an intelligent, conversational knowledge base using advanced Retrieval-Augmented Generation.
          </p>
          <div className="flex justify-center gap-4">
            <Link to="/register" className="bg-primary text-white hover:bg-indigo-700 px-8 py-4 rounded-xl text-lg font-semibold shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1">
              Get Started for Free
            </Link>
            <Link to="/login" className="bg-white text-gray-900 border border-gray-200 hover:bg-gray-50 px-8 py-4 rounded-xl text-lg font-semibold shadow-sm transition-all">
              Sign In
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">Everything you need to manage knowledge</h2>
            <p className="mt-4 text-lg text-gray-600">Powerful features designed for modern enterprises.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: BookOpen, title: 'Multi Document Support', desc: 'Upload multiple PDFs and process them into a unified knowledge base.' },
              { icon: MessageSquare, title: 'AI Question Answering', desc: 'Ask complex questions and get accurate answers instantly.' },
              { icon: Search, title: 'Semantic Search', desc: 'Find meaning, not just keywords, using advanced vector embeddings.' },
              { icon: Database, title: 'Organization KB', desc: 'Isolated and secure knowledge bases for different organizations.' },
              { icon: Shield, title: 'Source Citation', desc: 'Every answer is backed by citations from your original documents.' },
              { icon: Zap, title: 'Secure Authentication', desc: 'Enterprise-grade security with JWT authentication.' },
            ].map((feature, i) => (
              <div key={i} className="bg-gray-50 rounded-2xl p-8 hover:bg-white hover:shadow-xl transition-all duration-300 border border-transparent hover:border-gray-100 group">
                <div className="bg-indigo-100 w-14 h-14 rounded-xl flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-white transition-colors">
                  <feature.icon className="h-7 w-7 text-primary group-hover:text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">How DocSense Works</h2>
          </div>
          <div className="flex flex-col md:flex-row justify-between items-center gap-8 relative">
            <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-gray-200 -z-10"></div>
            {[
              { step: '1', title: 'Upload Documents', desc: 'Upload your PDFs securely' },
              { step: '2', title: 'Generate Knowledge Base', desc: 'We process and index your data' },
              { step: '3', title: 'Ask Questions', desc: 'Query in natural language' },
              { step: '4', title: 'Accurate Answers', desc: 'Get AI generated responses' },
            ].map((item, i) => (
              <div key={i} className="flex flex-col items-center bg-white p-6 rounded-xl shadow-sm border border-gray-100 w-full md:w-64 z-10">
                <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center text-xl font-bold mb-4 shadow-md">
                  {item.step}
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">{item.title}</h4>
                <p className="text-sm text-gray-500 text-center">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <Database className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold text-white">DocSense</span>
          </div>
          <div className="flex gap-8">
            <a href="#" className="hover:text-white transition-colors">About</a>
            <a href="#" className="hover:text-white transition-colors">Contact</a>
            <a href="#" className="hover:text-white transition-colors">GitHub</a>
            <a href="#" className="hover:text-white transition-colors">LinkedIn</a>
          </div>
          <p className="text-sm text-gray-500">© 2026 DocSense. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
