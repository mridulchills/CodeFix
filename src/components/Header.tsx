
import React from 'react';
import { Code } from 'lucide-react';

const Header = () => {
  return (
    <header className="border-b border-border">
      <div className="container flex items-center justify-between h-16 px-4">
        <div className="flex items-center gap-2">
          <Code className="w-6 h-6 text-primary" />
          <h1 className="text-xl font-bold">CodeFix</h1>
        </div>
        <nav>
          <ul className="flex items-center gap-4">
            <li>
              <a 
                href="https://www.python.org/doc/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Python Docs
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
