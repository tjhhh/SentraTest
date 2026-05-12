import React from 'react';
import { Image as ImageIcon, Eye } from 'lucide-react';

interface EvidenceGalleryProps {
  screenshots: string[];
}

export const EvidenceGallery: React.FC<EvidenceGalleryProps> = ({ screenshots }) => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-full">
      <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex items-center gap-2">
        <ImageIcon className="w-4 h-4 text-slate-400" />
        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Visual Evidence</span>
      </div>
      <div className="flex-1 p-4 overflow-y-auto space-y-4 custom-scrollbar">
        {screenshots.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-2">
            <ImageIcon className="w-8 h-8 opacity-20" />
            <p className="text-xs italic">No screenshots captured.</p>
          </div>
        ) : (
          screenshots.map((file, i) => (
            <div key={i} className="space-y-2 group animate-in fade-in zoom-in-95 duration-300">
              <div 
                className="relative rounded-xl overflow-hidden border border-slate-200 shadow-sm transition-transform group-hover:scale-[1.02] cursor-pointer"
                onClick={() => window.open(`${apiUrl}/screenshots/${file}`, '_blank')}
              >
                <img 
                  src={`${apiUrl}/screenshots/${file}`} 
                  alt={`Step ${i}`} 
                  className="w-full h-auto block"
                />
                <div className="absolute inset-0 bg-indigo-600/0 group-hover:bg-indigo-600/10 transition-colors flex items-center justify-center">
                  <Eye className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
              <p className="text-[10px] text-slate-400 font-mono truncate">{file}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
