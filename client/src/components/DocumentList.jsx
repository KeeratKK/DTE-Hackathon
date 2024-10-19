// src/components/DocumentList.jsx
import React from 'react';

const DocumentList = ({ documents, onSelect, onDelete }) => {
  return (
    <div className="w-1/4 bg-white p-6 rounded-xl shadow-lg border-2 border-[#87CEEB]">
      <h3 className="font-bold text-3xl text-black mb-8">Current Documents</h3>
      <ul className="space-y-6">
        {documents.map((doc, index) => (
          <li 
            key={index} 
            className="flex flex-col bg-[#87CEEB] text-white p-4 rounded-lg hover:bg-[#71b8d1] transition"
          >
            <div className="flex justify-between items-center">
              {/* Document Name with Slightly Less Restriction */}
              <span 
                className="cursor-pointer font-bold text-lg truncate max-w-[350px]" // Max width set to 350px
                onClick={() => onSelect(doc)}
                title={doc.name} // Tooltip to show full name on hover
              >
                {doc.name}
              </span>

              {/* Delete Button (X) */}
              <button 
                className="text-white font-bold px-3 py-1 rounded hover:opacity-75 transition" 
                onClick={() => onDelete(doc)}
              >
                X
              </button>
            </div>

            {/* Document Tags */}
            {doc.tags && doc.tags.length > 0 && (
              <div className="mt-2 space-x-2">
                {doc.tags.map((tag, tagIndex) => (
                  <span 
                    key={tagIndex} 
                    className="inline-block bg-white text-[#87CEEB] text-sm font-semibold px-3 py-1 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DocumentList;
