import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, Flame, AlertCircle, Lightbulb, ExternalLink } from "lucide-react";

export default function DailyQuestion() {
  return (
    <div className="py-10 animate-in fade-in duration-500 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">Daily Challenge</h1>
          <p className="text-muted-foreground mt-2">Solve this to maintain your streak and earn bonus XP.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-card px-4 py-2 rounded-full border border-border">
            <Clock className="w-4 h-4 text-primary" />
            <span className="font-mono text-sm font-medium">14:23:05 left</span>
          </div>
          <div className="flex items-center gap-2 bg-card px-4 py-2 rounded-full border border-border">
            <Flame className="w-4 h-4 text-orange-500 fill-orange-500" />
            <span className="font-bold text-sm">14</span>
          </div>
        </div>
      </div>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6">
        {/* Main content - Problem description */}
        <div className="space-y-6 order-2 lg:order-1">
          <Card className="border-border/50 shadow-sm">
            <CardHeader className="pb-4">
              <div className="flex flex-wrap items-center gap-3">
                <CardTitle className="text-2xl font-serif">Maximum Subarray Sum</CardTitle>
                <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100 border-none shadow-none">Medium</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6 text-foreground/90">
              <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none">
                <p>
                  Given an integer array <code>nums</code>, find the subarray with the largest sum, and return <em>its sum</em>.
                </p>

                <h4 className="text-lg font-serif font-bold mt-6 mb-2">Example 1:</h4>
                <pre className="bg-muted/50 p-4 rounded-lg border border-border/50 text-sm font-mono overflow-x-auto">
                  <span className="text-muted-foreground">Input:</span> nums = [-2,1,-3,4,-1,2,1,-5,4]
                  <span className="text-muted-foreground">Output:</span> 6
                  <span className="text-muted-foreground">Explanation:</span> The subarray [4,-1,2,1] has the largest sum 6.
                </pre>

                <h4 className="text-lg font-serif font-bold mt-6 mb-2">Example 2:</h4>
                <pre className="bg-muted/50 p-4 rounded-lg border border-border/50 text-sm font-mono overflow-x-auto">
                  <span className="text-muted-foreground">Input:</span> nums = [1]
                  <span className="text-muted-foreground">Output:</span> 1
                  <span className="text-muted-foreground">Explanation:</span> The subarray [1] has the largest sum 1.
                </pre>

                <h4 className="text-lg font-serif font-bold mt-6 mb-2">Constraints:</h4>
                <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                  <li><code>1 &lt;= nums.length &lt;= 10<sup>5</sup></code></li>
                  <li><code>-10<sup>4</sup> &lt;= nums[i] &lt;= 10<sup>4</sup></code></li>
                </ul>
              </div>

              {/* Solve button - prominent position right after problem */}
              <div className="border-t border-border/50 pt-5 flex flex-col sm:flex-row justify-between items-center gap-4">
                <p className="text-sm text-muted-foreground">
                  Solve this problem on our partnered coding platform to earn your daily XP.
                </p>
                <Button className="bg-primary hover:bg-secondary text-primary-foreground gap-2 rounded-full px-6 shrink-0">
                  <ExternalLink className="w-4 h-4" /> Solve on Platform
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar - sticky on desktop */}
        <div className="order-1 lg:order-2 lg:sticky lg:top-24 lg:self-start space-y-5">
          {/* Problem Info */}
          <Card className="border-border/50 shadow-sm">
            <CardHeader className="pb-3 border-b border-border/40">
              <CardTitle className="text-base">Problem Info</CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Difficulty</span>
                <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100 border-none shadow-none text-xs">Medium</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Reward</span>
                <span className="font-bold text-primary text-sm">+50 XP</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Topic</span>
                <Badge variant="outline" className="text-xs">Dynamic Programming</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Success Rate</span>
                <span className="text-sm font-medium">68.4%</span>
              </div>
            </CardContent>
          </Card>

          {/* Approach & Hints */}
          <Card className="border-border/50 shadow-sm">
            <CardHeader className="pb-3 border-b border-border/40">
              <CardTitle className="text-base font-serif">Approach & Hints</CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-3">
              <div className="flex items-start gap-2.5 bg-primary/5 border border-primary/20 rounded-lg p-3">
                <Lightbulb className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-foreground text-xs mb-0.5">Hint 1: Brute Force</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">Try exploring all possible subarrays and computing each sum. O(n²) complexity.</p>
                </div>
              </div>
              <div className="flex items-start gap-2.5 bg-primary/5 border border-primary/20 rounded-lg p-3">
                <Lightbulb className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-foreground text-xs mb-0.5">Hint 2: Kadane's Algorithm</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">Maintain a running sum. If it drops below zero, reset it. O(n) solution.</p>
                </div>
              </div>

              <div className="pt-2">
                <h4 className="text-xs font-bold text-foreground mb-2">Related Topics</h4>
                <div className="flex flex-wrap gap-1.5">
                  <Badge variant="outline" className="rounded-full text-[10px] px-2 py-0.5">Arrays</Badge>
                  <Badge variant="outline" className="rounded-full text-[10px] px-2 py-0.5">Dynamic Programming</Badge>
                  <Badge variant="outline" className="rounded-full text-[10px] px-2 py-0.5">Divide & Conquer</Badge>
                  <Badge variant="outline" className="rounded-full text-[10px] px-2 py-0.5">Greedy</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Streak Info */}
          <Card className="border-border/50 shadow-sm">
            <CardContent className="pt-5 pb-5">
              <div className="flex gap-3">
                <AlertCircle className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Completing daily questions consecutively builds your streak. A 7-day streak grants a <span className="font-semibold text-foreground">1.5x XP multiplier</span>!
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
