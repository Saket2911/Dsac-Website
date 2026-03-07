import React from "react";
import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Card } from "../components/ui/card";
import { Avatar, AvatarFallback } from "../components/ui/avatar";
import { Badge } from "../components/ui/badge";
import { Trophy, Medal, Crown, Loader2, Clock, CheckCircle2, XCircle, Swords } from "lucide-react";
import { Button } from "../components/ui/button";
import { useAuth } from "../hooks/useAuth";
// const API_BASE = "http://localhost:3001";
import API_BASE from "../config/api.js";
export default function Leaderboard() {
  const {
    user,
    token
  } = useAuth();
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [platformData, setPlatformData] = useState([]);
  const [liveContests, setLiveContests] = useState([]);
  const [dailyTracker, setDailyTracker] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("xp");
  useEffect(() => {
    fetchData(activeTab);
  }, [activeTab, token]);
  const fetchData = async type => {
    setLoading(true);
    try {
      const headers = {};
      if (token) headers.Authorization = `Bearer ${token}`;
      if (type === "platform") {
        const res = await fetch(`${API_BASE}/leaderboard/platform`, {
          headers
        });
        const data = await res.json();
        setPlatformData(data.leaderboard || []);
      } else if (type === "live-contests") {
        const res = await fetch(`${API_BASE}/leaderboard/live-contests`, {
          headers
        });
        const data = await res.json();
        setLiveContests(data.contests || []);
      } else if (type === "daily-tracker") {
        const res = await fetch(`${API_BASE}/leaderboard/daily-tracker`, {
          headers
        });
        const data = await res.json();
        setDailyTracker(data);
      } else {
        const res = await fetch(`${API_BASE}/leaderboard/${type}`, {
          headers
        });
        const data = await res.json();
        setLeaderboardData(data.leaderboard || []);
      }
    } catch {
      setLeaderboardData([]);
      setPlatformData([]);
      setLiveContests([]);
      setDailyTracker(null);
    } finally {
      setLoading(false);
    }
  };
  const getInitials = name => name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
  const formatTime = dateStr => {
    const date = new Date(dateStr);
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit"
    });
  };
  const platformColor = platform => {
    switch (platform) {
      case "leetcode":
        return "text-amber-500";
      case "codeforces":
        return "text-blue-500";
      case "codechef":
        return "text-red-500";
      default:
        return "text-muted-foreground";
    }
  };
  const platformBg = platform => {
    switch (platform) {
      case "leetcode":
        return "bg-amber-500/10 border-amber-500/30";
      case "codeforces":
        return "bg-blue-500/10 border-blue-500/30";
      case "codechef":
        return "bg-red-500/10 border-red-500/30";
      default:
        return "bg-muted/10 border-border";
    }
  };
  const difficultyColor = d => {
    switch (d) {
      case "Easy":
        return "text-green-500 bg-green-500/10 border-green-500/30";
      case "Medium":
        return "text-amber-500 bg-amber-500/10 border-amber-500/30";
      case "Hard":
        return "text-red-500 bg-red-500/10 border-red-500/30";
      default:
        return "text-muted-foreground";
    }
  };
  const tabs = [{
    key: "xp",
    label: "By XP"
  }, {
    key: "daily",
    label: "Daily Solves"
  }, {
    key: "contest",
    label: "Contests"
  }, {
    key: "platform",
    label: "Platform Solved"
  }, {
    key: "live-contests",
    label: "Live Contests"
  }, {
    key: "daily-tracker",
    label: "Daily Tracker"
  }];
  const top3 = leaderboardData.slice(0, 3);
  const rest = leaderboardData.slice(3);
  const renderGenericLeaderboard = () => {
    if (leaderboardData.length === 0) {
      return <div className="text-center py-16">
        <Trophy className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-foreground">No rankings yet</h3>
        <p className="text-muted-foreground mt-2">Be the first to earn XP and climb the leaderboard!</p>
      </div>;
    }
    return <>
      {/* Podium for Top 3 */}
      {top3.length >= 3 && <div className="flex justify-center items-end h-64 gap-2 md:gap-6 mt-16 mb-8 px-4">
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
          <div className="font-bold text-foreground text-sm md:text-base">
            <Link href={`/profile/${encodeURIComponent(top3[1].name)}`}>
              <a className="hover:text-primary transition-colors cursor-pointer">{top3[1].name}</a>
            </Link>
          </div>
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
          <div className="font-bold text-foreground text-base md:text-lg">
            <Link href={`/profile/${encodeURIComponent(top3[0].name)}`}>
              <a className="hover:text-primary transition-colors cursor-pointer">{top3[0].name}</a>
            </Link>
          </div>
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
          <div className="font-bold text-foreground text-sm md:text-base">
            <Link href={`/profile/${encodeURIComponent(top3[2].name)}`}>
              <a className="hover:text-primary transition-colors cursor-pointer">{top3[2].name}</a>
            </Link>
          </div>
          <div className="text-xs text-muted-foreground font-medium mb-2">{top3[2].xp} XP</div>
          <div className="w-24 md:w-32 h-16 bg-gradient-to-t from-amber-200 to-amber-100 rounded-t-lg border-t-4 border-amber-600 flex items-center justify-center shadow-inner">
            <span className="text-3xl font-serif font-bold text-amber-700">3</span>
          </div>
        </div>
      </div>}

      {/* Rankings Table */}
      {(rest.length > 0 || leaderboardData.length < 3) && <Card className="border-border/50 shadow-sm max-w-4xl mx-auto overflow-hidden">
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
              {(leaderboardData.length < 3 ? leaderboardData : rest).map(entry => <tr key={entry.rank} className="bg-card border-b border-border/40 hover:bg-muted/30 transition-colors">
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
                    <div className="font-semibold text-foreground">
                      <Link href={`/profile/${encodeURIComponent(entry.name)}`}>
                        <a className="hover:text-primary transition-colors cursor-pointer">{entry.name}</a>
                      </Link>
                    </div>
                    {user && entry.email === user.email && <Badge variant="outline" className="ml-2 bg-primary/10 text-primary border-primary/20 text-[10px]">You</Badge>}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <Badge variant="secondary" className="bg-background">Lvl {entry.level}</Badge>
                </td>
                <td className="px-6 py-4 text-right font-bold text-primary">
                  {entry.xp} XP
                </td>
              </tr>)}
            </tbody>
          </table>
        </div>
      </Card>}
    </>;
  };
  const renderPlatformLeaderboard = () => {
    if (platformData.length === 0) {
      return <div className="text-center py-16">
        <Trophy className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-foreground">No platform data yet</h3>
        <p className="text-muted-foreground mt-2">Link your platform accounts to appear here!</p>
      </div>;
    }
    return <Card className="border-border/50 shadow-sm max-w-5xl mx-auto overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-muted-foreground uppercase bg-card/50 border-b border-border">
            <tr>
              <th scope="col" className="px-4 py-4 font-semibold">Rank</th>
              <th scope="col" className="px-4 py-4 font-semibold">Student</th>
              <th scope="col" className="px-4 py-4 font-semibold text-center">
                <span className="text-amber-500">LeetCode</span>
              </th>
              <th scope="col" className="px-4 py-4 font-semibold text-center">
                <span className="text-blue-500">Codeforces</span>
              </th>
              <th scope="col" className="px-4 py-4 font-semibold text-center">
                <span className="text-red-500">CodeChef</span>
              </th>
              <th scope="col" className="px-4 py-4 font-semibold text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            {platformData.map(entry => <tr key={entry.rank} className="bg-card border-b border-border/40 hover:bg-muted/30 transition-colors">
              <td className="px-4 py-4 font-medium">
                <span className={`w-8 h-8 rounded-full flex items-center justify-center font-serif ${entry.rank === 1 ? "bg-yellow-100 text-yellow-700 font-bold" : entry.rank === 2 ? "bg-slate-100 text-slate-600 font-bold" : entry.rank === 3 ? "bg-amber-100 text-amber-700 font-bold" : "bg-background text-muted-foreground"}`}>
                  {entry.rank <= 3 ? entry.rank === 1 ? <Crown className="w-4 h-4 text-yellow-500" /> : <Medal className={`w-4 h-4 ${entry.rank === 2 ? "text-slate-400" : "text-amber-600"}`} /> : `#${entry.rank}`}
                </span>
              </td>
              <td className="px-4 py-4">
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-primary/10 text-primary text-xs">{getInitials(entry.name)}</AvatarFallback>
                  </Avatar>
                  <div className="font-semibold text-foreground">
                    <Link href={`/profile/${encodeURIComponent(entry.name)}`}>
                      <a className="hover:text-primary transition-colors cursor-pointer">{entry.name}</a>
                    </Link>
                  </div>
                  {user && entry.email === user.email && <Badge variant="outline" className="ml-1 bg-primary/10 text-primary border-primary/20 text-[10px]">You</Badge>}
                </div>
              </td>
              <td className="px-4 py-4 text-center">
                <span className={`font-bold ${entry.leetcode > 0 ? "text-amber-500" : "text-muted-foreground/40"}`}>
                  {entry.leetcode}
                </span>
              </td>
              <td className="px-4 py-4 text-center">
                <span className={`font-bold ${entry.codeforces > 0 ? "text-blue-500" : "text-muted-foreground/40"}`}>
                  {entry.codeforces}
                </span>
              </td>
              <td className="px-4 py-4 text-center">
                <span className={`font-bold ${entry.codechef > 0 ? "text-red-500" : "text-muted-foreground/40"}`}>
                  {entry.codechef}
                </span>
              </td>
              <td className="px-4 py-4 text-right">
                <span className="font-bold text-primary text-lg">{entry.total}</span>
              </td>
            </tr>)}
          </tbody>
        </table>
      </div>
    </Card>;
  };
  const renderLiveContests = () => {
    if (liveContests.length === 0) {
      return <div className="text-center py-16">
        <Swords className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-foreground">No contests today</h3>
        <p className="text-muted-foreground mt-2">
          Check back when a contest is running! Rankings are fetched live during contests.
        </p>
      </div>;
    }
    return <div className="space-y-6 max-w-4xl mx-auto">
      {liveContests.map(contest => <Card key={contest.id} className={`border shadow-sm overflow-hidden ${platformBg(contest.platform)}`}>
        <div className="p-5 border-b border-border/30">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <h3 className="text-lg font-bold text-foreground">{contest.name}</h3>
              <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                <Badge variant="outline" className={`capitalize ${platformColor(contest.platform)}`}>
                  {contest.platform}
                </Badge>
                <span>{new Date(contest.startTime).toLocaleDateString()}</span>
                <span>
                  {formatTime(contest.startTime)} - {formatTime(contest.endTime)}
                </span>
              </div>
            </div>
            <Badge className={`text-xs font-bold uppercase ${contest.status === "active" ? "bg-green-500 text-white animate-pulse" : contest.status === "upcoming" ? "bg-blue-500 text-white" : "bg-muted text-muted-foreground"}`}>
              {contest.status === "active" ? "🔴 LIVE" : contest.status === "upcoming" ? "Upcoming" : "Ended"}
            </Badge>
          </div>
        </div>
        {contest.leaderboard.length > 0 ? <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-muted-foreground uppercase bg-card/30 border-b border-border/30">
              <tr>
                <th className="px-5 py-3 font-semibold">Rank</th>
                <th className="px-5 py-3 font-semibold">Member</th>
                <th className="px-5 py-3 font-semibold text-right">Score</th>
              </tr>
            </thead>
            <tbody>
              {contest.leaderboard.map((entry, idx) => <tr key={idx} className="border-b border-border/20 hover:bg-muted/20 transition-colors">
                <td className="px-5 py-3 font-medium">
                  <span className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold ${entry.rank === 1 ? "bg-yellow-100 text-yellow-700" : entry.rank === 2 ? "bg-slate-100 text-slate-600" : entry.rank === 3 ? "bg-amber-100 text-amber-700" : "bg-background text-muted-foreground"}`}>
                    {entry.rank}
                  </span>
                </td>
                <td className="px-5 py-3 font-semibold text-foreground">{entry.username}</td>
                <td className="px-5 py-3 text-right font-bold text-primary">{entry.score}</td>
              </tr>)}
            </tbody>
          </table>
        </div> : <div className="p-6 text-center text-muted-foreground text-sm">
          No member rankings available yet. Rankings update every 2 minutes during active contests.
        </div>}
      </Card>)}
    </div>;
  };
  const renderDailyTracker = () => {
    if (!dailyTracker || !dailyTracker.question) {
      return <div className="text-center py-16">
        <Clock className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-foreground">No daily question today</h3>
        <p className="text-muted-foreground mt-2">The daily question hasn't been posted yet. Check back soon!</p>
      </div>;
    }
    const {
      question,
      solvers
    } = dailyTracker;
    const solvedCount = solvers.filter(s => s.solved).length;
    return <div className="max-w-4xl mx-auto space-y-6">
      {/* Question info card */}
      <Card className="border-border/50 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-border/30 bg-gradient-to-r from-primary/5 to-transparent">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <h3 className="text-xl font-bold text-foreground">{question.title}</h3>
              <div className="flex items-center gap-3 mt-2">
                <Badge variant="outline" className={`capitalize ${platformColor(question.platform)}`}>
                  {question.platform}
                </Badge>
                <Badge variant="outline" className={difficultyColor(question.difficulty)}>
                  {question.difficulty}
                </Badge>
                <span className="text-sm text-muted-foreground">
                  {new Date(question.date).toLocaleDateString()}
                </span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-primary">{solvedCount}</div>
              <div className="text-xs text-muted-foreground">solved today</div>
            </div>
          </div>
        </div>
      </Card>

      {/* Solvers list */}
      <Card className="border-border/50 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-muted-foreground uppercase bg-card/50 border-b border-border">
              <tr>
                <th className="px-5 py-4 font-semibold">#</th>
                <th className="px-5 py-4 font-semibold">Member</th>
                <th className="px-5 py-4 font-semibold text-center">Status</th>
                <th className="px-5 py-4 font-semibold text-right">Solved At</th>
              </tr>
            </thead>
            <tbody>
              {solvers.map((solver, idx) => <tr key={idx} className="bg-card border-b border-border/40 hover:bg-muted/30 transition-colors">
                <td className="px-5 py-4 font-medium text-muted-foreground">{idx + 1}</td>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className={`text-xs font-bold ${solver.solved ? "bg-green-500/10 text-green-600" : "bg-muted text-muted-foreground"}`}>
                        {getInitials(solver.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="font-semibold text-foreground">
                      <Link href={`/profile/${encodeURIComponent(solver.name)}`}>
                        <a className="hover:text-primary transition-colors cursor-pointer">{solver.name}</a>
                      </Link>
                    </div>
                    {user && solver.email === user.email && <Badge variant="outline" className="ml-1 bg-primary/10 text-primary border-primary/20 text-[10px]">You</Badge>}
                  </div>
                </td>
                <td className="px-5 py-4 text-center">
                  {solver.solved ? <span className="inline-flex items-center gap-1.5 text-green-600 font-semibold">
                    <CheckCircle2 className="w-4 h-4" /> Solved
                  </span> : <span className="inline-flex items-center gap-1.5 text-muted-foreground/60">
                    <XCircle className="w-4 h-4" /> Not yet
                  </span>}
                </td>
                <td className="px-5 py-4 text-right">
                  {solver.solvedAt ? <span className="text-foreground font-medium inline-flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-muted-foreground" />
                    {formatTime(solver.solvedAt)}
                  </span> : <span className="text-muted-foreground/40">—</span>}
                </td>
              </tr>)}
            </tbody>
          </table>
        </div>
      </Card>
    </div>;
  };
  return <div className="py-10 space-y-12 animate-in fade-in duration-500">
    <div className="text-center max-w-2xl mx-auto space-y-4">
      <h1 className="text-4xl md:text-5xl font-bold text-foreground">Global Leaderboard</h1>
      <p className="text-muted-foreground text-lg">
        Compete with your peers. Top 3 students at the end of the semester receive special recognition.
      </p>
      <div className="flex flex-wrap justify-center gap-2 mt-4">
        {tabs.map(tab => <Button key={tab.key} variant={activeTab === tab.key ? "outline" : "ghost"} className={`rounded-full text-xs sm:text-sm ${activeTab === tab.key ? "bg-primary/10 text-primary border-primary" : ""}`} onClick={() => setActiveTab(tab.key)}>
          {tab.label}
        </Button>)}
      </div>
    </div>

    {loading ? <div className="flex items-center justify-center py-16">
      <Loader2 className="w-8 h-8 animate-spin text-primary" />
      <span className="ml-3 text-muted-foreground">Loading leaderboard...</span>
    </div> : <>
      {(activeTab === "xp" || activeTab === "daily" || activeTab === "contest") && renderGenericLeaderboard()}
      {activeTab === "platform" && renderPlatformLeaderboard()}
      {activeTab === "live-contests" && renderLiveContests()}
      {activeTab === "daily-tracker" && renderDailyTracker()}
    </>}
  </div>;
}