
import React, { useState } from 'react';
import { Wand2, Bug, Share2, RefreshCw, Trash, Lightbulb, Terminal } from 'lucide-react';
import { toast } from '@/components/ui/sonner';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CodeEditor from '@/components/CodeEditor';
import FeatureButton from '@/components/FeatureButton';
import { usePythonHelper } from '@/hooks/usePythonHelper';

const Index = () => {
  const [code, setCode] = useState<string>('');
  const [output, setOutput] = useState<string>('');
  const [prompt, setPrompt] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [activeTab, setActiveTab] = useState<string>('generate');
  const { isGenerating, isFixing, generateCode, fixCode } = usePythonHelper();

  const handleGenerateCode = async () => {
    if (!prompt.trim()) {
      toast.error("Please describe what code to generate");
      return;
    }
    
    const result = await generateCode(prompt);
    if (result.code) {
      setCode(result.code);
      setOutput(result.output || '');
      toast.success("Code generated successfully!");
    }
  };

  const handleFixCode = async () => {
    if (!code.trim()) {
      toast.error("Please provide code to fix");
      return;
    }
    
    const result = await fixCode(code, error);
    if (result.code && result.code !== code) {
      setCode(result.code);
      setOutput(result.output || '');
      toast.success("Code fixed successfully!");
    } else if (result.code === code) {
      setOutput(result.output || '');
      toast.info("No changes were made to your code");
    }
  };

  const handleClear = () => {
    if (activeTab === 'generate') {
      setPrompt('');
      setCode('');
      setOutput('');
    } else {
      setCode('');
      setError('');
      setOutput('');
    }
    toast.info("Cleared all content");
  };

  const handleCopy = () => {
    if (code) {
      navigator.clipboard.writeText(code);
      toast.success("Code copied to clipboard");
    } else {
      toast.error("No code to copy");
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-1 container py-8 px-4">
        <h2 className="text-2xl font-bold mb-6">Fix Your Code</h2>
        
        <Tabs defaultValue="generate" onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-2 mb-6">
            <TabsTrigger value="generate">Generate Code</TabsTrigger>
            <TabsTrigger value="fix">Fix Code</TabsTrigger>
          </TabsList>
          
          <TabsContent value="generate" className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="prompt" className="block text-sm font-medium">
                Describe the code you need:
              </label>
              <Textarea
                id="prompt"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="E.g., 'Create a function to calculate the fibonacci sequence' or 'Write a bubble sort algorithm'"
                className="h-32 text-foreground"
              />
            </div>
            
            <div className="flex flex-wrap gap-2">
              <FeatureButton
                icon={Wand2}
                label="Generate Code"
                onClick={handleGenerateCode}
                isLoading={isGenerating}
              />
              <FeatureButton
                icon={Lightbulb}
                label="Example Prompts"
                onClick={() => {
                  const examples = [
                    "Create a hello world program",
                    "Generate a fibonacci sequence function",
                    "Create a bubble sort algorithm"
                  ];
                  setPrompt(examples[Math.floor(Math.random() * examples.length)]);
                }}
                variant="outline"
              />
              <FeatureButton
                icon={Trash}
                label="Clear"
                onClick={handleClear}
                variant="outline"
              />
            </div>
          </TabsContent>
          
          <TabsContent value="fix" className="space-y-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium">
                Python code to fix:
              </label>
              
              <div className="mt-4">
                <label htmlFor="error" className="block text-sm font-medium mb-1">
                  Error message (optional):
                </label>
                <Textarea
                  id="error"
                  value={error}
                  onChange={(e) => setError(e.target.value)}
                  placeholder="Paste any error messages here to help fix the code"
                  className="h-20 text-foreground"
                />
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2">
              <FeatureButton
                icon={Bug}
                label="Fix Code"
                onClick={handleFixCode}
                isLoading={isFixing}
              />
              <FeatureButton
                icon={RefreshCw}
                label="Example Bug"
                onClick={() => {
                  const examples = [
                    // Missing colon after function definition
                    `def hello_world()
    print("Hello, World!")
                    
hello_world()`,
                    // Missing parentheses in print (Python 3)
                    `def add(a, b):
    result = a + b
    print "The sum is", result
                    
add(5, 3)`,
                    // Indentation error
                    `def calculate_factorial(n):
    if n == 0 or n == 1:
        return 1
    else:
        return n * calculate_factorial(n-1)
result = calculate_factorial(5)
print(result)`
                  ];
                  setCode(examples[Math.floor(Math.random() * examples.length)]);
                  setError("SyntaxError: invalid syntax");
                }}
                variant="outline"
              />
              <FeatureButton
                icon={Trash}
                label="Clear"
                onClick={handleClear}
                variant="outline"
              />
            </div>
          </TabsContent>
        </Tabs>
        
        {/* Code Editor Section */}
        <div className="mt-6">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-medium">{activeTab === 'generate' ? 'Generated Code:' : 'Python Code:'}</h3>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 px-2"
              onClick={handleCopy}
              disabled={!code}
            >
              <Share2 className="h-4 w-4 mr-1" />
              Copy
            </Button>
          </div>
          
          <Card className="p-0 overflow-hidden">
            <CodeEditor
              code={code}
              onChange={setCode}
              className="min-h-[300px] max-h-[500px] overflow-y-auto"
              placeholder={activeTab === 'generate' ? "Generated code will appear here..." : "Paste Python code to fix here..."}
            />
          </Card>
        </div>

        {/* Output Section */}
        {output && (
          <div className="mt-6">
            <div className="flex items-center mb-2">
              <Terminal className="h-4 w-4 mr-2" />
              <h3 className="font-medium">Output:</h3>
            </div>
            
            <Card className="p-4 bg-black text-green-400 font-mono text-sm whitespace-pre-wrap overflow-x-auto">
              {output}
            </Card>
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
