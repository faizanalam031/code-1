import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bug, Gauge, ShieldCheck, ThumbsUp, Languages, TestTube2 } from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="container py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight font-headline">Agent Dashboard</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Welcome to your AI Code Review & Rewrite Agent. Here's how to get started.
        </p>
      </div>
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        <Card className="hover:border-primary transition-colors">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ThumbsUp className="text-primary" />
              Core Analysis Features
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li><span className="font-semibold text-foreground flex items-center gap-2"><Bug size={16} className="text-destructive"/>Bug Detection:</span> Identifies syntax and logic errors.</li>
              <li><span className="font-semibold text-foreground flex items-center gap-2"><Gauge size={16} className="text-blue-500"/>Performance Optimization:</span> Finds bottlenecks and suggests improvements.</li>
              <li><span className="font-semibold text-foreground flex items-center gap-2"><ShieldCheck size={16} className="text-green-500"/>Security Checks:</span> Scans for common vulnerabilities.</li>
              <li><span className="font-semibold text-foreground flex items-center gap-2"><ThumbsUp size={16} className="text-yellow-500"/>Best Practices:</span> Ensures code meets modern standards.</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="hover:border-primary transition-colors">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TestTube2 className="text-primary" />
              How It Works
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold">1</div>
              <div>
                <h3 className="font-semibold">Paste Your Code</h3>
                <p className="text-muted-foreground text-sm">Select your language and paste your code into the editor.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold">2</div>
              <div>
                <h3 className="font-semibold">Analyze</h3>
                <p className="text-muted-foreground text-sm">Click the "Analyze Code" button to let our AI process your submission.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold">3</div>
              <div>
                <h3 className="font-semibold">Get Results</h3>
                <p className="text-muted-foreground text-sm">Review the full analysis and use the rewritten code.</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:border-primary transition-colors">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Languages className="text-primary" />
              Supported Languages
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-muted-foreground">We support a growing list of popular programming languages, including:</p>
            <div className="flex flex-wrap gap-2">
                {["Python", "JavaScript", "TypeScript", "Java", "C++", "HTML", "CSS"].map(lang => (
                    <div key={lang} className="bg-secondary text-secondary-foreground rounded-md px-3 py-1 text-sm font-medium">{lang}</div>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
