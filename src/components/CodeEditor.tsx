
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

  // Simple syntax highlighting (basic implementation)
  const highlightSyntax = (line: string) => {
    // This is a simplified version - a real implementation would use proper tokenization
    return line
      .replace(/\b(def|class|import|from|as|return|if|else|elif|for|while|try|except|finally|with|in|is|not|and|or|True|False|None)\b/g, '<span class="python-keyword">$1</span>')
      .replace(/(#.*)$/g, '<span class="python-comment">$1</span>')
      .replace(/(".*?"|'.*?')/g, '<span class="python-string">$1</span>')
      .replace(/\b(\d+)\b/g, '<span class="python-number">$1</span>')
      .replace(/\b([a-zA-Z_][a-zA-Z0-9_]*)\(/g, '<span class="python-function">$1</span>(')
      .replace(/\bclass\s+([a-zA-Z_][a-zA-Z0-9_]*)/g, 'class <span class="python-class">$1</span>');
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
  };

  return (
    <div className={cn("relative border rounded-md bg-editor-bg overflow-hidden", className)}>
      <div className="flex">
        {/* Line numbers */}
        <div className="py-3 px-2 bg-muted/30 text-xs select-none">
          {lines.map((_, index) => (
            <div key={index} className="editor-line-number">
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
          <pre className="p-3 font-mono text-sm leading-relaxed whitespace-pre-wrap">
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
