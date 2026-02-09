"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { analyzeCodeAndDisplayResults, type AnalyzeCodeOutput } from "@/ai/flows/analyze-code-and-display-results";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle, CheckCircle, Clipboard, Clock, Cpu, FileWarning, Lightbulb, Terminal } from "lucide-react";

const languages = ["python", "javascript", "typescript", "java", "c++", "html", "css"];

const formSchema = z.object({
  language: z.string().min(1, { message: "Please select a language." }),
  code: z.string().min(10, { message: "Please enter at least 10 characters of code." }),
});

type FormValues = z.infer<typeof formSchema>;

export function CodeAnalyzerPage() {
  const [result, setResult] = useState<AnalyzeCodeOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      language: "python",
      code: "",
    },
  });

  const onSubmit = async (data: FormValues) => {
    setIsLoading(true);
    setResult(null);
    try {
      const analysisResult = await analyzeCodeAndDisplayResults(data);
      setResult(analysisResult);
    } catch (e) {
      console.error(e);
      toast({
        variant: "destructive",
        title: "Analysis Failed",
        description: "An unexpected error occurred. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast({
        title: "Copied to clipboard!",
        description: "The fixed code has been copied.",
      });
    }).catch(err => {
      console.error('Failed to copy text: ', err);
       toast({
        variant: "destructive",
        title: "Copy Failed",
        description: "Could not copy text to clipboard.",
      });
    });
  };

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="grid gap-8 md:grid-cols-2">
        {/* Left Column: Code Editor */}
        <div className="space-y-4">
          <h1 className="text-3xl font-bold font-headline">Code Analyzer</h1>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="language"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Language</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a language" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {languages.map((lang) => (
                          <SelectItem key={lang} value={lang} className="capitalize">
                            {lang}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Code</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Paste your code here..."
                        className="h-96 min-h-[300px] font-mono bg-background text-sm leading-relaxed"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? "Analyzing..." : "Analyze Code"}
              </Button>
            </form>
          </Form>
        </div>

        {/* Right Column: Results Panel */}
        <div className="space-y-4">
            <h2 className="text-3xl font-bold font-headline">Analysis Results</h2>
            <div className="border rounded-lg p-4 h-full min-h-[500px] bg-card/50">
                {isLoading && <ResultsSkeleton />}
                {!isLoading && !result && <InitialState />}
                {!isLoading && result && (
                    <div className="space-y-6">
                        {result.status === 'correct' && (
                             <Alert className="bg-green-500/10 border-green-500/30">
                                <CheckCircle className="h-4 w-4 text-green-500" />
                                <AlertTitle className="text-green-500">Code is Correct!</AlertTitle>
                                <AlertDescription>
                                No errors were found in your code.
                                </AlertDescription>
                            </Alert>
                        )}
                        {result.status === 'fixed' && result.errors.length > 0 && (
                             <Alert variant="destructive">
                                <FileWarning className="h-4 w-4" />
                                <AlertTitle>Errors Detected</AlertTitle>
                                <AlertDescription>
                                    <ul className="list-disc pl-5 mt-2">
                                        {result.errors.map((error, index) => (
                                            <li key={index}>{error}</li>
                                        ))}
                                    </ul>
                                </AlertDescription>
                            </Alert>
                        )}

                        {result.status === 'fixed' && result.fixedCode && (
                            <div>
                                <div className="flex justify-between items-center mb-2">
                                    <h3 className="text-lg font-semibold flex items-center gap-2"><Lightbulb className="text-accent" /> Fixed Code</h3>
                                    <Button variant="ghost" size="icon" onClick={() => handleCopy(result.fixedCode || '')}>
                                        <Clipboard className="h-4 w-4" />
                                    </Button>
                                </div>
                                <Textarea
                                readOnly
                                value={result.fixedCode}
                                className="h-64 font-mono bg-background/70"
                                />
                           </div>
                        )}
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <Card className="bg-accent/20">
                                <CardHeader>
                                <CardTitle className="text-lg flex items-center gap-2"><Clock className="text-accent-foreground/80"/> Time Complexity</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-2xl font-bold font-mono text-accent-foreground">{result.timeComplexity}</p>
                                </CardContent>
                            </Card>
                             <Card className="bg-accent/20">
                                <CardHeader>
                                <CardTitle className="text-lg flex items-center gap-2"><Cpu className="text-accent-foreground/80"/> Space Complexity</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-2xl font-bold font-mono text-accent-foreground">{result.spaceComplexity}</p>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                )}
            </div>
        </div>
      </div>
    </div>
  );
}

const ResultsSkeleton = () => (
    <div className="space-y-6 animate-pulse">
        <Skeleton className="h-12 w-full" />
        <div className="space-y-2">
            <Skeleton className="h-8 w-1/3" />
            <Skeleton className="h-64 w-full" />
        </div>
        <div className="grid grid-cols-2 gap-4">
            <Skeleton className="h-28 w-full" />
            <Skeleton className="h-28 w-full" />
        </div>
    </div>
)

const InitialState = () => (
    <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
        <Terminal className="h-16 w-16 mb-4"/>
        <h3 className="text-lg font-semibold text-foreground">Awaiting Analysis</h3>
        <p>Your code analysis results will appear here.</p>
    </div>
)
