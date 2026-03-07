import React from "react";
import { useState, useEffect } from "react";
import { Card, CardContent } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Search, FileText, FolderOpen, ExternalLink, Youtube, Globe, ChevronDown, ChevronRight, Loader2 } from "lucide-react";
import API_BASE from "../config/api.js";

// Static fallback data
const staticResources = [
  { title: "Complete MERN Stack Roadmap", type: "link", category: "Roadmaps", date: "Sep 2023", url: "https://www.google.com/search?q=MERN+stack+developer+roadmap" },
  { title: "React Hooks Cheatsheet", type: "link", category: "Cheatsheets", date: "Oct 2023", url: "https://www.google.com/search?q=React+hooks+cheatsheet" },
  { title: "Git & GitHub Crash Course", type: "video", category: "Workshop Materials", date: "Aug 2023", url: "https://www.youtube.com/results?search_query=Git+and+GitHub+crash+course" },
  { title: "Top 50 System Design Questions", type: "link", category: "Interview Prep", date: "Jul 2023", url: "https://www.google.com/search?q=Top+50+system+design+interview+questions" },
  { title: "DSA Roadmap for Beginners", type: "link", category: "Roadmaps", date: "Nov 2023", url: "https://www.google.com/search?q=DSA+roadmap+for+beginners" },
  { title: "Dynamic Programming Patterns", type: "video", category: "Interview Prep", date: "Dec 2023", url: "https://www.youtube.com/results?search_query=Dynamic+Programming+patterns+tutorial" },
];

export default function Resources() {
  const [searchQuery, setSearchQuery] = useState("");
  const [backendResources, setBackendResources] = useState([]);
  const [expandedTopLevel, setExpandedTopLevel] = useState({});
  const [expandedSubLevel, setExpandedSubLevel] = useState({});
  const [loading, setLoading] = useState(true);
  const [useBackend, setUseBackend] = useState(false);
  const [activeCategory, setActiveCategory] = useState("All");

  useEffect(() => {
    fetch(`${API_BASE}/api/resources`)
      .then(res => res.json())
      .then(data => {
        if (data.resources && data.resources.length > 0) {
          setBackendResources(data.resources);
          setUseBackend(true);
        }
      })
      .catch(() => { })
      .finally(() => setLoading(false));
  }, []);

  // Build nested structure: "Data Structures > Arrays" → { "Data Structures": { "Arrays": [...] } }
  const buildNestedStructure = (resources) => {
    const nested = {};
    for (const r of resources) {
      const parts = r.category.split(" > ");
      const topLevel = parts[0] || "General";
      const subLevel = parts[1] || "General";
      if (!nested[topLevel]) nested[topLevel] = {};
      if (!nested[topLevel][subLevel]) nested[topLevel][subLevel] = [];
      nested[topLevel][subLevel].push(r);
    }
    return nested;
  };

  const toggleTopLevel = (key) => {
    setExpandedTopLevel(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleSubLevel = (key) => {
    setExpandedSubLevel(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // Backend resources — nested dropdown view
  if (useBackend && backendResources.length > 0) {
    const nested = buildNestedStructure(backendResources);
    const topLevelKeys = Object.keys(nested);

    // Filter by search
    const filteredNested = {};
    for (const [topKey, subs] of Object.entries(nested)) {
      const filteredSubs = {};
      for (const [subKey, items] of Object.entries(subs)) {
        const filtered = searchQuery
          ? items.filter(r => r.title.toLowerCase().includes(searchQuery.toLowerCase()) || subKey.toLowerCase().includes(searchQuery.toLowerCase()))
          : items;
        if (filtered.length > 0) filteredSubs[subKey] = filtered;
      }
      if (Object.keys(filteredSubs).length > 0) filteredNested[topKey] = filteredSubs;
    }

    return (
      <div className="py-10 space-y-10 animate-in fade-in duration-500">
        {/* Header */}
        <div className="bg-card border border-border/50 rounded-3xl p-8 md:p-12 text-center space-y-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-5">
            <FolderOpen className="w-48 h-48" />
          </div>
          <div className="relative z-10 max-w-3xl mx-auto space-y-6">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground">Learning Path</h1>
            <p className="text-muted-foreground text-lg">
              Structured resources organized by topic. Expand each section to access YouTube tutorials and practice links.
            </p>
            <div className="relative max-w-xl mx-auto mt-8">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input type="text" placeholder="Search resources..." value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="pl-12 pr-4 py-6 rounded-full bg-background border-border shadow-sm text-base focus-visible:ring-primary" />
            </div>
          </div>
        </div>

        {/* Nested Dropdowns */}
        <div className="space-y-4 max-w-4xl mx-auto">
          {Object.keys(filteredNested).length === 0 && (
            <div className="text-center py-12">
              <Search className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground">No resources found</h3>
              <p className="text-muted-foreground mt-1">Try a different search term.</p>
            </div>
          )}

          {Object.entries(filteredNested).map(([topKey, subs]) => {
            const isTopExpanded = expandedTopLevel[topKey];
            const totalItems = Object.values(subs).reduce((sum, items) => sum + items.length, 0);

            return (
              <Card key={topKey} className="border-border/50 shadow-sm overflow-hidden">
                {/* Top Level: e.g. "Data Structures" */}
                <button onClick={() => toggleTopLevel(topKey)}
                  className="w-full p-5 flex items-center justify-between hover:bg-muted/30 transition-colors text-left">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                      <FolderOpen className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-bold text-foreground text-lg">{topKey}</h3>
                      <p className="text-xs text-muted-foreground">{Object.keys(subs).length} topics • {totalItems} resources</p>
                    </div>
                  </div>
                  {isTopExpanded ? <ChevronDown className="w-5 h-5 text-muted-foreground" /> : <ChevronRight className="w-5 h-5 text-muted-foreground" />}
                </button>

                {isTopExpanded && (
                  <div className="border-t border-border/40">
                    {Object.entries(subs).map(([subKey, items]) => {
                      const subId = `${topKey}::${subKey}`;
                      const isSubExpanded = expandedSubLevel[subId];

                      return (
                        <div key={subId}>
                          {/* Sub Level: e.g. "Arrays", "Two Pointer" */}
                          <button onClick={() => toggleSubLevel(subId)}
                            className="w-full p-4 pl-10 flex items-center justify-between hover:bg-muted/20 transition-colors text-left border-b border-border/20">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-lg bg-secondary/10 flex items-center justify-center">
                                <FileText className="w-4 h-4 text-secondary" />
                              </div>
                              <div>
                                <h4 className="font-semibold text-foreground">{subKey}</h4>
                                <p className="text-[11px] text-muted-foreground">{items.length} resource{items.length !== 1 ? "s" : ""}</p>
                              </div>
                            </div>
                            {isSubExpanded ? <ChevronDown className="w-4 h-4 text-muted-foreground" /> : <ChevronRight className="w-4 h-4 text-muted-foreground" />}
                          </button>

                          {isSubExpanded && (
                            <div className="divide-y divide-border/20 bg-muted/5">
                              {items.map((resource, idx) => (
                                <div key={resource._id || idx} className="p-4 pl-20 flex items-center gap-4 hover:bg-muted/20 transition-colors group">
                                  <div className="w-8 h-8 rounded-lg bg-background border border-border/50 flex items-center justify-center shrink-0">
                                    {resource.youtubeVideoId ? <Youtube className="w-4 h-4 text-red-500" /> : resource.gfgLink ? <Globe className="w-4 h-4 text-green-500" /> : <FileText className="w-4 h-4 text-blue-500" />}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <h5 className="font-semibold text-foreground text-sm">{resource.title}</h5>
                                    <div className="flex gap-2 mt-1">
                                      <Badge variant="outline" className={`text-[10px] ${resource.difficulty === "Easy" ? "text-green-500 border-green-200" : resource.difficulty === "Medium" ? "text-amber-500 border-amber-200" : "text-red-500 border-red-200"}`}>
                                        {resource.difficulty}
                                      </Badge>
                                    </div>
                                  </div>
                                  <div className="flex gap-2 shrink-0">
                                    {resource.youtubeVideoId && (
                                      <Button variant="outline" size="sm" className="text-red-500 border-red-200 hover:bg-red-50 gap-1 text-xs"
                                        onClick={() => window.open(`https://www.youtube.com/watch?v=${resource.youtubeVideoId}`, "_blank")}>
                                        <Youtube className="w-3 h-3" /> YouTube
                                      </Button>
                                    )}
                                    {resource.gfgLink && (
                                      <Button variant="outline" size="sm" className="text-green-600 border-green-200 hover:bg-green-50 gap-1 text-xs"
                                        onClick={() => window.open(resource.gfgLink, "_blank")}>
                                        <Globe className="w-3 h-3" /> GFG
                                      </Button>
                                    )}
                                    {!resource.youtubeVideoId && !resource.gfgLink && (
                                      <Badge variant="outline" className="text-muted-foreground text-[10px]">No links</Badge>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      </div>
    );
  }

  // Static fallback view (unchanged)
  const allCategories = ["All", ...new Set(staticResources.map(r => r.category))];
  const filteredResources = staticResources.filter(r => {
    const matchCategory = activeCategory === "All" || r.category === activeCategory;
    const matchSearch = searchQuery === "" || r.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchSearch;
  });

  const getIcon = (type) => {
    switch (type) {
      case "video": return <Youtube className="w-6 h-6 text-red-500" />;
      case "link": return <Globe className="w-6 h-6 text-green-500" />;
      default: return <FileText className="w-6 h-6 text-muted-foreground" />;
    }
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
            <Input type="text" placeholder="Search for resources..." value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="pl-12 pr-4 py-6 rounded-full bg-background border-border shadow-sm text-base focus-visible:ring-primary" />
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1 space-y-4">
            <h3 className="font-serif font-bold text-lg px-2">Categories</h3>
            <div className="flex flex-col gap-1">
              {allCategories.map(category => (
                <Button key={category}
                  variant={activeCategory === category ? "secondary" : "ghost"}
                  className={`justify-start w-full ${activeCategory === category ? "bg-primary/10 text-primary font-bold" : "text-foreground/80 hover:text-foreground"}`}
                  onClick={() => setActiveCategory(category)}>
                  {category}
                </Button>
              ))}
            </div>
          </div>

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
                <Card key={idx} className="border-border/50 shadow-sm hover:shadow-md transition-all group cursor-pointer"
                  onClick={() => window.open(resource.url, "_blank", "noopener,noreferrer")}>
                  <CardContent className="p-5 flex gap-4">
                    <div className="w-12 h-12 rounded-xl bg-background border border-border/50 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                      {getIcon(resource.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <Badge variant="secondary" className="mb-2 text-[10px] bg-secondary/10 text-secondary border-none">
                        {resource.category}
                      </Badge>
                      <h3 className="font-bold text-foreground truncate group-hover:text-primary transition-colors">
                        {resource.title}
                      </h3>
                      <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground font-medium">
                        <span>{resource.date}</span>
                        <span>•</span>
                        <span className="inline-flex items-center gap-1">
                          {resource.type === "video" ? <><Youtube className="w-3 h-3 text-red-500" /> YouTube</> : <><Globe className="w-3 h-3 text-green-500" /> Web</>}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-center shrink-0 pl-2">
                      <Button variant="ghost" size="icon" className="rounded-full opacity-0 group-hover:opacity-100 transition-opacity text-primary">
                        <ExternalLink className="w-5 h-5" />
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
      )}
    </div>
  );
}