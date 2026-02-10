/**
 * @fileOverview Local code analysis function that works without external APIs
 * Provides basic code review functionality without requiring Gemini API
 */

import { AnalyzeCodeInput, AnalyzeCodeOutput } from './flows/analyze-code-and-display-results';

function detectBugs(code: string, language: string): string[] {
  const bugs: string[] = [];

  // JavaScript/TypeScript bugs
  if ((language === 'javascript' || language === 'typescript') && code.includes('var ')) {
    bugs.push('Using `var` causes hoisting issues - should use `let` or `const`');
  }

  if ((language === 'javascript' || language === 'typescript') && 
      code.includes('==') && !code.includes('===')) {
    bugs.push('Using loose equality (==) causes type coercion bugs - use strict equality (===) instead');
  }

  // General bugs
  if (code.includes('eval(')) {
    bugs.push('eval() is a critical bug - it\'s a security risk and performance issue');
  }

  // Python bugs
  if ((language === 'python') && code.includes('except:')) {
    bugs.push('Bare except clause is a bug - specify the exception type');
  }

  // Java bugs
  if (language === 'java' && code.match(/System\.out\.println\s*\(\s*\)/)) {
    bugs.push('Empty println() statement detected - remove unnecessary output calls');
  }

  if (language === 'java' && !code.includes('try') && code.includes('throw')) {
    bugs.push('Exception thrown but no catch block to handle it properly');
  }

  // General patterns
  if (code.match(/TODO|FIXME|XXX|BUG|HACK/)) {
    bugs.push('Found TODO/FIXME comments indicating incomplete or problematic code');
  }

  return bugs;
}

function detectPerformanceIssues(code: string, language: string): string[] {
  const issues: string[] = [];

  // Nested loops
  if (code.match(/for[\s\S]*for[\s\S]*for/)) {
    issues.push('Nested loops detected - consider optimizing or using more efficient algorithms');
  }

  if (code.includes('.map(') && code.includes('.filter(') && code.includes('.reduce(')) {
    issues.push('Multiple array iterations - consider combining operations into a single pass');
  }

  if ((code.match(/\+ /g) || []).length > 5 && language === 'python') {
    issues.push('Consider using f-strings instead of string concatenation for better performance');
  }

  if (code.includes('new Array(') && !code.includes('Array.from')) {
    issues.push('Use Array.from() or spread operator instead of new Array()');
  }

  // String concatenation in loops
  if (code.match(/\+\s*=.*\+\s*.*for|for[\s\S]*\+\s*=/)) {
    issues.push('String concatenation in loops is inefficient - use StringBuilder or array join');
  }

  return issues;
}

function detectSecurityIssues(code: string, language: string): string[] {
  const issues: string[] = [];

  if (code.includes('innerHTML')) {
    issues.push('innerHTML can cause XSS vulnerabilities - use textContent or DOM methods instead');
  }

  if (code.includes('eval(')) {
    issues.push('eval() is a critical security risk - avoid at all costs');
  }

  if (code.match(/password\s*=\s*["'][^"']*["']/)) {
    issues.push('Hardcoded credentials detected - use environment variables instead');
  }

  if (code.includes('SQL') || code.includes('sql')) {
    issues.push('Be cautious with SQL queries - use parameterized queries to prevent SQL injection');
  }

  if (code.includes('http://') && !code.includes('https://')) {
    issues.push('Use HTTPS instead of HTTP for secure communication');
  }

  return issues;
}

function detectBestPracticeIssues(code: string, language: string): string[] {
  const issues: string[] = [];

  if ((code.match(/\n\n\n/g) || []).length > 2) {
    issues.push('Reduce excessive blank lines for better code readability');
  }

  const commentCount = (code.match(/\/\//g) || []).length + (code.match(/\/\*/g) || []).length;
  const lines = code.split('\n').length;
  if (commentCount === 0 && lines > 10) {
    issues.push('Add comments to explain complex logic and improve maintainability');
  }

  if (code.includes('console.log(') && language === 'typescript') {
    issues.push('Remove or replace console.log with proper logging framework');
  }

  if ((code.match(/function|const|let|var|def|def |public |private /g) || []).length > 20) {
    issues.push('Consider breaking this code into smaller functions for better modularity');
  }

  if (language === 'typescript' && !code.includes(': ') && !code.includes('any')) {
    issues.push('Add type annotations to improve code clarity and catch errors early');
  }

  return issues;
}

function rewriteCode(code: string, language: string, bugs: string[]): string {
  let rewritten = code;

  // Fix JavaScript/TypeScript issues
  if (bugs.some(bug => bug.includes('var'))) {
    rewritten = rewritten.replace(/\bvar\s+/g, 'let ');
  }

  if (bugs.some(bug => bug.includes('==='))) {
    // Only replace == that are not ===
    rewritten = rewritten.replace(/([^=!<>])===([^=])|^===([^=])/g, '$1==$2$3');
    rewritten = rewritten.replace(/([^=!<>])==([^=])|^==([^=])/g, '$1===$2$3');
  }

  if (bugs.some(bug => bug.includes('eval'))) {
    rewritten = rewritten.replaceAll('eval(', 'Function(');
  }

  // Fix Python issues
  if (bugs.some(bug => bug.includes('except:'))) {
    rewritten = rewritten.replace(/except:/g, 'except Exception:');
  }

  // Fix Java issues
  if (bugs.some(bug => bug.includes('Empty println'))) {
    rewritten = rewritten.replace(/System\.out\.println\s*\(\s*\)/g, '// Removed empty output');
  }

  // Fix security issues
  if (bugs.some(bug => bug.includes('innerHTML'))) {
    rewritten = rewritten.replace(/\.innerHTML\s*=/g, '.textContent =');
  }

  if (bugs.some(bug => bug.includes('http://'))) {
    rewritten = rewritten.replace(/http:\/\//g, 'https://');
  }

  return rewritten;
}

function estimateComplexity(code: string, language: string): { time: string; space: string } {
  let timeComplexity = 'O(1)';
  let spaceComplexity = 'O(1)';

  // Count nested loops
  const forLoops = (code.match(/for[\s\S]*\{|for\s*\(/g) || []).length;
  const whileLoops = (code.match(/while[\s\S]*\{|while\s*\(/g) || []).length;
  const nestLevel = Math.max(forLoops, whileLoops);

  if (nestLevel >= 3) {
    timeComplexity = 'O(n³)';
  } else if (nestLevel === 2) {
    timeComplexity = 'O(n²)';
  } else if (nestLevel === 1) {
    timeComplexity = 'O(n)';
  }

  // Check for recursion and space usage
  if (code.includes('recursive') || code.match(/function\s+\w+\s*\([^)]*\)\s*\{[\s\S]*\1\s*\(/)) {
    spaceComplexity = 'O(n)';
  }

  if (code.includes('array') || code.includes('Array') || code.includes('list') || 
      code.includes('[]') || code.includes('ArrayList') || code.includes('HashMap')) {
    spaceComplexity = spaceComplexity === 'O(1)' ? 'O(n)' : 'O(n²)';
  }

  return { time: timeComplexity, space: spaceComplexity };
}

export async function analyzeCodeLocally(input: AnalyzeCodeInput): Promise<AnalyzeCodeOutput> {
  const { code, language } = input;

  const bugs = detectBugs(code, language);
  const performanceOptimizations = detectPerformanceIssues(code, language);
  const securityVulnerabilities = detectSecurityIssues(code, language);
  const bestPractices = detectBestPracticeIssues(code, language);
  const { time: timeComplexity, space: spaceComplexity } = estimateComplexity(code, language);

  // Determine if code has issues (bugs are most critical)
  const hasIssues = bugs.length > 0 || securityVulnerabilities.length > 0;
  
  // Rewrite code with fixes if there are bugs or security issues
  const rewrittenCode = hasIssues ? rewriteCode(code, language, bugs.concat(securityVulnerabilities)) : code;

  return {
    bugs,
    performanceOptimizations,
    securityVulnerabilities,
    bestPractices,
    rewrittenCode,
    timeComplexity,
    spaceComplexity,
  };
}
