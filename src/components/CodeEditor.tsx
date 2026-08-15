import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  ChevronLeft,
  Undo,
  Redo,
  Play,
  Save,
  Keyboard,
  X,
  Sparkles,
  Check,
  Search,
  ChevronDown,
  ChevronUp,
  Replace,
  CaseSensitive,
} from 'lucide-react';
import { ProjectFile } from '../types';

interface CodeEditorProps {
  file: ProjectFile;
  onBack: () => void;
  onSave: (content: string) => void;
  onRun: () => void;
}

const COMMON_SNIPPETS = [
  { label: '< >', insert: '<>' },
  { label: '</>', insert: '</>' },
  { label: '{ }', insert: '{}' },
  { label: '( )', insert: '()' },
  { label: '[ ]', insert: '[]' },
  { label: ';', insert: ';' },
  { label: '" "', insert: '""' },
  { label: "' '", insert: "''" },
  { label: '=', insert: ' = ' },
  { label: ':', insert: ': ' },
  { label: '=>', insert: ' => ' },
  { label: '$', insert: '$' },
  { label: '.', insert: '.' },
  { label: '#', insert: '#' },
  { label: '/', insert: '/' },
  { label: '<div>', insert: '<div></div>' },
  { label: 'class=""', insert: 'class=""' },
  { label: 'function()', insert: 'function () {\n  \n}' },
  { label: 'console.log', insert: 'console.log();' },
  { label: '<?php ?>', insert: '<?php \n\n?>' },
];

export const CodeEditor: React.FC<CodeEditorProps> = ({ file, onBack, onSave, onRun }) => {
  const [content, setContent] = useState(file.content);
  const [history, setHistory] = useState<string[]>([file.content]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [isSaved, setIsSaved] = useState(true);
  const [showSaveToast, setShowSaveToast] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Search & Replace state
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [replaceQuery, setReplaceQuery] = useState('');
  const [isReplaceMode, setIsReplaceMode] = useState(false);
  const [matchCase, setMatchCase] = useState(false);
  const [currentMatchIndex, setCurrentMatchIndex] = useState(0);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setContent(file.content);
    setHistory([file.content]);
    setHistoryIndex(0);
    setIsSaved(true);
  }, [file.id]);

  // Compute matches
  const matchPositions = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const positions: number[] = [];
    const source = matchCase ? content : content.toLowerCase();
    const query = matchCase ? searchQuery : searchQuery.toLowerCase();
    let pos = 0;
    while ((pos = source.indexOf(query, pos)) !== -1) {
      positions.push(pos);
      pos += query.length || 1;
    }
    return positions;
  }, [content, searchQuery, matchCase]);

  // Adjust current match index if out of bounds
  useEffect(() => {
    if (matchPositions.length === 0) {
      setCurrentMatchIndex(0);
    } else if (currentMatchIndex >= matchPositions.length) {
      setCurrentMatchIndex(0);
    }
  }, [matchPositions.length]);

  const highlightAndSelectMatch = (posIndex: number) => {
    if (!textareaRef.current || matchPositions.length === 0) return;
    const start = matchPositions[posIndex];
    if (start === undefined) return;
    const end = start + searchQuery.length;
    const textarea = textareaRef.current;
    
    // Focus textarea and set selection range
    textarea.focus();
    textarea.setSelectionRange(start, end);

    // Calculate line number to scroll the match directly into clear view
    const textUpToMatch = content.substring(0, start);
    const lineNumber = textUpToMatch.split('\n').length;
    const lineHeight = 20; // 20px line-height
    // Center or place near upper-middle of textarea
    const targetScrollTop = Math.max(0, (lineNumber - 3) * lineHeight);
    textarea.scrollTop = targetScrollTop;
  };

  const handleFindNext = () => {
    if (matchPositions.length === 0) return;
    const nextIdx = (currentMatchIndex + 1) % matchPositions.length;
    setCurrentMatchIndex(nextIdx);
    highlightAndSelectMatch(nextIdx);
  };

  const handleFindPrev = () => {
    if (matchPositions.length === 0) return;
    const prevIdx = (currentMatchIndex - 1 + matchPositions.length) % matchPositions.length;
    setCurrentMatchIndex(prevIdx);
    highlightAndSelectMatch(prevIdx);
  };

  const handleReplaceCurrent = () => {
    if (matchPositions.length === 0 || !searchQuery) return;
    const targetPos = matchPositions[currentMatchIndex];
    if (targetPos === undefined) return;

    const newContent =
      content.substring(0, targetPos) +
      replaceQuery +
      content.substring(targetPos + searchQuery.length);

    handleChange(newContent);

    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
        textareaRef.current.setSelectionRange(targetPos, targetPos + replaceQuery.length);
      }
    }, 10);
  };

  const handleReplaceAll = () => {
    if (matchPositions.length === 0 || !searchQuery) return;
    let newContent = '';
    if (matchCase) {
      newContent = content.split(searchQuery).join(replaceQuery);
    } else {
      const regex = new RegExp(searchQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
      newContent = content.replace(regex, replaceQuery);
    }
    handleChange(newContent);
  };

  const toggleSearchBox = () => {
    setShowSearch((prev) => {
      const next = !prev;
      if (next) {
        setTimeout(() => searchInputRef.current?.focus(), 100);
      }
      return next;
    });
  };

  // Keyboard shortcut Ctrl+F / Cmd+F handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'f') {
        e.preventDefault();
        setShowSearch(true);
        setTimeout(() => searchInputRef.current?.focus(), 100);
      } else if (e.key === 'Escape' && showSearch) {
        setShowSearch(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showSearch]);

  const handleChange = (newVal: string) => {
    setContent(newVal);
    setIsSaved(false);

    // Add to undo history
    if (newVal !== history[historyIndex]) {
      const newHistory = history.slice(0, historyIndex + 1);
      newHistory.push(newVal);
      if (newHistory.length > 50) newHistory.shift();
      setHistory(newHistory);
      setHistoryIndex(newHistory.length - 1);
    }
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      const prev = history[historyIndex - 1];
      setHistoryIndex(historyIndex - 1);
      setContent(prev);
      setIsSaved(false);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const next = history[historyIndex + 1];
      setHistoryIndex(historyIndex + 1);
      setContent(next);
      setIsSaved(false);
    }
  };

  const handleSave = () => {
    onSave(content);
    setIsSaved(true);
    setShowSaveToast(true);
    setTimeout(() => setShowSaveToast(false), 2000);
  };

  const insertSnippet = (snippet: string) => {
    if (!textareaRef.current) return;
    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const newContent = content.substring(0, start) + snippet + content.substring(end);
    handleChange(newContent);

    // Reposition cursor
    setTimeout(() => {
      textarea.focus();
      textarea.selectionStart = textarea.selectionEnd = start + snippet.length;
    }, 10);
  };

  // Compute line numbers
  const lines = content.split('\n');

  return (
    <div className="flex-1 flex flex-col bg-slate-950 text-slate-100 min-h-0 select-none">
      {/* Top Header */}
      <div className="px-3 py-2.5 bg-slate-900 border-b border-slate-800 flex items-center justify-between z-10">
        <div className="flex items-center gap-2 min-w-0">
          <button
            onClick={onBack}
            className="p-1 hover:bg-slate-800 rounded-full text-slate-300 hover:text-white transition"
            title="Back"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-1.5 truncate">
            <span className="text-sm font-bold text-white truncate">{file.name}</span>
            {!isSaved && (
              <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0" title="Unsaved changes" />
            )}
          </div>
        </div>

        <div className="flex items-center gap-1">
          {/* Find & Search Button */}
          <button
            onClick={toggleSearchBox}
            className={`p-1.5 rounded-lg transition ${
              showSearch
                ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-500/40'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
            title="Find & Replace in Code (Ctrl+F)"
          >
            <Search className="w-4 h-4" />
          </button>

          <button
            onClick={handleUndo}
            disabled={historyIndex <= 0}
            className="p-1.5 text-slate-300 hover:text-white disabled:opacity-30 rounded-lg hover:bg-slate-800 transition"
            title="Undo"
          >
            <Undo className="w-4 h-4" />
          </button>
          <button
            onClick={handleRedo}
            disabled={historyIndex >= history.length - 1}
            className="p-1.5 text-slate-300 hover:text-white disabled:opacity-30 rounded-lg hover:bg-slate-800 transition"
            title="Redo"
          >
            <Redo className="w-4 h-4" />
          </button>
          <button
            onClick={handleSave}
            className="p-1.5 text-emerald-400 hover:text-emerald-300 rounded-lg hover:bg-slate-800 transition"
            title="Save"
          >
            <Save className="w-4 h-4" />
          </button>
          <button
            onClick={() => {
              handleSave();
              onRun();
            }}
            className="flex items-center gap-1 bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white px-3 py-1 rounded-xl text-xs font-semibold shadow transition ml-1"
            title="Run Code in WebView"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Run</span>
          </button>
        </div>
      </div>

      {/* Find & Replace Bar */}
      {showSearch && (
        <div className="bg-slate-900 border-b border-slate-700/80 px-3 py-2 text-xs space-y-1.5 z-20 shadow-lg animate-in slide-in-from-top-2 duration-150">
          {/* Find Row */}
          <div className="flex items-center gap-1.5">
            <div className="flex-1 flex items-center bg-slate-950 border border-slate-700 rounded-lg px-2 py-1">
              <Search className="w-3.5 h-3.5 text-slate-400 mr-1.5 shrink-0" />
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Find in code..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  if (matchPositions.length > 0) highlightAndSelectMatch(0);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    if (e.shiftKey) handleFindPrev();
                    else handleFindNext();
                  }
                }}
                className="bg-transparent border-none outline-none text-xs text-white placeholder-slate-500 w-full"
              />
              {searchQuery && (
                <span className="text-[10px] text-slate-400 font-mono px-1 shrink-0">
                  {matchPositions.length > 0
                    ? `${currentMatchIndex + 1}/${matchPositions.length}`
                    : '0/0'}
                </span>
              )}
            </div>

            {/* Previous & Next Matches */}
            <button
              onClick={handleFindPrev}
              disabled={matchPositions.length === 0}
              className="p-1.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-30 rounded-lg text-slate-300 hover:text-white transition"
              title="Previous Match (Shift+Enter)"
            >
              <ChevronUp className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleFindNext}
              disabled={matchPositions.length === 0}
              className="p-1.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-30 rounded-lg text-slate-300 hover:text-white transition"
              title="Next Match (Enter)"
            >
              <ChevronDown className="w-3.5 h-3.5" />
            </button>

            {/* Case Sensitive Toggle */}
            <button
              onClick={() => setMatchCase(!matchCase)}
              className={`p-1.5 rounded-lg border transition ${
                matchCase
                  ? 'bg-emerald-950/80 border-emerald-500/60 text-emerald-400 font-bold'
                  : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
              }`}
              title="Match Case"
            >
              <CaseSensitive className="w-3.5 h-3.5" />
            </button>

            {/* Toggle Replace Mode */}
            <button
              onClick={() => setIsReplaceMode(!isReplaceMode)}
              className={`p-1.5 rounded-lg border transition ${
                isReplaceMode
                  ? 'bg-emerald-950/80 border-emerald-500/60 text-emerald-400'
                  : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
              }`}
              title="Toggle Replace"
            >
              <Replace className="w-3.5 h-3.5" />
            </button>

            {/* Close Find Bar */}
            <button
              onClick={() => setShowSearch(false)}
              className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
              title="Close Search (Esc)"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Replace Row */}
          {isReplaceMode && (
            <div className="flex items-center gap-1.5 pt-0.5 animate-in slide-in-from-top-1">
              <div className="flex-1 flex items-center bg-slate-950 border border-slate-700 rounded-lg px-2 py-1">
                <Replace className="w-3.5 h-3.5 text-slate-400 mr-1.5 shrink-0" />
                <input
                  type="text"
                  placeholder="Replace with..."
                  value={replaceQuery}
                  onChange={(e) => setReplaceQuery(e.target.value)}
                  className="bg-transparent border-none outline-none text-xs text-white placeholder-slate-500 w-full"
                />
              </div>

              <button
                onClick={handleReplaceCurrent}
                disabled={matchPositions.length === 0}
                className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 disabled:opacity-30 rounded-lg text-slate-200 hover:text-white text-[11px] font-medium transition"
              >
                Replace
              </button>

              <button
                onClick={handleReplaceAll}
                disabled={matchPositions.length === 0}
                className="px-2.5 py-1 bg-emerald-700/80 hover:bg-emerald-600 disabled:opacity-30 rounded-lg text-white text-[11px] font-medium transition"
              >
                All
              </button>
            </div>
          )}
        </div>
      )}

      {/* Save Notification Toast */}
      {showSaveToast && (
        <div className="absolute top-14 left-1/2 -translate-x-1/2 z-30 bg-emerald-600 text-white text-xs font-medium px-4 py-1.5 rounded-full shadow-lg flex items-center gap-1.5 animate-bounce">
          <Check className="w-3.5 h-3.5" />
          <span>File Saved</span>
        </div>
      )}

      {/* Code Editor Body */}
      <div className="flex-1 flex overflow-hidden font-mono text-xs relative bg-[#0d1117]">
        {/* Line Numbers Column */}
        <div className="w-10 bg-[#090d13] text-slate-500 py-3 text-right pr-2 select-none border-r border-slate-800/80 overflow-hidden shrink-0">
          {lines.map((_, i) => (
            <div key={i} className="leading-[20px] h-[20px] text-[11px]">
              {i + 1}
            </div>
          ))}
        </div>

        {/* Textarea Code Input */}
        <textarea
          ref={textareaRef}
          value={content}
          onChange={(e) => handleChange(e.target.value)}
          spellCheck={false}
          autoCapitalize="none"
          autoComplete="off"
          autoCorrect="off"
          className="flex-1 bg-transparent text-slate-200 p-3 leading-[20px] outline-none resize-none overflow-auto font-mono text-xs whitespace-pre tab-[2]"
          style={{ tabSize: 2 }}
        />
      </div>

      {/* Keyboard & Shortcut Action Bar (Screen 5 Bottom) */}
      <div className="bg-slate-900 border-t border-slate-800 px-3 py-1.5 flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center gap-3">
          <button
            onClick={handleSave}
            className="hover:text-emerald-400 font-semibold transition"
          >
            Save
          </button>
          <button
            onClick={toggleSearchBox}
            className="hover:text-emerald-400 flex items-center gap-1 font-semibold transition"
          >
            <Search className="w-3 h-3" />
            <span>Find</span>
          </button>
          <button
            onClick={handleUndo}
            disabled={historyIndex <= 0}
            className="hover:text-white disabled:opacity-40 transition"
          >
            Undo
          </button>
          <button
            onClick={handleRedo}
            disabled={historyIndex >= history.length - 1}
            className="hover:text-white disabled:opacity-40 transition"
          >
            Redo
          </button>
          <button
            onClick={() => textareaRef.current?.focus()}
            className="hover:text-white flex items-center gap-1 transition"
          >
            <Keyboard className="w-3.5 h-3.5" />
            <span>Keyboard</span>
          </button>
        </div>

        <button
          onClick={() => {}}
          className="text-slate-500 hover:text-slate-300 p-1"
          title="Dismiss Bar"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Quick Snippets & Code Completion Chips Bar */}
      <div className="bg-slate-950 border-t border-slate-800/80 px-2 py-1.5 overflow-x-auto flex items-center gap-1.5 no-scrollbar">
        <span className="text-[10px] text-slate-500 font-mono pl-1 pr-0.5">Quick:</span>
        {COMMON_SNIPPETS.map((snip, idx) => (
          <button
            key={idx}
            onClick={() => insertSnippet(snip.insert)}
            className="shrink-0 bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-200 font-mono text-xs px-2.5 py-1 rounded-md border border-slate-700/80 transition shadow-sm"
          >
            {snip.label}
          </button>
        ))}
      </div>
    </div>
  );
};
