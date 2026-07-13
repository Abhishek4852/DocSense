import { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import api from '../../api/axios';
import { 
  MessageSquare, 
  Send, 
  FileText, 
  PlusCircle,
  Filter,
  Check,
  Trash2
} from 'lucide-react';

export default function ChatPage() {
  const [sessions, setSessions] = useState([]);
  const [currentSessionId, setCurrentSessionId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loadingChat, setLoadingChat] = useState(false);
  
  // Document Selection state
  const [documents, setDocuments] = useState([]);
  const [selectedDocs, setSelectedDocs] = useState([]);
  const [showFilter, setShowFilter] = useState(false);

  const messagesEndRef = useRef(null);
  const filterRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setShowFilter(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    fetchSessions();
    fetchDocuments();
  }, []);

  useEffect(() => {
    if (currentSessionId) {
      fetchMessages(currentSessionId);
    }
  }, [currentSessionId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fetchSessions = async () => {
    try {
      const res = await api.get('/chat/history/');
      setSessions(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchDocuments = async () => {
    try {
      const res = await api.get('/documents/');
      // only ready docs
      setDocuments(res.data.filter(d => d.status === 'READY'));
    } catch (err) {
      console.error(err);
    }
  };

  const fetchMessages = async (id) => {
    try {
      const res = await api.get(`/chat/${id}/`);
      setMessages(res.data.messages);
    } catch (err) {
      console.error(err);
    }
  };

  const handleNewChat = async () => {
    try {
      const res = await api.post('/chat/new/', { title: 'New Conversation' });
      setSessions([res.data, ...sessions]);
      setCurrentSessionId(res.data.id);
      setMessages([]);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || !currentSessionId) return;

    const userMessage = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'USER', message: userMessage }]);
    setLoadingChat(true);

    try {
      const payload = {
        session_id: currentSessionId,
        question: userMessage,
      };
      // Send selected_docs only if there are selections
      if (selectedDocs.length > 0) {
        payload.selected_docs = selectedDocs;
      }

      const res = await api.post('/chat/ask/', payload);
      setMessages(prev => [...prev, { 
        role: 'SYSTEM', 
        message: res.data.answer,
        source: res.data.sources 
      }]);
      fetchSessions(); // refresh titles
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingChat(false);
    }
  };

  const toggleDocSelection = (title) => {
    setSelectedDocs(prev => 
      prev.includes(title) 
        ? prev.filter(t => t !== title)
        : [...prev, title]
    );
  };

  const handleDeleteChat = async (e, id) => {
    e.stopPropagation();
    try {
      await api.delete(`/chat/${id}/delete/`);
      if (currentSessionId === id) {
        setCurrentSessionId(null);
        setMessages([]);
      }
      fetchSessions();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex-1 flex bg-gray-50 dark:bg-gray-900 h-full overflow-hidden relative transition-colors">
      {/* Sessions Sidebar (inner) */}
      <div className="w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex flex-col h-full hidden md:flex shrink-0 transition-colors">
        <div className="p-4 border-b border-gray-100 dark:border-gray-800">
          <button 
            onClick={handleNewChat}
            className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-indigo-600 text-white px-4 py-2 rounded-lg transition-colors font-medium text-sm"
          >
            <PlusCircle className="h-4 w-4" />
            New Chat
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-3 space-y-1">
          <h2 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3 px-2">History</h2>
          {sessions.map(session => (
            <div key={session.id} className="relative group flex items-center">
              <button
                onClick={() => setCurrentSessionId(session.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors text-left truncate pr-8
                  ${currentSessionId === session.id 
                    ? 'bg-indigo-50 dark:bg-indigo-900/30 text-primary font-medium' 
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-200'}`}
              >
                <MessageSquare className="h-4 w-4 shrink-0" />
                <span className="truncate">{session.title}</span>
              </button>
              <button 
                onClick={(e) => handleDeleteChat(e, session.id)}
                className={`absolute right-2 p-1.5 rounded-md text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 transition-all
                  ${currentSessionId === session.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
                title="Delete chat"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col h-full bg-gray-50 dark:bg-gray-900 relative min-w-0 transition-colors">
        {!currentSessionId ? (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-400 dark:text-gray-500 p-8 text-center">
            <MessageSquare className="h-12 w-12 mb-4 text-gray-300 dark:text-gray-700" />
            <h2 className="text-xl font-medium text-gray-700 dark:text-gray-300 mb-2">DocSense Chat</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm mb-6">Start a new conversation to query your uploaded documents.</p>
            <button 
              onClick={handleNewChat}
              className="flex items-center gap-2 bg-primary hover:bg-indigo-600 text-white px-6 py-3 rounded-xl transition-colors font-medium shadow-sm"
            >
              <PlusCircle className="h-5 w-5" />
              Start New Chat
            </button>
          </div>
        ) : (
          <>
            {/* Chat Header with Filter */}
            <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-6 py-4 flex items-center justify-between shrink-0 transition-colors">
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 truncate max-w-sm">
                  {sessions.find(s => s.id === currentSessionId)?.title || 'Chat'}
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {selectedDocs.length === 0 
                    ? 'Global search (all documents)' 
                    : `Filtering by ${selectedDocs.length} document(s)`}
                </p>
              </div>
              
              <div className="relative" ref={filterRef}>
                <button 
                  onClick={() => setShowFilter(!showFilter)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors border
                    ${selectedDocs.length > 0 || showFilter 
                      ? 'border-primary text-primary bg-indigo-50 dark:bg-indigo-900/30 dark:border-primary/50' 
                      : 'border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'}`}
                >
                  <Filter className="h-4 w-4" />
                  Filter Docs
                  {selectedDocs.length > 0 && (
                    <span className="bg-primary text-white text-xs px-1.5 py-0.5 rounded-full ml-1">
                      {selectedDocs.length}
                    </span>
                  )}
                </button>

                {/* Filter Dropdown */}
                {showFilter && (
                  <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 z-10 overflow-hidden">
                    <div className="p-3 border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 flex justify-between items-center">
                      <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Select Documents</h4>
                      <button 
                        onClick={() => setSelectedDocs([])}
                        className="text-xs text-primary hover:underline font-medium"
                      >
                        Clear all
                      </button>
                    </div>
                    <div className="max-h-64 overflow-y-auto p-2">
                      {documents.length === 0 ? (
                        <p className="text-sm text-gray-500 dark:text-gray-400 p-2 text-center">No ready documents found.</p>
                      ) : (
                        documents.map(doc => {
                          const isSelected = selectedDocs.includes(doc.title);
                          return (
                            <button
                              key={doc.id}
                              onClick={() => toggleDocSelection(doc.title)}
                              className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-left"
                            >
                              <div className="flex items-center gap-2 truncate pr-2">
                                <FileText className={`h-4 w-4 shrink-0 ${isSelected ? 'text-primary' : 'text-gray-400 dark:text-gray-500'}`} />
                                <span className={`text-sm truncate ${isSelected ? 'text-gray-900 dark:text-gray-100 font-medium' : 'text-gray-700 dark:text-gray-300'}`}>
                                  {doc.title}
                                </span>
                              </div>
                              {isSelected && <Check className="h-4 w-4 text-primary shrink-0" />}
                            </button>
                          );
                        })
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6">
              {messages.length === 0 && (
                <div className="text-center text-gray-500 dark:text-gray-400 mt-10">
                  <p>Ask a question based on your {selectedDocs.length > 0 ? 'selected documents' : 'knowledge base'}.</p>
                </div>
              )}
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex gap-4 ${msg.role === 'USER' ? 'flex-row-reverse' : ''}`}>
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 shadow-sm
                    ${msg.role === 'USER' 
                      ? 'bg-primary text-white' 
                      : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-primary'}`}>
                    {msg.role === 'USER' ? 'U' : 'DS'}
                  </div>
                  <div className={`flex flex-col max-w-[85%] ${msg.role === 'USER' ? 'items-end' : 'items-start'}`}>
                    <div className={`px-5 py-3.5 rounded-2xl shadow-sm text-sm whitespace-pre-wrap leading-relaxed
                      ${msg.role === 'USER' 
                        ? 'bg-primary text-white rounded-tr-none' 
                        : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200 rounded-tl-none'}`}>
                      {msg.role === 'USER' ? (
                        msg.message
                      ) : (
                        <div className="markdown-content space-y-2 [&>p]:mb-2 [&>ul]:list-disc [&>ul]:ml-4 [&>ol]:list-decimal [&>ol]:ml-4 [&_strong]:font-bold [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:mt-3">
                          <ReactMarkdown>{msg.message}</ReactMarkdown>
                        </div>
                      )}
                    </div>
                    
                    {/* Sources */}
                    {msg.source && msg.source.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {msg.source.map((s, i) => (
                          <span key={i} className="inline-flex items-center gap-1.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 text-xs px-2.5 py-1 rounded-md shadow-sm">
                            <FileText className="h-3 w-3" />
                            <span className="truncate max-w-[200px]" title={s.document}>{s.document}</span>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              
              {loadingChat && (
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-primary flex items-center justify-center shrink-0 shadow-sm">
                    DS
                  </div>
                  <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 px-5 py-4 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-2">
                    <div className="w-2 h-2 bg-gray-300 dark:bg-gray-600 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-300 dark:bg-gray-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-2 h-2 bg-gray-300 dark:bg-gray-600 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Chat Input */}
            <div className="p-4 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 shrink-0 transition-colors">
              <form onSubmit={handleSendMessage} className="max-w-4xl mx-auto relative flex items-center">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask anything..."
                  className="w-full pl-5 pr-14 py-4 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 dark:focus:ring-primary/50 focus:border-primary dark:focus:border-primary transition-all text-sm shadow-inner dark:text-white"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || loadingChat}
                  className="absolute right-2 p-2.5 bg-primary text-white rounded-xl hover:bg-indigo-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
                >
                  <Send className="h-5 w-5" />
                </button>
              </form>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
