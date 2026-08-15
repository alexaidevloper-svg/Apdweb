import React from 'react';
import { AndroidFrame } from './AndroidFrame';

export const ProjectList: React.FC = () => {
  const projects = [
    { name: 'My Website', date: '2026-08-15 12:34:39', emoji: '🌐' },
    { name: 'Plazaallhub', date: '2026-06-16 12:34:59', emoji: '🏪' },
    { name: 'eom19', date: '2026-07-13 12:16:16', emoji: '📱' },
    { name: 'Nep Nost', date: '2026-07-19 13:32:72', emoji: '📁' },
  ];

  return (
    <AndroidFrame>
      <div className="w-full">
        {/* हेडर - ऊपर का टाइटल और बटन */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-slate-800">Apd Web</h1>
          <button className="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-600 transition-colors">
            + Create Project
          </button>
        </div>

        {/* प्रोजेक्ट लिस्ट - सारे प्रोजेक्ट यहाँ दिखेंगे */}
        <div className="space-y-3">
          {projects.map((project, index) => (
            <div 
              key={index}
              className="flex items-center justify-between bg-white rounded-xl p-4 shadow-sm border border-slate-100 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{project.emoji}</span>
                <div>
                  <h3 className="font-semibold text-slate-800">{project.name}</h3>
                  <p className="text-xs text-slate-400">{project.date}</p>
                </div>
              </div>
              <button className="text-slate-400 hover:text-slate-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                </svg>
              </button>
            </div>
          ))}
        </div>

        {/* नीचे का नेविगेशन बार - Home और iFeedy बटन */}
        <div className="fixed bottom-0 left-0 right-0 max-w-[430px] mx-auto bg-white border-t border-slate-200 flex justify-around py-3 px-4">
          <button className="flex flex-col items-center text-blue-500">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 3L2 12h3v8h6v-6h2v6h6v-8h3L12 3z" />
            </svg>
            <span className="text-xs mt-1">Home</span>
          </button>
          <button className="flex flex-col items-center text-slate-400 hover:text-slate-600">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            <span className="text-xs mt-1">iFeedy</span>
          </button>
        </div>
      </div>
    </AndroidFrame>
  );
}
