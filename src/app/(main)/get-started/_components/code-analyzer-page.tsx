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
import { Bug, Clipboard, Clock, Cpu, Gauge, Shield, ThumbsUp, Terminal, Bot } from "lucide-react";

const languages = ["python", "javascript", "typescript", "java", "c++", "html", "css", "go", "rust", "csharp"];

const formSchema = z.object({
  language: z.string().min(1, { message: "Please select a language." }),
  code: z.string().min(10, { message: "Please enter at least 10 characters of code." }),
});

type FormValues = z.infer<typeof formSchema>;

const AnalysisSection = ({ title, icon, data }: { title: string; icon: React.ReactNode; data: string[] | undefined }) => {
  if (!data || data.length === 0) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          {icon}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="list-disc space-y-2 pl-5 text-sm text-muted-foreground">
          {data.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};


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
    } catch (e: any) {
      console.error(e);
      let title = "Analysis Failed";
      let description = e.message || "An unexpected error occurred. Please try again.";

      if (e.message && (e.message.includes('429') || e.message.includes('Quota exceeded'))) {
        title = "Rate Limit Exceeded";
        description = "You've made too many requests in a short period. Please wait for a minute and try again. This is a temporary restriction of the free plan.";
      }
      
      toast({
        variant: "destructive",
        title: title,
        description: description,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast({
        title: "Copied to clipboard!",
        description: "The rewritten code has been copied.",
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

  const hasIssues = result && (result.bugs.length > 0 || result.performanceOptimizations.length > 0 || result.securityVulnerabilities.length > 0 || result.bestPractices.length > 0)

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="grid gap-12 md:grid-cols-2">
        {/* Left Column: Code Editor */}
        <div className="space-y-4">
          <h1 className="text-3xl font-bold font-headline flex items-center gap-2"><Bot /> AI Code Review & Rewrite Agent</h1>
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
                      
                        <div className="space-y-4">
                          <AnalysisSection title="Bugs Detected" icon={<Bug className="text-destructive" />} data={result.bugs} />
                          <AnalysisSection title="Performance Optimizations" icon={<Gauge className="text-blue-500" />} data={result.performanceOptimizations} />
                          <AnalysisSection title="Security Vulnerabilities" icon={<Shield className="text-green-500" />} data={result.securityVulnerabilities} />
                          <AnalysisSection title="Best Practices" icon={<ThumbsUp className="text-yellow-500" />} data={result.bestPractices} />
                        </div>
                        
                        {result.rewrittenCode && (
                            <div>
                                <div className="flex justify-between items-center mb-2">
                                    <h3 className="text-lg font-semibold flex items-center gap-2">Rewritten Code</h3>
                                    <Button variant="ghost" size="icon" onClick={() => handleCopy(result.rewrittenCode || '')}>
                                        <Clipboard className="h-4 w-4" />
                                    </Button>
                                </div>
                                <Textarea
                                readOnly
                                value={result.rewrittenCode}
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

                         {!hasIssues && (
                            <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground p-8">
                                <ThumbsUp className="h-16 w-16 mb-4 text-green-500"/>
                                <h3 className="text-lg font-semibold text-foreground">Excellent Code!</h3>
                                <p>Our AI agent found no issues. The rewritten code is the same as the original.</p>
                            </div>
                         )}

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
        <div className="space-y-4">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
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
        <p>Your comprehensive code analysis will appear here.</p>
    </div>
)
