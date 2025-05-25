
import React, { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

interface CodeEditorProps {
  code: string;
  onChange: (value: string) => void;
  className?: string;
  placeholder?: string;
  readOnly?: boolean;
}

interface Token {
  type: 'keyword' | 'string' | 'comment' | 'number' | 'function' | 'class' | 'operator' | 'text';
  value: string;
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

  // Tokenize a line of code into syntax elements
  const tokenizeLine = (line: string): Token[] => {
    const tokens: Token[] = [];
    let remaining = line;
    let position = 0;

    const patterns = [
      // Comments (must come first to avoid interfering with other patterns)
      { type: 'comment' as const, regex: /#.*$/ },
      // Keywords
      { type: 'keyword' as const, regex: /\b(def|class|import|from|as|return|if|else|elif|for|while|try|except|finally|with|in|is|not|and|or|True|False|None|void|int|bool|using|namespace|std|include|const|auto|template|typename|public|private|protected)\b/ },
      // Strings (double quotes)
      { type: 'string' as const, regex: /"([^"\\]|\\.)*"/ },
      // Strings (single quotes)
      { type: 'string' as const, regex: /'([^'\\]|\\.)*'/ },
      // Numbers
      { type: 'number' as const, regex: /\b\d+(\.\d+)?\b/ },
      // Function calls
      { type: 'function' as const, regex: /\b([a-zA-Z_][a-zA-Z0-9_]*)\s*(?=\()/ },
      // Class names (after class/struct keywords)
      { type: 'class' as const, regex: /\b(class|struct)\s+([a-zA-Z_][a-zA-Z0-9_]*)/g },
      // Operators
      { type: 'operator' as const, regex: /[+\-*/%=<>!&|^~]|<<|>>|<=|>=|==|!=|&&|\|\|| / }
    ];

    while (remaining.length > 0) {
      let matched = false;
      
      for (const pattern of patterns) {
        const match = remaining.match(pattern.regex);
        if (match && match.index === 0) {
          // Handle special case for class names
          if (pattern.type === 'class' && match[2]) {
            // Add the keyword first
            tokens.push({ type: 'keyword', value: match[1] });
            // Add whitespace
            const whitespace = match[0].substring(match[1].length, match[0].length - match[2].length);
            if (whitespace) {
              tokens.push({ type: 'text', value: whitespace });
            }
            // Add the class name
            tokens.push({ type: 'class', value: match[2] });
          } else {
            tokens.push({ type: pattern.type, value: match[0] });
          }
          
          remaining = remaining.substring(match[0].length);
          position += match[0].length;
          matched = true;
          break;
        }
      }
      
      if (!matched) {
        // Add single character as text
        tokens.push({ type: 'text', value: remaining[0] });
        remaining = remaining.substring(1);
        position += 1;
      }
    }

    return tokens;
  };

  // Get CSS class for token type
  const getClassForToken = (type: Token['type']): string => {
    switch (type) {
      case 'keyword':
        return 'text-blue-400 font-semibold';
      case 'string':
        return 'text-green-400';
      case 'comment':
        return 'text-gray-500 italic';
      case 'number':
        return 'text-orange-400';
      case 'function':
        return 'text-yellow-400';
      case 'class':
        return 'text-cyan-400 font-semibold';
      case 'operator':
        return 'text-purple-400';
      default:
        return 'text-gray-300';
    }
  };

  // Render a line with syntax highlighting
  const renderLine = (line: string, lineIndex: number) => {
    if (!line) {
      return <span>&nbsp;</span>;
    }
    
    const tokens = tokenizeLine(line);
    return (
      <span>
        {tokens.map((token, tokenIndex) => (
          <span 
            key={`${lineIndex}-${tokenIndex}`} 
            className={getClassForToken(token.type)}
          >
            {token.value}
          </span>
        ))}
      </span>
    );
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
              >
                {renderLine(line, index)}
              </div>
            ))}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default CodeEditor;
