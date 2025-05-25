
import React, { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

interface CodeEditorProps {
  code: string;
  onChange: (value: string) => void;
  className?: string;
  placeholder?: string;
  readOnly?: boolean;
}

const CodeEditor = ({ 
  code, 
  onChange, 
  className, 
  placeholder = "# Write your Python code here...", 
  readOnly = false 
}: CodeEditorProps) => {
  const [lines, setLines] = useState<string[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  // Update line numbers when code changes
  useEffect(() => {
    const codeLines = code ? code.split('\n') : [''];
    setLines(codeLines);
  }, [code]);

  // Escape HTML characters to prevent interpretation as HTML
  const escapeHtml = (text: string): string => {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  };

  // Apply syntax highlighting after escaping HTML
  const highlightSyntax = (line: string) => {
    // First escape HTML characters
    let escapedLine = escapeHtml(line);
    
    // Then apply syntax highlighting with proper CSS classes
    return escapedLine
      .replace(/\b(def|class|import|from|as|return|if|else|elif|for|while|try|except|finally|with|in|is|not|and|or|True|False|None|void|int|bool|using|namespace|std|include)\b/g, '<span class="text-blue-400 font-semibold">$1</span>')
      .replace(/(#.*$)/g, '<span class="text-gray-500 italic">$1</span>')
      .replace(/(&quot;.*?&quot;|&#39;.*?&#39;)/g, '<span class="text-green-400">$1</span>')
      .replace(/\b(\d+)\b/g, '<span class="text-orange-400">$1</span>')
      .replace(/\b([a-zA-Z_][a-zA-Z0-9_]*)\(/g, '<span class="text-yellow-400">$1</span>(')
      .replace(/\b(class|void)\s+([a-zA-Z_][a-zA-Z0-9_]*)/g, '$1 <span class="text-cyan-400 font-semibold">$2</span>');
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
  };

  return (
    <div className={cn("relative border rounded-md bg-gray-900 overflow-hidden", className)}>
      <div className="flex">
        {/* Line numbers */}
        <div className="py-3 px-2 bg-gray-800 text-xs select-none text-gray-400">
          {lines.map((_, index) => (
            <div key={index} className="text-right pr-4 leading-relaxed min-h-[1.5rem]">
              {index + 1}
            </div>
          ))}
        </div>

        {/* Code editor */}
        <div className="relative flex-grow">
          <textarea
            ref={textareaRef}
            value={code}
            onChange={handleChange}
            placeholder={placeholder}
            className="absolute inset-0 p-3 bg-transparent text-transparent caret-white resize-none outline-none font-mono text-sm leading-relaxed w-full z-10"
            spellCheck="false"
            autoCapitalize="off"
            autoCorrect="off"
            autoComplete="off"
            readOnly={readOnly}
          />
          
          {/* Highlighted code display */}
          <pre className="p-3 font-mono text-sm leading-relaxed whitespace-pre-wrap text-gray-300">
            {lines.map((line, index) => (
              <div 
                key={index} 
                className="min-h-[1.5rem]" 
                dangerouslySetInnerHTML={{ __html: line ? highlightSyntax(line) : '&nbsp;' }} 
              />
            ))}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default CodeEditor;
