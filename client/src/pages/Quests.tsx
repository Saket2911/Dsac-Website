import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Target, Lock, CheckCircle2, ChevronRight } from "lucide-react";

export default function Quests() {
  return (
    <div className="py-10 space-y-10 animate-in fade-in duration-500">
      <div className="text-center max-w-2xl mx-auto space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold text-foreground">Skill Quests</h1>
        <p className="text-muted-foreground text-lg">
          Follow curated paths to master new technologies. Complete quests to earn exclusive badges and massive XP.
        </p>
      </div>

      {/* Active Quest */}
      <div className="mt-12">
        <h3 className="text-xl font-bold text-foreground mb-4">Continue Your Journey</h3>
        <Card className="border-primary/30 card-shadow-lg bg-white overflow-hidden rounded-2xl">
          <div className="h-2 w-full bg-primary/20">
            <div className="h-full bg-primary" style={{ width: '60%' }}></div>
          </div>
          <CardContent className="p-6 md:p-8 flex flex-col md:flex-row gap-8 items-center">
            <div className="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center shrink-0 border-4 border-blue-200">
              <span className="text-4xl">⚛️</span>
            </div>
            <div className="flex-1 space-y-3 text-center md:text-left">
              <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
                <h2 className="text-2xl font-bold">Frontend Mastery: React</h2>
                <Badge className="bg-primary text-primary-foreground self-center md:self-auto">+500 XP Reward</Badge>
              </div>
              <p className="text-muted-foreground">Master the fundamentals of React including components, state management, hooks, and routing.</p>

              <div className="pt-2 space-y-2">
                <div className="flex justify-between text-sm font-medium">
                  <span className="text-foreground">Progress</span>
                  <span className="text-primary">60% (3/5 Modules)</span>
                </div>
                <Progress value={60} className="h-2.5" />
              </div>
            </div>
            <div className="shrink-0 w-full md:w-auto">
              <Button size="lg" className="w-full md:w-auto gradient-blue text-white rounded-xl shadow-sm hover:shadow-md transition-all">
                Resume Quest
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quest Library */}
      <div className="mt-12">
        <div className="flex justify-between items-end mb-6">
          <h3 className="text-xl font-bold text-foreground">Quest Library</h3>
          <div className="flex gap-2">
            <Badge variant="outline" className="cursor-pointer bg-background">All</Badge>
            <Badge variant="secondary" className="cursor-pointer">Frontend</Badge>
            <Badge variant="outline" className="cursor-pointer bg-background">Backend</Badge>
            <Badge variant="outline" className="cursor-pointer bg-background">DSA</Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Completed Quest */}
          <Card className="border-border/30 card-shadow opacity-80 hover:opacity-100 transition-opacity rounded-2xl bg-white">
            <CardHeader className="pb-3 relative">
              <div className="absolute top-4 right-4 bg-green-100 text-green-700 rounded-full p-1">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center mb-4">
                <span className="text-2xl">🌐</span>
              </div>
              <CardTitle>HTML & CSS Foundations</CardTitle>
              <CardDescription>The building blocks of the web</CardDescription>
            </CardHeader>
            <CardContent>
              <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50 w-full justify-center py-1">
                Completed
              </Badge>
            </CardContent>
          </Card>

          {/* Available Quests */}
          {[
            { title: "Backend with Node.js", icon: "🟢", desc: "Build robust APIs and server-side applications.", xp: 600, tag: "Backend" },
            { title: "Database Design", icon: "🗄️", desc: "Learn SQL, MongoDB, and schema design principles.", xp: 450, tag: "Backend" },
            { title: "Algorithms 101", icon: "🧠", desc: "Sorting, searching, and fundamental algorithms.", xp: 800, tag: "DSA" },
            { title: "Data Structures", icon: "📚", desc: "Arrays, LinkedLists, Trees, and Graphs.", xp: 800, tag: "DSA" },
          ].map((quest, i) => (
            <Card key={i} className="border-border/30 card-shadow hover:shadow-lg transition-all duration-300 group flex flex-col rounded-2xl bg-white">
              <CardHeader className="pb-3 flex-1">
                <div className="flex justify-between items-start mb-4">
                  <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center">
                    <span className="text-2xl">{quest.icon}</span>
                  </div>
                  <Badge variant="secondary" className="font-mono text-xs">{quest.tag}</Badge>
                </div>
                <CardTitle className="group-hover:text-primary transition-colors">{quest.title}</CardTitle>
                <CardDescription className="mt-2 line-clamp-2">{quest.desc}</CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-center justify-between border-t border-border/40 pt-4 mt-2">
                  <div className="text-sm font-bold text-primary flex items-center gap-1">
                    <Target className="w-4 h-4" /> +{quest.xp} XP
                  </div>
                  <Button variant="ghost" size="sm" className="rounded-xl px-4 -mr-2 group-hover:bg-primary/10 group-hover:text-primary">
                    Start <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}

          {/* Locked Quest */}
          <Card className="border-border/20 bg-muted/20 shadow-none rounded-2xl">
            <CardHeader className="pb-3 relative opacity-60">
              <div className="w-12 h-12 rounded-xl bg-slate-200 flex items-center justify-center mb-4">
                <span className="text-2xl opacity-50">☁️</span>
              </div>
              <CardTitle>Cloud Deployment</CardTitle>
              <CardDescription>Deploying applications to AWS/GCP</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 text-sm text-muted-foreground bg-background px-3 py-2 rounded-md border border-border">
                <Lock className="w-4 h-4" /> Requires 'Backend with Node.js'
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
