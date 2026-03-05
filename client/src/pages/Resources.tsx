import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  FileText,
  Video,
  Link as LinkIcon,
  FolderOpen,
  ChevronRight,
  ExternalLink,
  Youtube,
  Globe,
} from "lucide-react";

interface Resource {
  title: string;
  type: "document" | "video" | "link";
  category: string;
  date: string;
  size: string;
  url: string;
}

export default function Resources() {
  const categories = ["All", "Roadmaps", "Cheatsheets", "Workshop Materials", "Interview Prep"];
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const resources: Resource[] = [
    {
      title: "Complete MERN Stack Roadmap",
      type: "link",
      category: "Roadmaps",
      date: "Sep 2023",
      size: "External",
      url: "https://www.google.com/search?q=MERN+stack+developer+roadmap",
    },
    {
      title: "React Hooks Cheatsheet",
      type: "link",
      category: "Cheatsheets",
      date: "Oct 2023",
      size: "External",
      url: "https://www.google.com/search?q=React+hooks+cheatsheet",
    },
    {
      title: "Git & GitHub Crash Course",
      type: "video",
      category: "Workshop Materials",
      date: "Aug 2023",
      size: "Video",
      url: "https://www.youtube.com/results?search_query=Git+and+GitHub+crash+course",
    },
    {
      title: "Top 50 System Design Questions",
      type: "link",
      category: "Interview Prep",
      date: "Jul 2023",
      size: "External",
      url: "https://www.google.com/search?q=Top+50+system+design+interview+questions",
    },
    {
      title: "Tailwind CSS Utility Guide",
      type: "link",
      category: "Cheatsheets",
      date: "Oct 2023",
      size: "External",
      url: "https://tailwindcss.com/docs",
    },
    {
      title: "Introduction to Docker",
      type: "video",
      category: "Workshop Materials",
      date: "Sep 2023",
      size: "Video",
      url: "https://www.youtube.com/results?search_query=Introduction+to+Docker+tutorial",
    },
    {
      title: "DSA Roadmap for Beginners",
      type: "link",
      category: "Roadmaps",
      date: "Nov 2023",
      size: "External",
      url: "https://www.google.com/search?q=DSA+roadmap+for+beginners",
    },
    {
      title: "Dynamic Programming Patterns",
      type: "video",
      category: "Interview Prep",
      date: "Dec 2023",
      size: "Video",
      url: "https://www.youtube.com/results?search_query=Dynamic+Programming+patterns+tutorial",
    },
    {
      title: "Full Stack Development Roadmap 2024",
      type: "link",
      category: "Roadmaps",
      date: "Jan 2024",
      size: "External",
      url: "https://www.google.com/search?q=Full+stack+developer+roadmap+2024",
    },
    {
      title: "Behavioral Interview Prep Guide",
      type: "link",
      category: "Interview Prep",
      date: "Feb 2024",
      size: "External",
      url: "https://www.google.com/search?q=behavioral+interview+questions+for+software+engineers",
    },
    {
      title: "Node.js Best Practices",
      type: "video",
      category: "Workshop Materials",
      date: "Mar 2024",
      size: "Video",
      url: "https://www.youtube.com/results?search_query=Node.js+best+practices+2024",
    },
    {
      title: "SQL vs NoSQL Databases",
      type: "link",
      category: "Cheatsheets",
      date: "Apr 2024",
      size: "External",
      url: "https://www.google.com/search?q=SQL+vs+NoSQL+comparison+guide",
    },
  ];

  const filteredResources = resources.filter((r) => {
    const matchCategory = activeCategory === "All" || r.category === activeCategory;
    const matchSearch =
      searchQuery === "" ||
      r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchSearch;
  });

  const getIcon = (type: string) => {
    switch (type) {
      case "document":
        return <FileText className="w-6 h-6 text-blue-500" />;
      case "video":
        return <Youtube className="w-6 h-6 text-red-500" />;
      case "link":
        return <Globe className="w-6 h-6 text-green-500" />;
      default:
        return <FileText className="w-6 h-6 text-muted-foreground" />;
    }
  };

  const getActionIcon = (type: string) => {
    switch (type) {
      case "video":
        return <Youtube className="w-5 h-5" />;
      default:
        return <ExternalLink className="w-5 h-5" />;
    }
  };

  const handleResourceClick = (resource: Resource) => {
    window.open(resource.url, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="py-10 space-y-10 animate-in fade-in duration-500">
      <div className="bg-card border border-border/50 rounded-3xl p-8 md:p-12 text-center space-y-6 relative overflow-hidden">
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
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 pr-4 py-6 rounded-full bg-background border-border shadow-sm text-base focus-visible:ring-primary"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Categories Sidebar */}
        <div className="lg:col-span-1 space-y-4">
          <h3 className="font-serif font-bold text-lg px-2">Categories</h3>
          <div className="flex flex-col gap-1">
            {categories.map((category) => (
              <Button
                key={category}
                variant={activeCategory === category ? "secondary" : "ghost"}
                className={`justify-start w-full ${activeCategory === category
                    ? "bg-primary/10 text-primary font-bold"
                    : "text-foreground/80 hover:text-foreground"
                  }`}
                onClick={() => setActiveCategory(category)}
              >
                {category}
              </Button>
            ))}
          </div>

          <Card className="border-border/50 shadow-sm mt-8 bg-gradient-to-b from-card to-background">
            <CardContent className="p-6 text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-primary/20 mx-auto flex items-center justify-center">
                <span className="text-xl">💡</span>
              </div>
              <h4 className="font-bold">Contribute</h4>
              <p className="text-sm text-muted-foreground">
                Have a great resource to share with the community?
              </p>
              <Button
                variant="outline"
                className="w-full border-primary/50 text-primary hover:bg-primary/5"
              >
                Submit Resource
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Resources List */}
        <div className="lg:col-span-3 space-y-4">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-serif font-bold text-foreground">
              {activeCategory === "All" ? "All Resources" : activeCategory}
            </h2>
            <span className="text-sm text-muted-foreground">
              Showing {filteredResources.length} result{filteredResources.length !== 1 ? "s" : ""}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredResources.map((resource, idx) => (
              <Card
                key={idx}
                className="border-border/50 shadow-sm hover:shadow-md transition-all group cursor-pointer"
                onClick={() => handleResourceClick(resource)}
              >
                <CardContent className="p-5 flex gap-4">
                  <div className="w-12 h-12 rounded-xl bg-background border border-border/50 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                    {getIcon(resource.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <Badge
                      variant="secondary"
                      className="mb-2 text-[10px] bg-secondary/10 text-secondary border-none"
                    >
                      {resource.category}
                    </Badge>
                    <h3 className="font-bold text-foreground truncate group-hover:text-primary transition-colors">
                      {resource.title}
                    </h3>
                    <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground font-medium">
                      <span>{resource.date}</span>
                      <span>•</span>
                      <span className="inline-flex items-center gap-1">
                        {resource.type === "video" ? (
                          <><Youtube className="w-3 h-3 text-red-500" /> YouTube</>
                        ) : (
                          <><Globe className="w-3 h-3 text-green-500" /> Web</>
                        )}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-center shrink-0 pl-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="rounded-full opacity-0 group-hover:opacity-100 transition-opacity text-primary"
                    >
                      {getActionIcon(resource.type)}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredResources.length === 0 && (
            <div className="text-center py-12">
              <Search className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground">No resources found</h3>
              <p className="text-muted-foreground mt-1">Try a different search or category.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
