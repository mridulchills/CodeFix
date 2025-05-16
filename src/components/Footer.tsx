
import React from 'react';

const Footer = () => {
  return (
    <footer className="border-t border-border py-6">
      <div className="container flex flex-col items-center justify-center gap-2 text-center px-4">
        <p className="text-sm text-muted-foreground">
          CodeFix - AI-powered Python code generation and bug fixing
        </p>
        <p className="text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} CodeFix. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
