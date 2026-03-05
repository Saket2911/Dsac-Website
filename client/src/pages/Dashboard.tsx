import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Flame, Medal, Target, Star, ChevronRight, Code, Trophy } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useLocation } from "wouter";

export default function Dashboard() {
  const { user } = useAuth();
  const [, navigate] = useLocation();

  const userName = user?.name?.split(" ")[0] || "there";
  const userXp = user?.xp || 0;
  const userLevel = user?.level || 1;
  const xpInLevel = userXp % 100;
  const xpProgress = xpInLevel;
  const xpToNext = 100 - xpInLevel;

  return (
    <div className="py-10 space-y-8 animate-in fade-in duration-500">
      {/* Header & Overview */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">Welcome back, {userName}!</h1>
          <p className="text-muted-foreground mt-2">Here's your progress and upcoming activities.</p>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-card to-background border-border/50 shadow-sm overflow-hidden relative">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Star className="w-16 h-16 text-primary" />
          </div>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Current Level</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-serif text-foreground">Level {userLevel}</div>
            <div className="mt-4 space-y-2">
              <div className="flex justify-between text-xs font-medium">
                <span className="text-primary">{userXp} XP</span>
                <span className="text-muted-foreground">{xpToNext} XP to Lvl {userLevel + 1}</span>
              </div>
              <Progress value={xpProgress} className="h-2 bg-primary/20" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border/50 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider flex items-center justify-between">
              Total XP <Medal className="w-4 h-4 text-primary" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-serif text-foreground">{userXp}</div>
            <p className="text-sm text-muted-foreground mt-2">
              Keep solving to earn more!
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border/50 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider flex items-center justify-between">
              Platform IDs <Target className="w-4 h-4 text-primary" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-serif text-foreground">
              {[user?.platformIds?.leetcodeId, user?.platformIds?.codeforcesId, user?.platformIds?.codechefId, user?.platformIds?.hackerrankId].filter(Boolean).length}
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              Platforms linked
            </p>
          </CardContent>
        </Card>

        <Card className="bg-secondary text-secondary-foreground border-none shadow-md flex flex-col justify-center relative overflow-hidden">
          <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
          <CardContent className="p-6 relative z-10">
            <h3 className="font-serif text-xl mb-2">Daily Question</h3>
            <p className="text-secondary-foreground/80 text-sm mb-4">Solve today's algorithmic challenge to earn XP and maintain your streak.</p>
            <button
              onClick={() => navigate("/daily")}
              className="text-sm font-bold bg-white text-secondary px-4 py-2 rounded-full inline-flex items-center group transition-all hover:bg-primary hover:text-white"
            >
              Solve Now <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
            </button>
          </CardContent>
        </Card>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-border/50 shadow-sm hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate("/leaderboard")}>
          <CardContent className="p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center">
              <Trophy className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Leaderboard</h3>
              <p className="text-sm text-muted-foreground">See where you rank</p>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground ml-auto" />
          </CardContent>
        </Card>

        <Card className="border-border/50 shadow-sm hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate("/quests")}>
          <CardContent className="p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
              <Target className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Quests</h3>
              <p className="text-sm text-muted-foreground">Complete challenges</p>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground ml-auto" />
          </CardContent>
        </Card>

        <Card className="border-border/50 shadow-sm hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate("/profile")}>
          <CardContent className="p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
              <Code className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Your Profile</h3>
              <p className="text-sm text-muted-foreground">View stats & edit</p>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground ml-auto" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
