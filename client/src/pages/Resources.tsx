import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Download, FileText, Video, Link as LinkIcon, FolderOpen, ChevronRight } from "lucide-react";

export default function Resources() {
  const categories = ["All", "Roadmaps", "Cheatsheets", "Workshop Materials", "Interview Prep"];

  const resources = [
    { title: "Complete MERN Stack Roadmap", type: "document", category: "Roadmaps", date: "Sep 2023", size: "2.4 MB" },
    { title: "React Hooks Cheatsheet", type: "document", category: "Cheatsheets", date: "Oct 2023", size: "1.1 MB" },
    { title: "Git & GitHub Crash Course", type: "video", category: "Workshop Materials", date: "Aug 2023", size: "145 MB" },
    { title: "Top 50 System Design Questions", type: "document", category: "Interview Prep", date: "Jul 2023", size: "3.2 MB" },
    { title: "Tailwind CSS Utility Guide", type: "link", category: "Cheatsheets", date: "Oct 2023", size: "External" },
    { title: "Introduction to Docker", type: "video", category: "Workshop Materials", date: "Sep 2023", size: "210 MB" },
  ];

  const getIcon = (type: string) => {
    switch (type) {
      case 'document': return <FileText className="w-6 h-6 text-blue-500" />;
      case 'video': return <Video className="w-6 h-6 text-red-500" />;
      case 'link': return <LinkIcon className="w-6 h-6 text-green-500" />;
      default: return <FileText className="w-6 h-6 text-muted-foreground" />;
    }
  };

  return (
    <div className="py-10 space-y-10 animate-in fade-in duration-500">
      <div className="bg-white border border-border/30 rounded-2xl p-8 md:p-12 text-center space-y-6 relative overflow-hidden card-shadow">
        <div className="absolute top-0 right-0 p-8 opacity-5">
          <FolderOpen className="w-48 h-48" />
        </div>
        <div className="relative z-10 max-w-3xl mx-auto space-y-6">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground">Resource Library</h1>
          <p className="text-muted-foreground text-lg">
            Curated materials, roadmaps, and recorded sessions to support your learning journey.
          </p>
          <div className="relative max-w-xl mx-auto mt-8">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search for resources..."
              className="pl-12 pr-4 py-6 rounded-xl bg-muted/30 border-border/50 shadow-sm text-base focus-visible:ring-primary"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Categories Sidebar */}
        <div className="lg:col-span-1 space-y-4">
          <h3 className="font-bold text-lg px-2">Categories</h3>
          <div className="flex flex-col gap-1">
            {categories.map((category, idx) => (
              <Button
                key={idx}
                variant={idx === 0 ? "secondary" : "ghost"}
                className={`justify-start w-full ${idx === 0 ? 'bg-primary/10 text-primary font-bold' : 'text-foreground/80 hover:text-foreground'}`}
              >
                {category}
              </Button>
            ))}
          </div>

          <Card className="border-border/30 card-shadow mt-8 bg-gradient-to-b from-white to-muted/20 rounded-2xl">
            <CardContent className="p-6 text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-primary/20 mx-auto flex items-center justify-center">
                <span className="text-xl">💡</span>
              </div>
              <h4 className="font-bold">Contribute</h4>
              <p className="text-sm text-muted-foreground">Have a great resource to share with the community?</p>
              <Button variant="outline" className="w-full border-primary/50 text-primary hover:bg-primary/5">
                Submit Resource
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Resources List */}
        <div className="lg:col-span-3 space-y-4">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-foreground">All Resources</h2>
            <span className="text-sm text-muted-foreground">Showing 6 results</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {resources.map((resource, idx) => (
              <Card key={idx} className="border-border/30 card-shadow hover:shadow-lg transition-all group cursor-pointer rounded-2xl bg-white">
                <CardContent className="p-5 flex gap-4">
                  <div className="w-12 h-12 rounded-xl bg-background border border-border/50 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                    {getIcon(resource.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <Badge variant="secondary" className="mb-2 text-[10px] bg-secondary/10 text-secondary border-none">{resource.category}</Badge>
                    <h3 className="font-bold text-foreground truncate group-hover:text-primary transition-colors">
                      {resource.title}
                    </h3>
                    <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground font-medium">
                      <span>{resource.date}</span>
                      <span>•</span>
                      <span>{resource.size}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-center shrink-0 pl-2">
                    <Button variant="ghost" size="icon" className="rounded-full opacity-0 group-hover:opacity-100 transition-opacity text-primary">
                      {resource.type === 'link' ? <ChevronRight className="w-5 h-5" /> : <Download className="w-5 h-5" />}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
