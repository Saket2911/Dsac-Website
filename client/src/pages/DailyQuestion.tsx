import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, Flame, AlertCircle, Lightbulb, ExternalLink, ArrowRight } from "lucide-react";

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
          <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-border/50 card-shadow">
            <Clock className="w-4 h-4 text-primary" />
            <span className="font-mono text-sm font-semibold">14:23:05 left</span>
          </div>
          <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-border/50 card-shadow">
            <Flame className="w-4 h-4 text-orange-500 fill-orange-500" />
            <span className="font-bold text-sm">14</span>
          </div>
        </div>
      </div>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6">
        {/* Main content - Problem description */}
        <div className="space-y-6 order-2 lg:order-1">
          <Card className="border-border/30 card-shadow rounded-2xl bg-white">
            <CardHeader className="pb-4">
              <div className="flex flex-wrap items-center gap-3">
                <CardTitle className="text-2xl font-bold">Maximum Subarray Sum</CardTitle>
                <Badge className="bg-amber-50 text-amber-700 hover:bg-amber-50 border-amber-200 shadow-none rounded-lg">Medium</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6 text-foreground/90">
              <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none">
                <p>
                  Given an integer array <code className="bg-muted/60 px-1.5 py-0.5 rounded text-sm">nums</code>, find the subarray with the largest sum, and return <em>its sum</em>.
                </p>

                <h4 className="text-lg font-bold mt-6 mb-2">Example 1:</h4>
                <pre className="bg-muted/30 p-4 rounded-xl border border-border/30 text-sm font-mono overflow-x-auto">
                  <span className="text-muted-foreground">Input:</span> nums = [-2,1,-3,4,-1,2,1,-5,4]
                  <span className="text-muted-foreground">Output:</span> 6
                  <span className="text-muted-foreground">Explanation:</span> The subarray [4,-1,2,1] has the largest sum 6.
                </pre>

                <h4 className="text-lg font-bold mt-6 mb-2">Example 2:</h4>
                <pre className="bg-muted/30 p-4 rounded-xl border border-border/30 text-sm font-mono overflow-x-auto">
                  <span className="text-muted-foreground">Input:</span> nums = [1]
                  <span className="text-muted-foreground">Output:</span> 1
                  <span className="text-muted-foreground">Explanation:</span> The subarray [1] has the largest sum 1.
                </pre>

                <h4 className="text-lg font-bold mt-6 mb-2">Constraints:</h4>
                <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                  <li><code className="bg-muted/60 px-1 rounded text-xs">1 &lt;= nums.length &lt;= 10<sup>5</sup></code></li>
                  <li><code className="bg-muted/60 px-1 rounded text-xs">-10<sup>4</sup> &lt;= nums[i] &lt;= 10<sup>4</sup></code></li>
                </ul>
              </div>

              {/* Solve button */}
              <div className="border-t border-border/30 pt-5 flex flex-col sm:flex-row justify-between items-center gap-4">
                <p className="text-sm text-muted-foreground">
                  Solve this problem on our partnered coding platform to earn your daily XP.
                </p>
                <Button className="gradient-blue text-white gap-2 rounded-xl px-6 shrink-0 shadow-sm hover:shadow-md transition-all">
                  <ExternalLink className="w-4 h-4" /> Solve on Platform
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar - sticky on desktop */}
        <div className="order-1 lg:order-2 lg:sticky lg:top-24 lg:self-start space-y-5">
          {/* Problem Info */}
          <Card className="border-border/30 card-shadow rounded-2xl bg-white">
            <CardHeader className="pb-3 border-b border-border/20">
              <CardTitle className="text-base font-bold">Problem Info</CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Difficulty</span>
                <Badge className="bg-amber-50 text-amber-700 hover:bg-amber-50 border-amber-200 shadow-none text-xs rounded-lg">Medium</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Reward</span>
                <span className="font-bold text-primary text-sm bg-primary/10 px-2 py-0.5 rounded-lg">+50 XP</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Topic</span>
                <Badge variant="outline" className="text-xs rounded-lg">Dynamic Programming</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Success Rate</span>
                <span className="text-sm font-semibold">68.4%</span>
              </div>
            </CardContent>
          </Card>

          {/* Approach & Hints */}
          <Card className="border-border/30 card-shadow rounded-2xl bg-white">
            <CardHeader className="pb-3 border-b border-border/20">
              <CardTitle className="text-base font-bold">Approach & Hints</CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-3">
              <div className="flex items-start gap-2.5 bg-primary/5 border border-primary/15 rounded-xl p-3">
                <Lightbulb className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-foreground text-xs mb-0.5">Hint 1: Brute Force</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">Try exploring all possible subarrays and computing each sum. O(n²) complexity.</p>
                </div>
              </div>
              <div className="flex items-start gap-2.5 bg-primary/5 border border-primary/15 rounded-xl p-3">
                <Lightbulb className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-foreground text-xs mb-0.5">Hint 2: Kadane's Algorithm</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">Maintain a running sum. If it drops below zero, reset it. O(n) solution.</p>
                </div>
              </div>

              <div className="pt-2">
                <h4 className="text-xs font-bold text-foreground mb-2">Related Topics</h4>
                <div className="flex flex-wrap gap-1.5">
                  <Badge variant="outline" className="rounded-lg text-[10px] px-2 py-0.5">Arrays</Badge>
                  <Badge variant="outline" className="rounded-lg text-[10px] px-2 py-0.5">Dynamic Programming</Badge>
                  <Badge variant="outline" className="rounded-lg text-[10px] px-2 py-0.5">Divide & Conquer</Badge>
                  <Badge variant="outline" className="rounded-lg text-[10px] px-2 py-0.5">Greedy</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Streak Info */}
          <Card className="border-border/30 card-shadow rounded-2xl bg-white">
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
