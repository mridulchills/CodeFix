
import { useState } from 'react';
import { toast } from '@/components/ui/sonner';

interface UsePythonHelperResult {
  isGenerating: boolean;
  isFixing: boolean;
  generateCode: (prompt: string) => Promise<{ code: string; output: string }>;
  fixCode: (code: string, error?: string) => Promise<{ code: string; output: string }>;
}

// Backend API URL - using the deployed backend URL
const BACKEND_API_URL = "https://codefix-backend.onrender.com"; // Updated to the provided backend URL

export function usePythonHelper(): UsePythonHelperResult {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isFixing, setIsFixing] = useState(false);

  // Call backend to generate code
  const generateCode = async (prompt: string): Promise<{ code: string; output: string }> => {
    if (!prompt.trim()) {
      toast.error("Please provide a description of what code to generate");
      return { code: "", output: "" };
    }

    setIsGenerating(true);
    try {
      console.log("Sending request to:", `${BACKEND_API_URL}/api/generate`);
      
      const response = await fetch(`${BACKEND_API_URL}/api/generate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("API Error:", response.status, errorData);
        throw new Error(`Backend request failed: ${errorData.error || response.status}`);
      }

      const data = await response.json() as { code: string; output: string };
      console.log("API response:", data);
      
      if (data.code) {
        return { 
          code: data.code, 
          output: data.output || "" 
        };
      } else {
        console.error("Unexpected API response format:", data);
        toast.error("Failed to parse API response");
        return { code: "", output: "" };
      }
    } catch (error) {
      console.error("Code generation error:", error);
      toast.error(`Failed to generate code: ${error instanceof Error ? error.message : String(error)}`);
      return { code: "", output: "" };
    } finally {
      setIsGenerating(false);
    }
  };

  // Call backend to fix code
  const fixCode = async (code: string, error?: string): Promise<{ code: string; output: string }> => {
    if (!code.trim()) {
      toast.error("Please provide code to fix");
      return { code: "", output: "" };
    }

    setIsFixing(true);
    try {
      console.log("Sending request to:", `${BACKEND_API_URL}/api/fix`);
      
      const response = await fetch(`${BACKEND_API_URL}/api/fix`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code, error }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("API Error:", response.status, errorData);
        throw new Error(`Backend request failed: ${errorData.error || response.status}`);
      }

      const data = await response.json() as { code: string; output: string };
      console.log("API response:", data);
      
      if (data.code) {
        return { 
          code: data.code, 
          output: data.output || ""  
        };
      } else {
        console.error("Unexpected API response format:", data);
        toast.error("Failed to parse API response");
        return { code, output: "" };
      }
    } catch (error) {
      console.error("Code fixing error:", error);
      toast.error(`Failed to fix code: ${error instanceof Error ? error.message : String(error)}`);
      return { code, output: "" };
    } finally {
      setIsFixing(false);
    }
  };

  return { isGenerating, isFixing, generateCode, fixCode };
}
