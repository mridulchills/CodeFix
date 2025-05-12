
import { useState } from 'react';
import { toast } from '@/components/ui/sonner';

interface UsePythonHelperResult {
  isGenerating: boolean;
  isFixing: boolean;
  generateCode: (prompt: string) => Promise<string>;
  fixCode: (code: string, error?: string) => Promise<string>;
}

// API key would be better handled in a backend service
const API_KEY = 'AIzaSyCQ5umOoZUoOMGRFA9Vp7It8SvFdAqqCcw';

export function usePythonHelper(): UsePythonHelperResult {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isFixing, setIsFixing] = useState(false);

  // Call Gemini API to generate code
  const generateCode = async (prompt: string): Promise<string> => {
    if (!prompt.trim()) {
      toast.error("Please provide a description of what code to generate");
      return "";
    }

    setIsGenerating(true);
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${API_KEY}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  { 
                    text: `Generate Python code for the following request: ${prompt}. 
                    Provide only the code, with no explanations before or after.` 
                  }
                ]
              }
            ],
            generationConfig: {
              temperature: 0.2,
              topK: 40,
              topP: 0.95,
              maxOutputTokens: 8192,
            }
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }

      const data = await response.json();
      
      // Extract code from Gemini response
      if (data.candidates && data.candidates[0]?.content?.parts) {
        const generatedText = data.candidates[0].content.parts[0].text;
        
        // Try to extract just the code if it has markdown code blocks
        const codeBlockMatch = generatedText.match(/```(?:python)?([\s\S]*?)```/);
        if (codeBlockMatch && codeBlockMatch[1]) {
          return codeBlockMatch[1].trim();
        }
        
        return generatedText.trim();
      } else {
        console.error("Unexpected API response format:", data);
        toast.error("Failed to parse AI response");
        return "";
      }
    } catch (error) {
      console.error("Code generation error:", error);
      toast.error("Failed to generate code");
      return "";
    } finally {
      setIsGenerating(false);
    }
  };

  // Call Gemini API to fix code
  const fixCode = async (code: string, error?: string): Promise<string> => {
    if (!code.trim()) {
      toast.error("Please provide code to fix");
      return "";
    }

    setIsFixing(true);
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${API_KEY}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  { 
                    text: `Fix the following Python code:\n\n${code}\n\n${
                      error ? `Error message: ${error}` : "Identify and fix any issues in this code."
                    }\n\nProvide only the corrected code with no explanations before or after.` 
                  }
                ]
              }
            ],
            generationConfig: {
              temperature: 0.1,
              topK: 40,
              topP: 0.95,
              maxOutputTokens: 8192,
            }
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }

      const data = await response.json();
      
      // Extract code from Gemini response
      if (data.candidates && data.candidates[0]?.content?.parts) {
        const fixedText = data.candidates[0].content.parts[0].text;
        
        // Try to extract just the code if it has markdown code blocks
        const codeBlockMatch = fixedText.match(/```(?:python)?([\s\S]*?)```/);
        if (codeBlockMatch && codeBlockMatch[1]) {
          return codeBlockMatch[1].trim();
        }
        
        return fixedText.trim();
      } else {
        console.error("Unexpected API response format:", data);
        toast.error("Failed to parse AI response");
        return code;
      }
    } catch (error) {
      console.error("Code fixing error:", error);
      toast.error("Failed to fix code");
      return code;
    } finally {
      setIsFixing(false);
    }
  };

  return { isGenerating, isFixing, generateCode, fixCode };
}
