import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Flame, Medal, Target, Star, ChevronRight, Code, Trophy } from "lucide-react";
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
        <div className="flex items-center gap-3 bg-card px-4 py-2 rounded-full border border-border shadow-sm">
          <Flame className="w-5 h-5 text-orange-500 fill-orange-500" />
          <span className="font-semibold text-foreground">14 Day Streak</span>
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
            <div className="text-4xl font-serif text-foreground">Level 12</div>
            <div className="mt-4 space-y-2">
              <div className="flex justify-between text-xs font-medium">
                <span className="text-primary">3,450 XP</span>
                <span className="text-muted-foreground">4,000 XP to Lvl 13</span>
              </div>
              <Progress value={86} className="h-2 bg-primary/20" indicatorClassName="bg-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border/50 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider flex items-center justify-between">
              Global Rank <Medal className="w-4 h-4 text-primary" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-serif text-foreground">#42</div>
            <p className="text-sm text-green-600 font-medium mt-2 flex items-center">
              ↑ Up 5 places this week
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border/50 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider flex items-center justify-between">
              Active Quests <Target className="w-4 h-4 text-primary" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-serif text-foreground">3</div>
            <p className="text-sm text-muted-foreground mt-2">
              1 quest near completion
            </p>
          </CardContent>
        </Card>

        <Card className="bg-secondary text-secondary-foreground border-none shadow-md flex flex-col justify-center relative overflow-hidden">
          <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
          <CardContent className="p-6 relative z-10">
            <h3 className="font-serif text-xl mb-2">Daily Question</h3>
            <p className="text-secondary-foreground/80 text-sm mb-4">Solve today's algorithmic challenge to earn +50 XP and maintain your streak.</p>
            <button className="text-sm font-bold bg-white text-secondary px-4 py-2 rounded-full inline-flex items-center group transition-all hover:bg-primary hover:text-white">
              Solve Now <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
            </button>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-4">
        {/* XP Growth Chart */}
        <Card className="border-border/50 shadow-sm col-span-1 lg:col-span-2 xl:col-span-1">
          <CardHeader>
            <CardTitle className="font-serif text-xl">XP Growth History</CardTitle>
            <CardDescription>Your cumulative experience points over the semester</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={xpData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorXp" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: 'hsl(var(--muted-foreground))', fontSize: 12}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: 'hsl(var(--muted-foreground))', fontSize: 12}} dx={-10} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'hsl(var(--card))', borderRadius: '8px', border: '1px solid hsl(var(--border))', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}
                    itemStyle={{ color: 'hsl(var(--foreground))', fontWeight: 500 }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="xp" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={3}
                    fillOpacity={1} 
                    fill="url(#colorXp)" 
                    activeDot={{ r: 6, fill: 'hsl(var(--primary))', stroke: 'hsl(var(--background))', strokeWidth: 2 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Weekly Activity */}
        <Card className="border-border/50 shadow-sm col-span-1 lg:col-span-2 xl:col-span-1">
          <CardHeader>
            <CardTitle className="font-serif text-xl">Weekly Activity</CardTitle>
            <CardDescription>Problems solved and contests participated</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={activityData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }} barSize={32}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: 'hsl(var(--muted-foreground))', fontSize: 12}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: 'hsl(var(--muted-foreground))', fontSize: 12}} dx={-10} />
                  <Tooltip 
                    cursor={{fill: 'hsl(var(--muted)/0.4)'}}
                    contentStyle={{ backgroundColor: 'hsl(var(--card))', borderRadius: '8px', border: '1px solid hsl(var(--border))' }}
                  />
                  <Bar dataKey="problems" name="Problems Solved" stackId="a" fill="hsl(var(--primary))" radius={[0, 0, 4, 4]} />
                  <Bar dataKey="contests" name="Contests" stackId="a" fill="hsl(var(--secondary))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity List */}
      <Card className="border-border/50 shadow-sm">
        <CardHeader>
          <CardTitle className="font-serif text-xl">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {[
              { title: "Solved 'Two Sum'", time: "2 hours ago", xp: "+15 XP", type: "problem" },
              { title: "Completed Quest: Introduction to React", time: "Yesterday", xp: "+200 XP", type: "quest" },
              { title: "Participated in Weekly Contest #45", time: "2 days ago", xp: "+50 XP", type: "contest" },
              { title: "Earned Badge: 'Algorithm Beginner'", time: "3 days ago", xp: "+100 XP", type: "badge" },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between border-b border-border/40 pb-4 last:border-0 last:pb-0">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    item.type === 'problem' ? 'bg-blue-100 text-blue-600' :
                    item.type === 'quest' ? 'bg-purple-100 text-purple-600' :
                    item.type === 'contest' ? 'bg-orange-100 text-orange-600' :
                    'bg-yellow-100 text-yellow-600'
                  }`}>
                    {item.type === 'problem' && <Code className="w-5 h-5" />}
                    {item.type === 'quest' && <Target className="w-5 h-5" />}
                    {item.type === 'contest' && <Trophy className="w-5 h-5" />}
                    {item.type === 'badge' && <Medal className="w-5 h-5" />}
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{item.title}</p>
                    <p className="text-xs text-muted-foreground">{item.time}</p>
                  </div>
                </div>
                <div className="font-bold text-green-600">{item.xp}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
