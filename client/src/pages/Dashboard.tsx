import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Flame, Medal, Target, Star, ChevronRight, Code, Trophy, TrendingUp } from "lucide-react";
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

const xpData = [
  { name: 'Week 1', xp: 400 },
  { name: 'Week 2', xp: 850 },
  { name: 'Week 3', xp: 1200 },
  { name: 'Week 4', xp: 1650 },
  { name: 'Week 5', xp: 2100 },
  { name: 'Week 6', xp: 3450 },
];

const activityData = [
  { name: 'Mon', problems: 2, contests: 0 },
  { name: 'Tue', problems: 4, contests: 0 },
  { name: 'Wed', problems: 1, contests: 0 },
  { name: 'Thu', problems: 5, contests: 1 },
  { name: 'Fri', problems: 3, contests: 0 },
  { name: 'Sat', problems: 8, contests: 1 },
  { name: 'Sun', problems: 6, contests: 0 },
];

export default function Dashboard() {
  return (
    <div className="py-10 space-y-8 animate-in fade-in duration-500">
      {/* Header & Overview */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">Welcome back, Alex!</h1>
          <p className="text-muted-foreground mt-2">Here's your progress and upcoming activities.</p>
        </div>
        <div className="flex items-center gap-3 bg-white px-5 py-2.5 rounded-xl border border-border/50 card-shadow">
          <Flame className="w-5 h-5 text-orange-500 fill-orange-500" />
          <span className="font-semibold text-foreground">14 Day Streak</span>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-white border-border/30 card-shadow overflow-hidden relative rounded-2xl">
          <div className="absolute top-0 right-0 p-4 opacity-5">
            <Star className="w-20 h-20 text-primary" />
          </div>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Current Level</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-foreground">Level 12</div>
            <div className="mt-4 space-y-2">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-primary">3,450 XP</span>
                <span className="text-muted-foreground">4,000 XP to Lvl 13</span>
              </div>
              <Progress value={86} className="h-2.5 bg-primary/15 rounded-full" indicatorClassName="bg-gradient-to-r from-primary to-blue-400 rounded-full" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-border/30 card-shadow rounded-2xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wider flex items-center justify-between">
              Global Rank <Medal className="w-4 h-4 text-primary" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-foreground">#42</div>
            <p className="text-sm text-emerald-600 font-semibold mt-2 flex items-center gap-1">
              <TrendingUp className="w-4 h-4" /> Up 5 places this week
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white border-border/30 card-shadow rounded-2xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wider flex items-center justify-between">
              Active Quests <Target className="w-4 h-4 text-primary" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-foreground">3</div>
            <p className="text-sm text-muted-foreground mt-2">
              1 quest near completion
            </p>
          </CardContent>
        </Card>

        <Card className="gradient-blue text-white border-none card-shadow-lg flex flex-col justify-center relative overflow-hidden rounded-2xl">
          <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
          <div className="absolute top-4 right-4 w-16 h-16 bg-white/5 rounded-full blur-xl"></div>
          <CardContent className="p-6 relative z-10">
            <h3 className="text-xl font-bold mb-2">Daily Question</h3>
            <p className="text-white/75 text-sm mb-4">Solve today's algorithmic challenge to earn +50 XP and maintain your streak.</p>
            <button className="text-sm font-bold bg-white text-primary px-5 py-2.5 rounded-xl inline-flex items-center group transition-all hover:shadow-lg hover:scale-[1.02]">
              Solve Now <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
            </button>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-4">
        {/* XP Growth Chart */}
        <Card className="border-border/30 card-shadow col-span-1 lg:col-span-2 xl:col-span-1 rounded-2xl bg-white">
          <CardHeader>
            <CardTitle className="text-xl font-bold">XP Growth History</CardTitle>
            <CardDescription>Your cumulative experience points over the semester</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={xpData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorXp" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563EB" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} dx={-10} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid hsl(var(--border))', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}
                    itemStyle={{ color: 'hsl(var(--foreground))', fontWeight: 600 }}
                  />
                  <Area
                    type="monotone"
                    dataKey="xp"
                    stroke="#2563EB"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorXp)"
                    activeDot={{ r: 6, fill: '#2563EB', stroke: '#fff', strokeWidth: 2 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Weekly Activity */}
        <Card className="border-border/30 card-shadow col-span-1 lg:col-span-2 xl:col-span-1 rounded-2xl bg-white">
          <CardHeader>
            <CardTitle className="text-xl font-bold">Weekly Activity</CardTitle>
            <CardDescription>Problems solved and contests participated</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={activityData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }} barSize={32}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} dx={-10} />
                  <Tooltip
                    cursor={{ fill: 'hsl(var(--muted)/0.3)', radius: 8 }}
                    contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid hsl(var(--border))', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}
                  />
                  <Bar dataKey="problems" name="Problems Solved" stackId="a" fill="#2563EB" radius={[0, 0, 6, 6]} />
                  <Bar dataKey="contests" name="Contests" stackId="a" fill="#1E40AF" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity List */}
      <Card className="border-border/30 card-shadow rounded-2xl bg-white">
        <CardHeader>
          <CardTitle className="text-xl font-bold">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-5">
            {[
              { title: "Solved 'Two Sum'", time: "2 hours ago", xp: "+15 XP", type: "problem" },
              { title: "Completed Quest: Introduction to React", time: "Yesterday", xp: "+200 XP", type: "quest" },
              { title: "Participated in Weekly Contest #45", time: "2 days ago", xp: "+50 XP", type: "contest" },
              { title: "Earned Badge: 'Algorithm Beginner'", time: "3 days ago", xp: "+100 XP", type: "badge" },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between border-b border-border/30 pb-4 last:border-0 last:pb-0">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${item.type === 'problem' ? 'bg-blue-50 text-blue-600' :
                      item.type === 'quest' ? 'bg-violet-50 text-violet-600' :
                        item.type === 'contest' ? 'bg-orange-50 text-orange-600' :
                          'bg-amber-50 text-amber-600'
                    }`}>
                    {item.type === 'problem' && <Code className="w-5 h-5" />}
                    {item.type === 'quest' && <Target className="w-5 h-5" />}
                    {item.type === 'contest' && <Trophy className="w-5 h-5" />}
                    {item.type === 'badge' && <Medal className="w-5 h-5" />}
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{item.title}</p>
                    <p className="text-xs text-muted-foreground">{item.time}</p>
                  </div>
                </div>
                <div className="font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-lg text-sm">{item.xp}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
