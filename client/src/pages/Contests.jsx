import React from "react";
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Calendar, Clock, Trophy, Users, ExternalLink, Loader2, AlertCircle } from "lucide-react";
// const API_BASE = "http://localhost:3001";
import API_BASE from "../config/api.js";
const platformColors = {
  codeforces: {
    bg: "bg-blue-100",
    text: "text-blue-700",
    label: "Codeforces"
  },
  leetcode: {
    bg: "bg-amber-100",
    text: "text-amber-700",
    label: "LeetCode"
  },
  codechef: {
    bg: "bg-orange-100",
    text: "text-orange-700",
    label: "CodeChef"
  }
};
function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric"
  });
}
function formatTime(dateStr) {
  return new Date(dateStr).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit"
  });
}
function formatDuration(seconds) {
  const hours = Math.floor(seconds / 3600);
  const mins = Math.floor(seconds % 3600 / 60);
  if (hours > 0 && mins > 0) return `${hours}h ${mins}m`;
  if (hours > 0) return `${hours}h`;
  return `${mins}m`;
}
export default function Contests() {
  const [upcoming, setUpcoming] = useState([]);
  const [active, setActive] = useState([]);
  const [past, setPast] = useState([]);
  const [memberCount, setMemberCount] = useState(0);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    Promise.all([fetch(`${API_BASE}/contests`).then(r => r.json()), fetch(`${API_BASE}/contests/member-count`).then(r => r.json())]).then(([contestData, memberData]) => {
      setUpcoming(contestData.upcoming || []);
      setActive(contestData.active || []);
      setPast(contestData.past || []);
      setMemberCount(memberData.memberCount || 0);
    }).catch(() => { }).finally(() => setLoading(false));
  }, []);
  if (loading) {
    return <div className="py-20 flex flex-col items-center justify-center gap-4 animate-in fade-in">
      <Loader2 className="w-10 h-10 animate-spin text-primary" />
      <p className="text-muted-foreground">Fetching contests from platforms...</p>
    </div>;
  }
  const nextContest = active.length > 0 ? active[0] : upcoming.length > 0 ? upcoming[0] : null;
  return <div className="py-10 space-y-12 animate-in fade-in duration-500">
    <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
      <div>
        <h1 className="text-4xl md:text-5xl font-bold text-foreground">Contests</h1>
        <p className="text-muted-foreground mt-2 text-lg">
          Upcoming competitive programming contests across platforms.
        </p>
      </div>
      <Badge variant="outline" className="text-sm px-4 py-1.5 gap-1.5">
        <Users className="w-4 h-4" /> {memberCount} Members Registered
      </Badge>
    </div>

    {/* Featured Contest */}
    {nextContest && <Card className="border-primary/30 shadow-lg bg-gradient-to-r from-card to-background relative overflow-hidden">
      <div className="absolute right-0 top-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2"></div>
      <CardContent className="p-8 md:p-12 relative z-10 flex flex-col md:flex-row items-center gap-8">
        <div className="w-32 h-32 md:w-40 md:h-40 rounded-3xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-xl shrink-0 rotate-3 transition-transform hover:rotate-0 duration-300">
          <Trophy className="w-16 h-16 text-white drop-shadow-md" />
        </div>
        <div className="flex-1 text-center md:text-left space-y-4">
          <div className="flex flex-wrap justify-center md:justify-start gap-2">
            <Badge className={`${active.length > 0 ? "bg-red-100 text-red-700 animate-pulse" : "bg-green-100 text-green-700"} hover:bg-current border-none px-3 py-1 font-semibold uppercase tracking-wider text-xs`}>
              {active.length > 0 ? "Live Now" : "Upcoming"}
            </Badge>
            <Badge className={`${platformColors[nextContest.platform]?.bg || "bg-gray-100"} ${platformColors[nextContest.platform]?.text || "text-gray-700"} border-none text-xs`}>
              {platformColors[nextContest.platform]?.label || nextContest.platform}
            </Badge>
          </div>
          <h2 className="text-3xl font-serif font-bold text-foreground">{nextContest.name}</h2>
          <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm font-medium pt-2">
            <div className="flex items-center gap-1.5 text-foreground/80 bg-background/50 px-3 py-1.5 rounded-md border border-border/50">
              <Calendar className="w-4 h-4 text-primary" /> {formatDate(nextContest.startTime)}
            </div>
            <div className="flex items-center gap-1.5 text-foreground/80 bg-background/50 px-3 py-1.5 rounded-md border border-border/50">
              <Clock className="w-4 h-4 text-primary" /> {formatTime(nextContest.startTime)}
            </div>
            <div className="flex items-center gap-1.5 text-foreground/80 bg-background/50 px-3 py-1.5 rounded-md border border-border/50">
              <Clock className="w-4 h-4 text-primary" /> {formatDuration(nextContest.duration)}
            </div>
          </div>
          <div className="pt-4">
            <Button size="lg" className="bg-primary hover:bg-secondary text-white rounded-full px-8 shadow-md gap-2" onClick={() => window.open(nextContest.url, "_blank")}>
              <ExternalLink className="w-4 h-4" />
              {active.length > 0 ? "Join Contest" : "Register Now"}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>}

    {/* Upcoming Contests */}
    {upcoming.length > 1 && <div>
      <h3 className="text-2xl font-serif font-bold text-foreground mb-6">Upcoming Contests</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {upcoming.slice(1, 7).map((contest, idx) => <Card key={idx} className="border-border/50 shadow-sm hover:shadow-md transition-all duration-300 group">
          <CardHeader className="pb-3 border-b border-border/30 bg-card/30">
            <div className="flex justify-between items-start">
              <div className="flex-1 min-w-0">
                <CardTitle className="text-lg truncate">{contest.name}</CardTitle>
                <CardDescription className="flex items-center gap-1.5 mt-1">
                  <Calendar className="w-3.5 h-3.5" /> {formatDate(contest.startTime)}
                </CardDescription>
              </div>
              <Badge className={`${platformColors[contest.platform]?.bg || "bg-gray-100"} ${platformColors[contest.platform]?.text || "text-gray-700"} border-none text-xs shrink-0 ml-2`}>
                {platformColors[contest.platform]?.label || contest.platform}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-4 pb-2 text-sm text-muted-foreground space-y-2">
            <div className="flex justify-between">
              <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> Start Time</span>
              <span className="font-medium text-foreground">{formatTime(contest.startTime)}</span>
            </div>
            <div className="flex justify-between">
              <span>Duration</span>
              <span className="font-medium text-foreground">{formatDuration(contest.duration)}</span>
            </div>
          </CardContent>
          <CardFooter className="pt-2">
            <Button variant="ghost" className="w-full justify-between group-hover:text-primary transition-colors" onClick={() => window.open(contest.url, "_blank")}>
              Register <ExternalLink className="w-4 h-4" />
            </Button>
          </CardFooter>
        </Card>)}
      </div>
    </div>}

    {/* Past Contests */}
    {past.length > 0 && <div>
      <h3 className="text-2xl font-serif font-bold text-foreground mb-6">Recent Past Contests</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {past.slice(0, 6).map((contest, idx) => <Card key={idx} className="border-border/50 shadow-sm hover:shadow-md transition-all duration-300 group opacity-80 hover:opacity-100">
          <CardHeader className="pb-3 border-b border-border/30 bg-card/30">
            <div className="flex justify-between items-start">
              <div className="flex-1 min-w-0">
                <CardTitle className="text-lg truncate">{contest.name}</CardTitle>
                <CardDescription className="flex items-center gap-1.5 mt-1">
                  <Calendar className="w-3.5 h-3.5" /> {formatDate(contest.startTime)}
                </CardDescription>
              </div>
              <Badge className={`${platformColors[contest.platform]?.bg || "bg-gray-100"} ${platformColors[contest.platform]?.text || "text-gray-700"} border-none text-xs shrink-0 ml-2`}>
                {platformColors[contest.platform]?.label || contest.platform}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-4 pb-2 text-sm text-muted-foreground space-y-2">
            <div className="flex justify-between">
              <span>Duration</span>
              <span className="font-medium text-foreground">{formatDuration(contest.duration)}</span>
            </div>
            <div className="flex justify-between">
              <span>Status</span>
              <Badge variant="outline" className="text-xs text-muted-foreground">Ended</Badge>
            </div>
          </CardContent>
          <CardFooter className="pt-2">
            <Button variant="ghost" className="w-full justify-between group-hover:text-primary transition-colors" onClick={() => window.open(contest.url, "_blank")}>
              View Problems <ExternalLink className="w-4 h-4" />
            </Button>
          </CardFooter>
        </Card>)}
      </div>
    </div>}

    {/* Empty state */}
    {upcoming.length === 0 && active.length === 0 && past.length === 0 && <div className="text-center py-16">
      <AlertCircle className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
      <h3 className="text-xl font-semibold">No contests available</h3>
      <p className="text-muted-foreground mt-2">Check back soon for upcoming contests from LeetCode and Codeforces.</p>
    </div>}
  </div>;
}