import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, Flame, Lightbulb, ExternalLink, CheckCircle, Loader2, AlertCircle, Trophy, Sparkles } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

interface DailyQuestionData {
  id: string;
  questionId: string;
  title: string;
  platform: string;
  difficulty: string;
  description: string;
  hints: string[];
  xpReward: number;
  topicTags: string[];
  solvedCount: number;
  date: string;
  platformUrl: string;
}

export default function DailyQuestion() {
  const { user, token, updateUser } = useAuth();
  const [question, setQuestion] = useState<DailyQuestionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [solvedState, setSolvedState] = useState<"unsolved" | "checking" | "solved" | "already_solved">("unsolved");
  const [xpAwarded, setXpAwarded] = useState(0);
  const [countdown, setCountdown] = useState("");

  // Fetch today's question
  useEffect(() => {
    fetch("/api/daily-question")
      .then((res) => res.json())
      .then((data) => {
        if (data.question) {
          setQuestion(data.question);
        } else {
          setError(data.message || "No daily question available");
        }
      })
      .catch(() => setError("Failed to load daily question"))
      .finally(() => setLoading(false));
  }, []);

  // Auto-check if user already solved when question loads
  useEffect(() => {
    if (question && token) {
      fetch("/api/daily-question/check-solved", {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.solved) {
            if (data.alreadyAwarded) {
              setSolvedState("already_solved");
            } else {
              setSolvedState("solved");
              setXpAwarded(data.xpAwarded || 0);
              // Update user context with new XP
              if (data.newXp !== undefined && user) {
                updateUser({ ...user, xp: data.newXp, level: data.newLevel });
              }
            }
          }
        })
        .catch(() => { });
    }
  }, [question, token]);

  // Countdown timer to midnight
  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const midnight = new Date(now);
      midnight.setHours(24, 0, 0, 0);
      const diff = midnight.getTime() - now.getTime();
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      setCountdown(
        `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
      );
    };
    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  // Manual check solution
  const handleCheckSolution = useCallback(async () => {
    if (!token || !question) return;
    setSolvedState("checking");

    try {
      // First try the check-solved endpoint (auto-awards XP)
      const res = await fetch("/api/daily-question/check-solved", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();

      if (data.solved) {
        setSolvedState("solved");
        setXpAwarded(data.xpAwarded || question.xpReward);
        if (data.newXp !== undefined && user) {
          updateUser({ ...user, xp: data.newXp, level: data.newLevel });
        }
      } else {
        setSolvedState("unsolved");
      }
    } catch {
      setSolvedState("unsolved");
    }
  }, [token, question, user, updateUser]);

  const diffBadgeClass = (diff: string) => {
    switch (diff) {
      case "Easy": return "bg-emerald-100 text-emerald-800 hover:bg-emerald-100";
      case "Medium": return "bg-amber-100 text-amber-800 hover:bg-amber-100";
      case "Hard": return "bg-red-100 text-red-800 hover:bg-red-100";
      default: return "";
    }
  };

  if (loading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center gap-4 animate-in fade-in">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
        <p className="text-muted-foreground">Loading today's challenge...</p>
      </div>
    );
  }

  if (error || !question) {
    return (
      <div className="py-20 flex flex-col items-center justify-center gap-4 animate-in fade-in">
        <AlertCircle className="w-12 h-12 text-muted-foreground/30" />
        <h2 className="text-xl font-semibold text-foreground">No Daily Question</h2>
        <p className="text-muted-foreground max-w-md text-center">
          {error || "Couldn't load today's question. Please try again later."}
        </p>
        <Button onClick={() => window.location.reload()} variant="outline">
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="py-10 animate-in fade-in duration-500 max-w-5xl mx-auto">
      {/* Success celebration banner */}
      {(solvedState === "solved" || solvedState === "already_solved") && (
        <div className="mb-8 p-6 bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-200 rounded-2xl flex items-center gap-4 animate-in slide-in-from-top-4 duration-500">
          <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
            <Trophy className="w-7 h-7 text-emerald-600" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-emerald-900 text-lg flex items-center gap-2">
              {solvedState === "solved" ? (
                <>
                  <Sparkles className="w-5 h-5 text-emerald-500" /> Problem Solved!
                </>
              ) : (
                <>
                  <CheckCircle className="w-5 h-5 text-emerald-500" /> Already Completed
                </>
              )}
            </h3>
            <p className="text-emerald-700 text-sm mt-0.5">
              {solvedState === "solved"
                ? `You earned +${xpAwarded} XP for solving today's daily question!`
                : "You've already solved today's question. Come back tomorrow for a new challenge!"}
            </p>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">Daily Challenge</h1>
          <p className="text-muted-foreground mt-2">Solve this to earn XP and climb the leaderboard.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-card px-4 py-2 rounded-full border border-border">
            <Clock className="w-4 h-4 text-primary" />
            <span className="font-mono text-sm font-medium">{countdown} left</span>
          </div>
          <div className="flex items-center gap-2 bg-card px-4 py-2 rounded-full border border-border">
            <Flame className="w-4 h-4 text-orange-500 fill-orange-500" />
            <span className="font-bold text-sm">{question.solvedCount} solved</span>
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
                <CardTitle className="text-2xl font-serif">{question.title}</CardTitle>
                <Badge className={`${diffBadgeClass(question.difficulty)} border-none shadow-none`}>
                  {question.difficulty}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6 text-foreground/90">
              {/* Problem description (HTML from LeetCode) */}
              <div
                className="prose prose-sm md:prose-base dark:prose-invert max-w-none 
                                           [&_pre]:bg-muted/50 [&_pre]:p-4 [&_pre]:rounded-lg [&_pre]:border [&_pre]:border-border/50 [&_pre]:text-sm [&_pre]:font-mono [&_pre]:overflow-x-auto
                                           [&_code]:bg-muted/40 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-sm
                                           [&_img]:max-w-full [&_img]:rounded-lg
                                           [&_table]:border-collapse [&_table]:w-full [&_th]:border [&_th]:border-border [&_th]:px-3 [&_th]:py-2 [&_th]:bg-muted/30
                                           [&_td]:border [&_td]:border-border [&_td]:px-3 [&_td]:py-2"
                dangerouslySetInnerHTML={{ __html: question.description }}
              />

              {/* Solve button */}
              <div className="border-t border-border/50 pt-5 flex flex-col sm:flex-row justify-between items-center gap-4">
                {solvedState === "solved" || solvedState === "already_solved" ? (
                  <p className="text-sm text-emerald-600 font-medium flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" /> Completed — Great work!
                  </p>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Solve this problem on the platform. Come back and click "Check Solution" to earn XP.
                  </p>
                )}
                <div className="flex gap-3 shrink-0">
                  {solvedState !== "solved" && solvedState !== "already_solved" && (
                    <Button
                      variant="outline"
                      className="gap-2 rounded-full"
                      onClick={handleCheckSolution}
                      disabled={solvedState === "checking" || !token}
                    >
                      {solvedState === "checking" ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <CheckCircle className="w-4 h-4" />
                      )}
                      Check Solution
                    </Button>
                  )}
                  <Button
                    className="bg-primary hover:bg-secondary text-primary-foreground gap-2 rounded-full px-6"
                    onClick={() => window.open(question.platformUrl, "_blank")}
                  >
                    <ExternalLink className="w-4 h-4" /> Solve on {question.platform === "codeforces" ? "Codeforces" : question.platform === "codechef" ? "CodeChef" : question.platform === "hackerrank" ? "HackerRank" : "LeetCode"}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="order-1 lg:order-2 lg:sticky lg:top-24 lg:self-start space-y-5">
          {/* Problem Info */}
          <Card className="border-border/50 shadow-sm">
            <CardHeader className="pb-3 border-b border-border/40">
              <CardTitle className="text-base">Problem Info</CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Difficulty</span>
                <Badge className={`${diffBadgeClass(question.difficulty)} border-none shadow-none text-xs`}>
                  {question.difficulty}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Reward</span>
                <span className="font-bold text-primary text-sm">+{question.xpReward} XP</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Platform</span>
                <Badge variant="outline" className="text-xs capitalize">{question.platform}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Solved Today</span>
                <span className="text-sm font-medium">{question.solvedCount}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Status</span>
                {solvedState === "solved" || solvedState === "already_solved" ? (
                  <Badge className="bg-emerald-100 text-emerald-700 border-none text-xs">Solved ✓</Badge>
                ) : (
                  <Badge variant="outline" className="text-xs text-muted-foreground">Unsolved</Badge>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Hints */}
          {question.hints.length > 0 && (
            <Card className="border-border/50 shadow-sm">
              <CardHeader className="pb-3 border-b border-border/40">
                <CardTitle className="text-base font-serif">Hints</CardTitle>
              </CardHeader>
              <CardContent className="pt-4 space-y-3">
                {question.hints.map((hint, i) => (
                  <details key={i} className="group">
                    <summary className="flex items-center gap-2.5 cursor-pointer select-none bg-primary/5 border border-primary/20 rounded-lg p-3 hover:bg-primary/10 transition-colors">
                      <Lightbulb className="w-4 h-4 text-primary shrink-0" />
                      <span className="font-semibold text-foreground text-xs">Hint {i + 1}</span>
                    </summary>
                    <div
                      className="mt-2 px-3 pb-2 text-xs text-muted-foreground leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: hint }}
                    />
                  </details>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Topic Tags */}
          {question.topicTags.length > 0 && (
            <Card className="border-border/50 shadow-sm">
              <CardContent className="pt-5 pb-5">
                <h4 className="text-xs font-bold text-foreground mb-3">Related Topics</h4>
                <div className="flex flex-wrap gap-1.5">
                  {question.topicTags.map((tag) => (
                    <Badge key={tag} variant="outline" className="rounded-full text-[10px] px-2 py-0.5">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* XP Info */}
          <Card className="border-border/50 shadow-sm">
            <CardContent className="pt-5 pb-5">
              <div className="flex gap-3">
                <AlertCircle className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {!token ? (
                    <span>Sign in to track your progress and earn XP for solving this challenge.</span>
                  ) : !user?.platformIds?.leetcodeId ? (
                    <span>
                      Add your <span className="font-semibold text-foreground">LeetCode username</span> in your
                      Profile to auto-verify solutions and earn XP.
                    </span>
                  ) : (
                    <span>
                      Solve the problem on LeetCode, then click <span className="font-semibold text-foreground">"Check Solution"</span> to verify and earn{" "}
                      <span className="font-semibold text-primary">+{question.xpReward} XP</span>.
                    </span>
                  )}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
