import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bug, Gauge, ShieldCheck } from "lucide-react";

const features = [
  {
    icon: <Bug className="h-8 w-8 text-destructive" />,
    title: "Bug & Error Detection",
    description: "Our AI immediately spots syntax errors, logical flaws, and edge cases."
  },
  {
    icon: <Gauge className="h-8 w-8 text-blue-500" />,
    title: "Full-Spectrum Analysis",
    description: "From performance bottlenecks to security vulnerabilities, get a complete picture of your code's health."
  },
  {
    icon: <ShieldCheck className="h-8 w-8 text-green-500" />,
    title: "Automated Code Rewriting",
    description: "Receive optimized, secure, and clean code, rewritten by AI and ready to deploy."
  }
]

export default function HomePage() {
  return (
    <div className="flex flex-col">
      <section className="w-full py-20 md:py-32 lg:py-40">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none font-headline">
                  AI-Powered Code Review and Modernization
                </h1>
                <p className="max-w-[600px] text-muted-foreground md:text-xl">
                  Get instant, comprehensive code reviews. Our AI agent, powered by Llama 3 and Groq, detects bugs, security risks, and performance issues, then rewrites your code to be more efficient and secure.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Button asChild size="lg">
                  <Link href="/get-started">Get Started</Link>
                </Button>
                <Button asChild variant="secondary" size="lg">
                  <Link href="/dashboard">Dashboard</Link>
                </Button>
              </div>
            </div>
            <div className="bg-primary/10 p-6 rounded-lg">
                <div className="bg-background/80 backdrop-blur-sm rounded-lg shadow-lg p-6 font-mono text-sm border">
                    <pre><code><span className="text-blue-400">def</span> <span className="text-purple-400">quick_sort</span>(arr):
    <span className="text-blue-400">if</span> len(arr) &lt;= 1
        <span className="text-red-500">return arr # Error: Missing colon</span>
    pivot = arr[len(arr) // 2]
    left = [x <span className="text-blue-400">for</span> x <span className="text-blue-400">in</span> arr <span className="text-blue-400">if</span> x &lt; pivot]
    middle = [x <span className="text-blue-400">for</span> x <span className="text-blue-400">in</span> arr <span className="text-blue-400">if</span> x == pivot]
    right = [x <span className="text-blue-400">for</span> x <span className="text-blue-400">in</span> arr <span className="text-blue-400">if</span> x &gt; pivot]
    <span className="text-blue-400">return</span> quick_sort(left) + middle + quick_sort(right)
</code></pre>
                </div>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full py-12 md:py-24 lg:py-32 bg-muted/40">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <div className="inline-block rounded-lg bg-secondary px-3 py-1 text-sm">
                Key Features
              </div>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline">
                Intelligent Analysis, Instant Improvements
              </h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Focus on building, not on tedious code reviews. Our intelligent tools help you write better, more secure code, faster than ever before.
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl items-start gap-6 py-12 lg:grid-cols-3 lg:gap-12">
            {features.map((feature, index) => (
              <Card key={index} className="transform transition-transform duration-300 hover:scale-105 hover:shadow-xl">
                <CardHeader className="flex flex-row items-center gap-4">
                  {feature.icon}
                  <CardTitle>{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
