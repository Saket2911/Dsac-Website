import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Edit2, Medal, Code, Trophy, Target, Settings, LogOut, Github, Linkedin, Mail } from "lucide-react";

export default function Profile() {
  return (
    <div className="py-10 animate-in fade-in duration-500 max-w-5xl mx-auto">
      {/* Profile Header */}
      <div className="relative mb-16">
        <div className="h-48 md:h-64 w-full rounded-2xl gradient-blue relative overflow-hidden">
          {/* Abstract pattern bg */}
          <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, hsl(var(--primary)) 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>
        </div>

        <div className="absolute -bottom-12 left-8 md:left-12 flex items-end gap-6">
          <div className="relative">
            <Avatar className="h-28 w-28 md:h-32 md:w-32 border-4 border-background bg-background shadow-xl">
              <AvatarFallback className="bg-primary/10 text-primary text-4xl font-bold">AJ</AvatarFallback>
            </Avatar>
            <button className="absolute bottom-0 right-0 p-2 rounded-full bg-primary text-white shadow-md hover:bg-secondary transition-colors">
              <Edit2 className="w-4 h-4" />
            </button>
          </div>
          <div className="mb-2 hidden md:block pb-12">
            <h1 className="text-3xl font-bold text-foreground">Alex Johnson</h1>
            <p className="text-muted-foreground font-medium flex items-center gap-2">
              B.Tech Computer Science <span className="w-1.5 h-1.5 rounded-full bg-border"></span> Year 3
            </p>
          </div>
        </div>

        <div className="absolute bottom-4 right-8 flex gap-3">
          <Button variant="outline" className="bg-background/80 backdrop-blur text-foreground border-border/50 gap-2">
            <Settings className="w-4 h-4" /> Settings
          </Button>
        </div>
      </div>

      {/* Mobile Title (shows only on small screens) */}
      <div className="mb-8 px-4 md:hidden text-center mt-16">
        <h1 className="text-2xl font-bold text-foreground">Alex Johnson</h1>
        <p className="text-muted-foreground text-sm">B.Tech Computer Science • Year 3</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Stats & Links */}
        <div className="space-y-6">
          <Card className="border-border/30 card-shadow rounded-2xl bg-white">
            <CardContent className="p-6">
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between items-end mb-2">
                    <span className="font-bold text-lg">Level 12</span>
                    <span className="text-sm font-bold text-primary">3,450 XP</span>
                  </div>
                  <Progress value={86} className="h-2.5 bg-primary/15 rounded-full" />
                  <p className="text-xs text-muted-foreground text-right mt-2">550 XP to next level</p>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border/40">
                  <div className="text-center p-3 bg-muted/30 rounded-xl border border-border/30">
                    <div className="text-2xl font-bold text-foreground mb-1">42</div>
                    <div className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Global Rank</div>
                  </div>
                  <div className="text-center p-3 bg-muted/30 rounded-xl border border-border/30">
                    <div className="text-2xl font-bold text-orange-500 flex items-center justify-center gap-1">
                      14 <span className="text-sm text-orange-500">🔥</span>
                    </div>
                    <div className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Day Streak</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/30 card-shadow rounded-2xl bg-white">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Connect</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3 text-sm text-foreground/80 hover:text-primary transition-colors cursor-pointer p-2 rounded-lg hover:bg-primary/5">
                <Github className="w-5 h-5" /> github.com/alexj
              </div>
              <div className="flex items-center gap-3 text-sm text-foreground/80 hover:text-primary transition-colors cursor-pointer p-2 rounded-lg hover:bg-primary/5">
                <Linkedin className="w-5 h-5" /> linkedin.com/in/alexjohnson
              </div>
              <div className="flex items-center gap-3 text-sm text-foreground/80 hover:text-primary transition-colors cursor-pointer p-2 rounded-lg hover:bg-primary/5">
                <Mail className="w-5 h-5" /> alex.j@university.edu
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Tabs */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="achievements" className="w-full">
            <TabsList className="w-full flex justify-start bg-transparent border-b border-border rounded-none h-auto p-0 gap-6">
              <TabsTrigger
                value="achievements"
                className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-2 py-3 font-medium text-base"
              >
                Achievements
              </TabsTrigger>
              <TabsTrigger
                value="history"
                className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-2 py-3 font-medium text-base"
              >
                Activity History
              </TabsTrigger>
              <TabsTrigger
                value="edit"
                className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-2 py-3 font-medium text-base ml-auto"
              >
                Edit Profile
              </TabsTrigger>
            </TabsList>

            <TabsContent value="achievements" className="pt-6 space-y-6">
              <div>
                <h3 className="text-xl font-bold text-foreground mb-4">Badges Earned (5)</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {[
                    { name: "First Blood", icon: "🩸", desc: "Solved first daily question" },
                    { name: "7 Day Streak", icon: "🔥", desc: "Maintained a 7-day streak" },
                    { name: "Contest Rookie", icon: "🏁", desc: "Participated in first contest" },
                    { name: "Top 50", icon: "🏆", desc: "Reached top 50 in leaderboard" },
                    { name: "React Novice", icon: "⚛️", desc: "Completed React basics quest" }
                  ].map((badge, i) => (
                    <div key={i} className="bg-white border border-border/30 rounded-2xl p-4 text-center hover:shadow-md card-shadow transition-shadow group">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary/10 to-blue-400/20 mx-auto flex items-center justify-center text-3xl mb-3 border border-primary/15 group-hover:scale-110 transition-transform">
                        {badge.icon}
                      </div>
                      <h4 className="font-bold text-sm text-foreground">{badge.name}</h4>
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{badge.desc}</p>
                    </div>
                  ))}

                  {/* Locked badge placeholder */}
                  <div className="bg-muted/30 border border-border/30 border-dashed rounded-2xl p-4 text-center opacity-60">
                    <div className="w-16 h-16 rounded-full bg-muted mx-auto flex items-center justify-center text-xl mb-3">
                      🔒
                    </div>
                    <h4 className="font-medium text-sm text-muted-foreground">Locked</h4>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="history" className="pt-6">
              <Card className="border-border/30 card-shadow rounded-2xl bg-white">
                <CardContent className="p-0">
                  <div className="divide-y divide-border/40">
                    {[
                      { title: "Solved 'Two Sum'", time: "Oct 12, 2023", xp: "+15 XP", type: "problem" },
                      { title: "Completed Quest: Introduction to React", time: "Oct 10, 2023", xp: "+200 XP", type: "quest" },
                      { title: "Participated in Weekly Contest #45", time: "Oct 7, 2023", xp: "+50 XP", type: "contest" },
                      { title: "Earned Badge: 'Algorithm Beginner'", time: "Oct 5, 2023", xp: "+100 XP", type: "badge" },
                      { title: "Solved 'Valid Palindrome'", time: "Oct 4, 2023", xp: "+15 XP", type: "problem" },
                    ].map((item, i) => (
                      <div key={i} className="p-4 sm:p-6 flex items-center justify-between hover:bg-muted/20 transition-colors">
                        <div className="flex items-center gap-4">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${item.type === 'problem' ? 'bg-blue-100 text-blue-600' :
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
                            <p className="font-medium text-foreground text-sm sm:text-base">{item.title}</p>
                            <p className="text-xs text-muted-foreground">{item.time}</p>
                          </div>
                        </div>
                        <div className="font-bold text-green-600 text-sm sm:text-base shrink-0">{item.xp}</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="edit" className="pt-6">
              <Card className="border-border/30 card-shadow rounded-2xl bg-white">
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input id="firstName" defaultValue="Alex" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input id="lastName" defaultValue="Johnson" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">University Email</Label>
                      <Input id="email" type="email" defaultValue="alex.j@university.edu" disabled />
                      <p className="text-xs text-muted-foreground">Email cannot be changed.</p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="year">Year of Study</Label>
                      <Input id="year" defaultValue="Year 3" />
                    </div>
                  </div>

                  <div className="space-y-2 pt-4 border-t border-border/40">
                    <Label htmlFor="github">GitHub Profile URL</Label>
                    <Input id="github" defaultValue="https://github.com/alexj" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="linkedin">LinkedIn Profile URL</Label>
                    <Input id="linkedin" defaultValue="https://linkedin.com/in/alexjohnson" />
                  </div>

                  <div className="flex justify-end gap-4 pt-6">
                    <Button variant="outline">Cancel</Button>
                    <Button className="gradient-blue text-white rounded-xl shadow-sm hover:shadow-md transition-all">Save Changes</Button>
                  </div>
                </CardContent>
              </Card>

              <div className="mt-8 flex justify-center">
                <Button variant="ghost" className="text-destructive hover:bg-destructive/10 hover:text-destructive gap-2">
                  <LogOut className="w-4 h-4" /> Sign Out
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
