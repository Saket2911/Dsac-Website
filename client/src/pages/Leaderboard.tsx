import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Trophy, Medal, Crown, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

interface LeaderboardEntry {
  rank: number;
  name: string;
  email: string;
  xp: number;
  level: number;
  college?: string;
  solvedCount?: number;
}

export default function Leaderboard() {
  const { user, token } = useAuth();
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"xp" | "daily" | "contest">("xp");

  useEffect(() => {
    fetchLeaderboard(activeTab);
  }, [activeTab, token]);

  const fetchLeaderboard = async (type: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/leaderboard/${type}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      const data = await res.json();
      if (data.leaderboard) {
        setLeaderboardData(data.leaderboard);
      }
    } catch {
      setLeaderboardData([]);
    } finally {
      setLoading(false);
    }
  };

  const getInitials = (name: string) =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);

  const top3 = leaderboardData.slice(0, 3);
  const rest = leaderboardData.slice(3);

  return (
    <div className="py-10 space-y-12 animate-in fade-in duration-500">
      <div className="text-center max-w-2xl mx-auto space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold text-foreground">Global Leaderboard</h1>
        <p className="text-muted-foreground text-lg">
          Compete with your peers. Top 3 students at the end of the semester receive special recognition.
        </p>
        <div className="flex justify-center gap-2 mt-4">
          <Button
            variant={activeTab === "xp" ? "outline" : "ghost"}
            className={`rounded-full ${activeTab === "xp" ? "bg-primary/10 text-primary border-primary" : ""}`}
            onClick={() => setActiveTab("xp")}
          >
            By XP
          </Button>
          <Button
            variant={activeTab === "daily" ? "outline" : "ghost"}
            className={`rounded-full ${activeTab === "daily" ? "bg-primary/10 text-primary border-primary" : ""}`}
            onClick={() => setActiveTab("daily")}
          >
            Daily Solves
          </Button>
          <Button
            variant={activeTab === "contest" ? "outline" : "ghost"}
            className={`rounded-full ${activeTab === "contest" ? "bg-primary/10 text-primary border-primary" : ""}`}
            onClick={() => setActiveTab("contest")}
          >
            Contests
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <span className="ml-3 text-muted-foreground">Loading leaderboard...</span>
        </div>
      ) : leaderboardData.length === 0 ? (
        <div className="text-center py-16">
          <Trophy className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-foreground">No rankings yet</h3>
          <p className="text-muted-foreground mt-2">Be the first to earn XP and climb the leaderboard!</p>
        </div>
      ) : (
        <>
          {/* Podium for Top 3 */}
          {top3.length >= 3 && (
            <div className="flex justify-center items-end h-64 gap-2 md:gap-6 mt-16 mb-8 px-4">
              {/* 2nd Place */}
              <div className="flex flex-col items-center animate-in slide-in-from-bottom-8 duration-700 delay-100">
                <div className="relative mb-2">
                  <Avatar className="h-16 w-16 border-4 border-slate-300">
                    <AvatarFallback className="bg-slate-100 text-slate-600 font-bold text-xl">{getInitials(top3[1].name)}</AvatarFallback>
                  </Avatar>
                  <div className="absolute -top-3 -right-3 bg-slate-200 rounded-full p-1 border border-slate-300 shadow-sm">
                    <Medal className="w-5 h-5 text-slate-500" />
                  </div>
                </div>
                <div className="font-bold text-foreground text-sm md:text-base">{top3[1].name}</div>
                <div className="text-xs text-muted-foreground font-medium mb-2">{top3[1].xp} XP</div>
                <div className="w-24 md:w-32 h-24 bg-gradient-to-t from-slate-200 to-slate-100 rounded-t-lg border-t-4 border-slate-300 flex items-center justify-center shadow-inner">
                  <span className="text-4xl font-serif font-bold text-slate-400">2</span>
                </div>
              </div>

              {/* 1st Place */}
              <div className="flex flex-col items-center animate-in slide-in-from-bottom-12 duration-700 z-10">
                <div className="relative mb-2">
                  <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-yellow-500 animate-bounce">
                    <Crown className="w-8 h-8 fill-yellow-500" />
                  </div>
                  <Avatar className="h-20 w-20 border-4 border-yellow-400 ring-4 ring-yellow-400/20">
                    <AvatarFallback className="bg-yellow-100 text-yellow-700 font-bold text-2xl">{getInitials(top3[0].name)}</AvatarFallback>
                  </Avatar>
                </div>
                <div className="font-bold text-foreground text-base md:text-lg">{top3[0].name}</div>
                <div className="text-sm text-primary font-bold mb-2">{top3[0].xp} XP</div>
                <div className="w-28 md:w-36 h-32 bg-gradient-to-t from-yellow-200 to-yellow-100 rounded-t-lg border-t-4 border-yellow-400 flex items-center justify-center shadow-inner">
                  <span className="text-5xl font-serif font-bold text-yellow-600">1</span>
                </div>
              </div>

              {/* 3rd Place */}
              <div className="flex flex-col items-center animate-in slide-in-from-bottom-6 duration-700 delay-200">
                <div className="relative mb-2">
                  <Avatar className="h-14 w-14 border-4 border-amber-600">
                    <AvatarFallback className="bg-amber-100 text-amber-800 font-bold">{getInitials(top3[2].name)}</AvatarFallback>
                  </Avatar>
                  <div className="absolute -top-3 -right-3 bg-amber-100 rounded-full p-1 border border-amber-600 shadow-sm">
                    <Medal className="w-4 h-4 text-amber-700" />
                  </div>
                </div>
                <div className="font-bold text-foreground text-sm md:text-base">{top3[2].name}</div>
                <div className="text-xs text-muted-foreground font-medium mb-2">{top3[2].xp} XP</div>
                <div className="w-24 md:w-32 h-16 bg-gradient-to-t from-amber-200 to-amber-100 rounded-t-lg border-t-4 border-amber-600 flex items-center justify-center shadow-inner">
                  <span className="text-3xl font-serif font-bold text-amber-700">3</span>
                </div>
              </div>
            </div>
          )}

          {/* Rankings Table */}
          {rest.length > 0 && (
            <Card className="border-border/50 shadow-sm max-w-4xl mx-auto overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-muted-foreground uppercase bg-card/50 border-b border-border">
                    <tr>
                      <th scope="col" className="px-6 py-4 rounded-tl-lg font-semibold">Rank</th>
                      <th scope="col" className="px-6 py-4 font-semibold">Student</th>
                      <th scope="col" className="px-6 py-4 font-semibold">Level</th>
                      <th scope="col" className="px-6 py-4 font-semibold text-right rounded-tr-lg">Total XP</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rest.map((entry) => (
                      <tr key={entry.rank} className="bg-card border-b border-border/40 hover:bg-muted/30 transition-colors">
                        <td className="px-6 py-4 font-medium">
                          <span className="w-8 h-8 rounded-full bg-background flex items-center justify-center text-muted-foreground font-serif">
                            #{entry.rank}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback className="bg-primary/10 text-primary text-xs">{getInitials(entry.name)}</AvatarFallback>
                            </Avatar>
                            <div className="font-semibold text-foreground">{entry.name}</div>
                            {user && entry.email === user.email && (
                              <Badge variant="outline" className="ml-2 bg-primary/10 text-primary border-primary/20 text-[10px]">You</Badge>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <Badge variant="secondary" className="bg-background">Lvl {entry.level}</Badge>
                        </td>
                        <td className="px-6 py-4 text-right font-bold text-primary">
                          {entry.xp} XP
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          )}

          {/* Single/double entries - show as simple cards */}
          {leaderboardData.length > 0 && leaderboardData.length < 3 && (
            <Card className="border-border/50 shadow-sm max-w-4xl mx-auto overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-muted-foreground uppercase bg-card/50 border-b border-border">
                    <tr>
                      <th scope="col" className="px-6 py-4 font-semibold">Rank</th>
                      <th scope="col" className="px-6 py-4 font-semibold">Student</th>
                      <th scope="col" className="px-6 py-4 font-semibold">Level</th>
                      <th scope="col" className="px-6 py-4 font-semibold text-right">Total XP</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leaderboardData.map((entry) => (
                      <tr key={entry.rank} className="bg-card border-b border-border/40 hover:bg-muted/30 transition-colors">
                        <td className="px-6 py-4 font-medium">
                          <span className="w-8 h-8 rounded-full bg-background flex items-center justify-center text-muted-foreground font-serif">
                            #{entry.rank}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback className="bg-primary/10 text-primary text-xs">{getInitials(entry.name)}</AvatarFallback>
                            </Avatar>
                            <div className="font-semibold text-foreground">{entry.name}</div>
                            {user && entry.email === user.email && (
                              <Badge variant="outline" className="ml-2 bg-primary/10 text-primary border-primary/20 text-[10px]">You</Badge>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <Badge variant="secondary" className="bg-background">Lvl {entry.level}</Badge>
                        </td>
                        <td className="px-6 py-4 text-right font-bold text-primary">
                          {entry.xp} XP
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          )}
        </>
      )}
    </div>
  );
}
