import { useState, useEffect } from 'react';
import api from '../../api/axios';
import { Smartphone, CheckCircle2, Copy, Trash2, Loader2, FileText, Check } from 'lucide-react';

export default function WhatsAppSettingsPage() {
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // Form State
  const [phoneNumberId, setPhoneNumberId] = useState('');
  const [accessToken, setAccessToken] = useState('');
  
  // Document Selection
  const [documents, setDocuments] = useState([]);
  const [selectedDocs, setSelectedDocs] = useState([]);

  // Use a placeholder to make it clear they need to use ngrok for Meta
  const webhookUrl = `https://<YOUR_NGROK_URL>/api/whatsapp/webhook/`;

  useEffect(() => {
    fetchConfig();
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const res = await api.get('/documents/');
      setDocuments(res.data.filter(d => d.status === 'READY'));
    } catch (err) {
      console.error(err);
    }
  };

  const fetchConfig = async () => {
    try {
      const res = await api.get('/whatsapp/config/');
      setConfig(res.data);
      setPhoneNumberId(res.data.phone_number_id);
      setSelectedDocs(res.data.selected_docs || []);
    } catch (err) {
      if (err.response?.status !== 404) {
        console.error(err);
      }
      setConfig(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!phoneNumberId) return;
    if (!config?.is_active && !accessToken) {
      alert("Access token is required for new configuration");
      return;
    }
    
    setSaving(true);
    try {
      await api.post('/whatsapp/config/', {
        phone_number_id: phoneNumberId,
        access_token: accessToken,
        selected_docs: selectedDocs
      });
      fetchConfig();
      setAccessToken('');
    } catch (err) {
      console.error(err);
      alert('Failed to save configuration');
    } finally {
      setSaving(false);
    }
  };

  const handleDisconnect = async () => {
    if (!confirm('Are you sure you want to disconnect WhatsApp? This will stop all incoming and outgoing messages.')) return;
    
    try {
      await api.delete('/whatsapp/config/');
      setConfig(null);
      setPhoneNumberId('');
      setSelectedDocs([]);
    } catch (err) {
      console.error(err);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  const toggleDocSelection = (title) => {
    setSelectedDocs(prev => 
      prev.includes(title) 
        ? prev.filter(t => t !== title)
        : [...prev, title]
    );
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50 dark:bg-gray-900 transition-colors">
        <Loader2 className="h-8 w-8 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-gray-50 dark:bg-gray-900 p-6 md:p-8 overflow-y-auto transition-colors text-gray-900 dark:text-gray-100">
      <div className="max-w-3xl mx-auto w-full space-y-8">
        
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 p-2 rounded-xl">
              <Smartphone className="h-6 w-6" />
            </div>
            <h2 className="text-2xl font-bold">WhatsApp Integration</h2>
          </div>
          <p className="text-gray-500 dark:text-gray-400">
            Connect your Meta WhatsApp Business account to allow users to ask questions directly via WhatsApp. Answers will be generated securely from your DocSense knowledge base.
          </p>
        </div>

        {config && config.is_active ? (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 space-y-6 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-green-600 dark:text-green-400 font-medium">
                <CheckCircle2 className="h-5 w-5" />
                Integration Active
              </div>
              <button 
                onClick={handleDisconnect}
                className="flex items-center gap-2 px-3 py-1.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors font-medium"
              >
                <Trash2 className="h-4 w-4" />
                Disconnect
              </button>
            </div>
            
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-800 dark:text-gray-200">Webhook Details</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Provide these details in your Meta Developer Dashboard under WhatsApp &gt; Configuration to enable message receiving.
              </p>
              
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Callback URL</label>
                  <div className="mt-1 flex items-center">
                    <input 
                      type="text" 
                      readOnly 
                      value={webhookUrl}
                      className="flex-1 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-l-lg py-2 px-3 text-sm text-gray-700 dark:text-gray-300 font-mono outline-none"
                    />
                    <button 
                      onClick={() => copyToClipboard(webhookUrl)}
                      className="bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 border-y border-r border-gray-200 dark:border-gray-700 px-3 py-2 rounded-r-lg transition-colors"
                      title="Copy URL"
                    >
                      <Copy className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Verify Token</label>
                  <div className="mt-1 flex items-center">
                    <input 
                      type="text" 
                      readOnly 
                      value={config.verify_token}
                      className="flex-1 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-l-lg py-2 px-3 text-sm text-gray-700 dark:text-gray-300 font-mono outline-none"
                    />
                    <button 
                      onClick={() => copyToClipboard(config.verify_token)}
                      className="bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 border-y border-r border-gray-200 dark:border-gray-700 px-3 py-2 rounded-r-lg transition-colors"
                      title="Copy Token"
                    >
                      <Copy className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="pt-4 border-t border-gray-100 dark:border-gray-700">
              <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-3">Update Credentials</h3>
              <form onSubmit={handleSave} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone Number ID</label>
                  <input 
                    type="text" 
                    value={phoneNumberId}
                    onChange={(e) => setPhoneNumberId(e.target.value)}
                    className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg p-2.5 text-sm focus:ring-primary focus:border-primary transition-colors outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">New Permanent Access Token</label>
                  <input 
                    type="password" 
                    value={accessToken}
                    onChange={(e) => setAccessToken(e.target.value)}
                    placeholder="Leave blank to keep existing token"
                    className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg p-2.5 text-sm focus:ring-primary focus:border-primary transition-colors outline-none"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-end mb-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Accessible Documents
                    </label>
                    <span className="text-xs text-gray-500">
                      {selectedDocs.length === 0 ? 'All Documents Selected' : `${selectedDocs.length} Selected`}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                    Select which documents the WhatsApp bot can read. If none are selected, it searches all ready documents.
                  </p>
                  
                  <div className="max-h-48 overflow-y-auto border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800/50 p-2 space-y-1">
                    {documents.length === 0 ? (
                      <p className="text-sm text-gray-500 p-2 text-center">No ready documents available.</p>
                    ) : (
                      documents.map(doc => {
                        const isSelected = selectedDocs.includes(doc.title);
                        return (
                          <button
                            key={doc.id}
                            type="button"
                            onClick={() => toggleDocSelection(doc.title)}
                            className={`w-full flex items-center justify-between px-3 py-2 rounded-md hover:bg-white dark:hover:bg-gray-700 transition-colors text-left border ${isSelected ? 'border-primary/20 bg-primary/5 dark:bg-primary/10' : 'border-transparent'}`}
                          >
                            <div className="flex items-center gap-2 truncate pr-2">
                              <FileText className={`h-4 w-4 shrink-0 ${isSelected ? 'text-primary' : 'text-gray-400'}`} />
                              <span className={`text-sm truncate ${isSelected ? 'text-primary font-medium' : 'text-gray-600 dark:text-gray-300'}`}>
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

                <button
                  type="submit"
                  disabled={saving || !phoneNumberId}
                  className="bg-primary text-white px-5 py-2 rounded-lg font-medium hover:bg-indigo-600 disabled:opacity-50 transition-colors flex items-center gap-2"
                >
                  {saving && <Loader2 className="h-4 w-4 animate-spin" />}
                  Update Configuration
                </button>
              </form>
            </div>
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 transition-colors">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">Connect WhatsApp</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
              Enter your Meta API credentials below to generate a Webhook URL.
            </p>
            
            <form onSubmit={handleSave} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone Number ID</label>
                <input 
                  type="text" 
                  required
                  value={phoneNumberId}
                  onChange={(e) => setPhoneNumberId(e.target.value)}
                  placeholder="e.g. 1042398457293"
                  className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg p-2.5 text-sm focus:ring-primary focus:border-primary transition-colors outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Permanent Access Token</label>
                <input 
                  type="password" 
                  required
                  value={accessToken}
                  onChange={(e) => setAccessToken(e.target.value)}
                  placeholder="EAAI..."
                  className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg p-2.5 text-sm focus:ring-primary focus:border-primary transition-colors outline-none"
                />
              </div>
              
              <button
                type="submit"
                disabled={saving || !phoneNumberId || !accessToken}
                className="w-full bg-primary text-white px-5 py-3 rounded-xl font-medium hover:bg-indigo-600 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
              >
                {saving && <Loader2 className="h-4 w-4 animate-spin" />}
                Save & Generate Webhook
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
