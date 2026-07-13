import { useState, useEffect } from 'react';
import api from '../../api/axios';
import { 
  Upload, 
  FileText, 
  Trash2, 
  Loader2,
  CheckCircle2,
  XCircle,
  FileCode,
  FileSpreadsheet,
  FileIcon,
  Type
} from 'lucide-react';

export default function UploadPage() {
  const [documents, setDocuments] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  
  // Text Upload State
  const [textMode, setTextMode] = useState(false);
  const [pastedText, setPastedText] = useState('');
  const [textTitle, setTextTitle] = useState('');
  const [uploadingText, setUploadingText] = useState(false);

  // Document Type State
  const [documentType, setDocumentType] = useState('General Article / Report');
  const documentTypes = [
    "General Article / Report",
    "Q&A / FAQs",
    "Legal Document (Act/Code)",
    "Code / Technical Documentation",
    "Financial Report"
  ];

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const res = await api.get('/documents/');
      setDocuments(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleFiles = async (files) => {
    if (!files || !files.length) return;

    setUploading(true);
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append('files', files[i]);
    }
    formData.append('document_type', documentType);

    try {
      await api.post('/documents/upload/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      fetchDocuments();
    } catch (err) {
      console.error(err);
      alert('Failed to upload document(s)');
    } finally {
      setUploading(false);
    }
  };

  const onDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = () => setIsDragging(false);

  const onDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  const handleFileInput = (e) => handleFiles(e.target.files);

  const handleDeleteDocument = async (id) => {
    try {
      await api.delete(`/documents/${id}/`);
      fetchDocuments();
    } catch (err) {
      console.error(err);
    }
  };

  const handleTextUpload = async () => {
    if (!pastedText.trim()) return;
    setUploadingText(true);
    try {
      await api.post('/documents/upload_text/', {
        title: textTitle || 'Pasted Text',
        text: pastedText,
        document_type: documentType
      });
      setTextMode(false);
      setPastedText('');
      setTextTitle('');
      fetchDocuments();
    } catch (err) {
      console.error(err);
      alert('Failed to upload text');
    } finally {
      setUploadingText(false);
    }
  };

  const getFileIcon = (title) => {
    const ext = title.split('.').pop().toLowerCase();
    switch (ext) {
      case 'pdf': return <FileText className="h-5 w-5 text-red-500" />;
      case 'csv': return <FileSpreadsheet className="h-5 w-5 text-green-500" />;
      case 'md':
      case 'txt': return <FileCode className="h-5 w-5 text-blue-500" />;
      case 'docx': return <FileIcon className="h-5 w-5 text-indigo-500" />;
      default: return <FileText className="h-5 w-5 text-gray-500" />;
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-gray-50 dark:bg-gray-900 p-6 md:p-8 overflow-y-auto transition-colors">
      <div className="max-w-4xl mx-auto w-full space-y-8">
        
        {/* Header */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Upload Documents</h2>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Add knowledge to your DocSense repository. Support for PDF, DOCX, TXT, MD, and CSV.</p>
        </div>

        {/* Upload Options Toggle */}
        <div className="flex bg-white dark:bg-gray-800 rounded-lg shadow-sm p-1 w-fit border border-gray-200 dark:border-gray-700 transition-colors">
          <button
            onClick={() => setTextMode(false)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${!textMode ? 'bg-primary text-white' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
          >
            File Upload
          </button>
          <button
            onClick={() => setTextMode(true)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${textMode ? 'bg-primary text-white' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
          >
            Paste Text
          </button>
        </div>

        {/* Document Type Selector */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 transition-colors">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Select Document Type</label>
          <select 
            value={documentType}
            onChange={(e) => setDocumentType(e.target.value)}
            className="w-full sm:w-1/2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-lg p-2.5 text-sm focus:ring-primary focus:border-primary transition-colors"
          >
            {documentTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
          <p className="text-xs text-gray-500 mt-2">Selecting the correct type improves AI accuracy by applying the optimal parsing and chunking strategy.</p>
        </div>

        {/* Upload Area */}
        {textMode ? (
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 space-y-4 transition-colors">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title (Optional)</label>
              <input 
                type="text" 
                value={textTitle}
                onChange={e => setTextTitle(e.target.value)}
                placeholder="e.g. Website Pricing Data"
                className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 dark:text-white rounded-lg p-2.5 text-sm focus:ring-primary focus:border-primary transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Content</label>
              <textarea 
                value={pastedText}
                onChange={e => setPastedText(e.target.value)}
                placeholder="Paste your text here..."
                rows={8}
                className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 dark:text-white rounded-lg p-3 text-sm focus:ring-primary focus:border-primary transition-colors"
              ></textarea>
            </div>
            <div className="flex justify-end">
              <button
                onClick={handleTextUpload}
                disabled={!pastedText.trim() || uploadingText}
                className="bg-primary text-white px-5 py-2 rounded-lg font-medium hover:bg-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {uploadingText ? <Loader2 className="h-4 w-4 animate-spin" /> : <Type className="h-4 w-4" />}
                {uploadingText ? 'Saving...' : 'Save as Document'}
              </button>
            </div>
          </div>
        ) : (
          <div
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
            className={`border-2 border-dashed rounded-2xl p-10 text-center transition-all bg-white dark:bg-gray-800
              ${isDragging ? 'border-primary bg-indigo-50/50 dark:bg-indigo-900/20' : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'}
              ${uploading ? 'opacity-50 pointer-events-none' : ''}`}
          >
            <div className="flex flex-col items-center justify-center">
              <div className="w-16 h-16 bg-indigo-50 dark:bg-gray-900 rounded-full flex items-center justify-center mb-4 transition-colors">
                {uploading ? (
                  <Loader2 className="h-8 w-8 text-primary animate-spin" />
                ) : (
                  <Upload className="h-8 w-8 text-primary" />
                )}
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                {uploading ? 'Processing files...' : 'Drag & drop files here'}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                or click to browse from your computer
              </p>
              
              <input
                type="file"
                id="file-upload"
                multiple
                accept=".pdf,.txt,.md,.csv,.docx"
                className="hidden"
                onChange={handleFileInput}
                disabled={uploading}
              />
              <label 
                htmlFor="file-upload" 
                className="cursor-pointer bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 px-6 py-2.5 rounded-lg font-medium shadow-sm hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
              >
                Select Files
              </label>
            </div>
          </div>
        )}

        {/* Gallery / Document List */}
        <div className="mt-12">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Document Gallery</h3>
          {documents.length === 0 ? (
            <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 border-dashed transition-colors">
              <FileIcon className="h-10 w-10 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
              <p className="text-gray-500 dark:text-gray-400">No documents found. Upload something to get started.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {documents.map(doc => (
                <div key={doc.id} className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 flex flex-col justify-between group transition-colors">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 shrink-0">
                      {getFileIcon(doc.title)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate" title={doc.title}>
                        {doc.title}
                      </h4>
                      <div className="flex items-center gap-1.5 mt-1">
                        {doc.status === 'READY' ? (
                          <><CheckCircle2 className="h-3 w-3 text-green-500" /><span className="text-xs text-gray-500">Ready</span></>
                        ) : doc.status === 'FAILED' ? (
                          <><XCircle className="h-3 w-3 text-red-500" /><span className="text-xs text-red-500">Failed</span></>
                        ) : (
                          <><Loader2 className="h-3 w-3 text-blue-500 animate-spin" /><span className="text-xs text-blue-500">Processing</span></>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 flex justify-end">
                    <button 
                      onClick={() => handleDeleteDocument(doc.id)} 
                      className="text-gray-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100 p-1"
                      title="Delete document"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
