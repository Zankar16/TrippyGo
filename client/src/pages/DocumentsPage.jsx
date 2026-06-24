import React, { useState, useEffect } from 'react';
import { FileText, Download, Trash2, Eye, Plus, Upload, Filter, Search } from 'lucide-react';
import API from '../services/api';

const DocumentsPage = () => {
  const [documents, setDocuments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDocs = async () => {
      try {
        const res = await API.get('/documents');
        setDocuments(res.data);
      } catch (err) {
        console.error('Docs error:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDocs();
  }, []);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Trip Documents</h1>
          <p className="text-slate-500 mt-1 font-medium">Keep your tickets, visas, and IDs in one place</p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-6 rounded-[14px] transition-all shadow-lg shadow-blue-200 active:scale-[0.98] flex items-center gap-2">
          <Upload size={18} />
          Upload New
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {documents.map((doc) => (
          <div key={doc.id} className="group bg-white border border-slate-200 p-6 rounded-[24px] hover:border-blue-500 hover:shadow-2xl hover:shadow-blue-900/5 transition-all duration-300">
            <div className="flex items-start justify-between mb-4">
              <div className="bg-blue-50 p-3 rounded-2xl text-blue-600 shadow-sm border border-blue-100/50">
                <FileText size={28} />
              </div>
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                 <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg"><Eye size={18} /></button>
                 <button className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg"><Trash2 size={18} /></button>
              </div>
            </div>

            <h3 className="text-lg font-bold text-slate-900 truncate mb-1">{doc.originalName}</h3>
            <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest mb-4">
              {doc.mimeType.split('/')[1]} • {(doc.size / 1024).toFixed(1)} KB
            </p>

            <div className="flex items-center justify-between pt-4 border-t border-slate-50">
              <span className="text-[10px] font-bold pb-0.5 border-b-2 border-green-500 text-green-600 uppercase tracking-widest">Verified</span>
              <button 
                onClick={() => window.open(`http://localhost:5000${doc.filePath}`, '_blank')}
                className="flex items-center gap-2 text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors"
              >
                <Download size={14} />
                Download
              </button>
            </div>
          </div>
        ))}

        {documents.length === 0 && !isLoading && (
          <div className="col-span-full py-24 text-center bg-slate-50 rounded-[32px] border border-dashed border-slate-300">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm border border-slate-200">
              <Plus className="text-slate-300" size={24} />
            </div>
            <h2 className="text-xl font-bold text-slate-800">No documents uploaded</h2>
            <p className="text-slate-500 max-w-xs mx-auto mt-2">Upload your travel documents for easy access anywhere.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DocumentsPage;
