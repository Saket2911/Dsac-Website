import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Trophy, Medal, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";

const leaderboardData = [
  { rank: 1, name: "Sarah Connor", xp: 5420, level: 18, badges: 12, avatar: "SC" },
  { rank: 2, name: "John Smith", xp: 4980, level: 16, badges: 9, avatar: "JS" },
  { rank: 3, name: "Emily Chen", xp: 4850, level: 16, badges: 10, avatar: "EC" },
  { rank: 4, name: "Michael Wong", xp: 4200, level: 14, badges: 8, avatar: "MW" },
  { rank: 5, name: "Alex Johnson", xp: 3450, level: 12, badges: 5, avatar: "AJ" },
  { rank: 6, name: "Jessica Davis", xp: 3100, level: 11, badges: 6, avatar: "JD" },
  { rank: 7, name: "Daniel Martinez", xp: 2950, level: 10, badges: 4, avatar: "DM" },
  { rank: 8, name: "Lisa Taylor", xp: 2800, level: 10, badges: 5, avatar: "LT" },
  { rank: 9, name: "David Anderson", xp: 2650, level: 9, badges: 3, avatar: "DA" },
  { rank: 10, name: "Sophia Wilson", xp: 2500, level: 9, badges: 4, avatar: "SW" },
];

export default function Leaderboard() {
  return (
    <div className="py-10 space-y-12 animate-in fade-in duration-500">
      <div className="text-center max-w-2xl mx-auto space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold text-foreground">Global Leaderboard</h1>
        <p className="text-muted-foreground text-lg">
          Compete with your peers. Top 3 students at the end of the semester receive special recognition.
        </p>
        <div className="flex justify-center gap-2 mt-4">
          <Button variant="outline" className="rounded-xl bg-primary/10 text-primary border-primary/30 font-semibold hover:bg-primary/15">Weekly</Button>
          <Button variant="ghost" className="rounded-xl font-semibold hover:bg-muted/50">Monthly</Button>
          <Button variant="ghost" className="rounded-xl font-semibold hover:bg-muted/50">All Time</Button>
        </div>
      </div>

      {/* Podium for Top 3 */}
      <div className="flex justify-center items-end h-64 gap-2 md:gap-6 mt-16 mb-8 px-4">
        {/* 2nd Place */}
        <div className="flex flex-col items-center animate-in slide-in-from-bottom-8 duration-700 delay-100">
          <div className="relative mb-2">
            <Avatar className="h-16 w-16 border-4 border-slate-300">
              <AvatarFallback className="bg-slate-50 text-slate-600 font-bold text-xl">{leaderboardData[1].avatar}</AvatarFallback>
            </Avatar>
            <div className="absolute -top-3 -right-3 bg-slate-100 rounded-full p-1 border border-slate-300 shadow-sm">
              <Medal className="w-5 h-5 text-slate-500" />
            </div>
          </div>
          <div className="font-bold text-foreground text-sm md:text-base">{leaderboardData[1].name}</div>
          <div className="text-xs text-muted-foreground font-medium mb-2">{leaderboardData[1].xp} XP</div>
          <div className="w-24 md:w-32 h-24 bg-gradient-to-t from-slate-200 to-slate-50 rounded-t-2xl border-t-4 border-slate-300 flex items-center justify-center shadow-inner">
            <span className="text-4xl font-bold text-slate-400">2</span>
          </div>
        </div>

        {/* 1st Place */}
        <div className="flex flex-col items-center animate-in slide-in-from-bottom-12 duration-700 z-10">
          <div className="relative mb-2">
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-yellow-500 animate-bounce">
              <Crown className="w-8 h-8 fill-yellow-500" />
            </div>
            <Avatar className="h-20 w-20 border-4 border-yellow-400 ring-4 ring-yellow-400/20">
              <AvatarFallback className="bg-yellow-50 text-yellow-700 font-bold text-2xl">{leaderboardData[0].avatar}</AvatarFallback>
            </Avatar>
          </div>
          <div className="font-bold text-foreground text-base md:text-lg">{leaderboardData[0].name}</div>
          <div className="text-sm text-primary font-bold mb-2">{leaderboardData[0].xp} XP</div>
          <div className="w-28 md:w-36 h-32 bg-gradient-to-t from-yellow-200 to-yellow-50 rounded-t-2xl border-t-4 border-yellow-400 flex items-center justify-center shadow-inner">
            <span className="text-5xl font-bold text-yellow-600">1</span>
          </div>
        </div>

        {/* 3rd Place */}
        <div className="flex flex-col items-center animate-in slide-in-from-bottom-6 duration-700 delay-200">
          <div className="relative mb-2">
            <Avatar className="h-14 w-14 border-4 border-amber-600">
              <AvatarFallback className="bg-amber-50 text-amber-800 font-bold">{leaderboardData[2].avatar}</AvatarFallback>
            </Avatar>
            <div className="absolute -top-3 -right-3 bg-amber-50 rounded-full p-1 border border-amber-600 shadow-sm">
              <Medal className="w-4 h-4 text-amber-700" />
            </div>
          </div>
          <div className="font-bold text-foreground text-sm md:text-base">{leaderboardData[2].name}</div>
          <div className="text-xs text-muted-foreground font-medium mb-2">{leaderboardData[2].xp} XP</div>
          <div className="w-24 md:w-32 h-16 bg-gradient-to-t from-amber-200 to-amber-50 rounded-t-2xl border-t-4 border-amber-600 flex items-center justify-center shadow-inner">
            <span className="text-3xl font-bold text-amber-700">3</span>
          </div>
        </div>
      </div>

      {/* Rankings Table */}
      <Card className="border-border/30 card-shadow max-w-4xl mx-auto overflow-hidden rounded-2xl bg-white">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-muted-foreground uppercase bg-muted/30 border-b border-border/30">
              <tr>
                <th scope="col" className="px-6 py-4 rounded-tl-2xl font-semibold">Rank</th>
                <th scope="col" className="px-6 py-4 font-semibold">Student</th>
                <th scope="col" className="px-6 py-4 font-semibold">Level</th>
                <th scope="col" className="px-6 py-4 font-semibold text-right rounded-tr-2xl">Total XP</th>
              </tr>
            </thead>
            <tbody>
              {leaderboardData.slice(3).map((user) => (
                <tr key={user.rank} className="bg-white border-b border-border/20 hover:bg-primary/3 transition-colors">
                  <td className="px-6 py-4 font-medium">
                    <span className="w-8 h-8 rounded-lg bg-muted/40 flex items-center justify-center text-muted-foreground font-bold">
                      #{user.rank}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">{user.avatar}</AvatarFallback>
                      </Avatar>
                      <div className="font-semibold text-foreground">{user.name}</div>
                      {user.name === "Alex Johnson" && (
                        <Badge variant="outline" className="ml-2 bg-primary/10 text-primary border-primary/20 text-[10px] rounded-lg">You</Badge>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant="secondary" className="bg-muted/50 rounded-lg font-semibold">Lvl {user.level}</Badge>
                  </td>
                  <td className="px-6 py-4 text-right font-bold text-primary">
                    {user.xp} XP
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
