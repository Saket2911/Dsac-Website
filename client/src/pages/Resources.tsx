import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  FolderOpen,
  ChevronDown,
  ChevronRight,
  ExternalLink,
  Youtube,
  Globe,
  BookOpen,
  Loader2,
  Play,
} from "lucide-react";

interface Topic {
  _id: string;
  title: string;
  youtubePlaylistId: string;
  difficulty: string;
  order: number;
  gfgArticleUrl?: string;
  documentationLinks?: string[];
}

interface ResourcePathData {
  _id: string;
  title: string;
  description: string;
  topics: Topic[];
}

interface VideoItem {
  title: string;
  description: string;
  thumbnail: string;
  videoId: string;
  videoUrl: string;
  position: number;
}

export default function Resources() {
  const [paths, setPaths] = useState<ResourcePathData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedPath, setExpandedPath] = useState<string | null>(null);
  const [expandedTopic, setExpandedTopic] = useState<string | null>(null);
  const [topicVideos, setTopicVideos] = useState<Record<string, VideoItem[]>>({});
  const [loadingVideos, setLoadingVideos] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/resources")
      .then((res) => res.json())
      .then((data) => setPaths(data.paths || []))
      .catch(() => setPaths([]))
      .finally(() => setLoading(false));
  }, []);

  const fetchVideos = async (playlistId: string) => {
    if (topicVideos[playlistId]) return;
    setLoadingVideos(playlistId);
    try {
      const res = await fetch(`/api/resources/topic/${playlistId}/videos`);
      const data = await res.json();
      setTopicVideos((prev) => ({ ...prev, [playlistId]: data.videos || [] }));
    } catch {
      setTopicVideos((prev) => ({ ...prev, [playlistId]: [] }));
    }
    setLoadingVideos(null);
  };

  const togglePath = (id: string) => {
    setExpandedPath(expandedPath === id ? null : id);
  };

  const toggleTopic = (topicId: string, playlistId: string) => {
    if (expandedTopic === topicId) {
      setExpandedTopic(null);
    } else {
      setExpandedTopic(topicId);
      if (playlistId) fetchVideos(playlistId);
    }
  };

  const difficultyColor = (d: string) => {
    switch (d) {
      case "beginner": return "text-green-500 bg-green-500/10 border-green-500/30";
      case "intermediate": return "text-amber-500 bg-amber-500/10 border-amber-500/30";
      case "advanced": return "text-red-500 bg-red-500/10 border-red-500/30";
      default: return "text-muted-foreground";
    }
  };

  const pathIcon = (title: string) => {
    if (title.toLowerCase().includes("data structure")) return "🏗️";
    if (title.toLowerCase().includes("algorithm")) return "⚡";
    if (title.toLowerCase().includes("competitive")) return "🏆";
    return "📚";
  };

  // Filter paths/topics by search
  const filteredPaths = paths.map((p) => ({
    ...p,
    topics: p.topics.filter((t) =>
      searchQuery === "" ||
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.title.toLowerCase().includes(searchQuery.toLowerCase())
    ),
  })).filter((p) => p.topics.length > 0 || searchQuery === "");

  return (
    <div className="py-10 space-y-10 animate-in fade-in duration-500">
      {/* Hero */}
      <div className="bg-card border border-border/50 rounded-3xl p-8 md:p-12 text-center space-y-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-5">
          <FolderOpen className="w-48 h-48" />
        </div>
        <div className="relative z-10 max-w-3xl mx-auto space-y-6">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground">Learning Paths</h1>
          <p className="text-muted-foreground text-lg">
            Structured learning paths with YouTube tutorials, GeeksforGeeks articles, and reference documentation.
          </p>
          <div className="relative max-w-xl mx-auto mt-8">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search topics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 pr-4 py-6 rounded-full bg-background border-border shadow-sm text-base focus-visible:ring-primary"
            />
          </div>
        </div>
      </div>

      {/* Loading */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <span className="ml-3 text-muted-foreground">Loading learning paths...</span>
        </div>
      ) : filteredPaths.length === 0 ? (
        <div className="text-center py-12">
          <BookOpen className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground">No resources found</h3>
          <p className="text-muted-foreground mt-1">
            {searchQuery ? "Try a different search term." : "Resources haven't been configured yet. Run the seed script."}
          </p>
        </div>
      ) : (
        <div className="space-y-6 max-w-5xl mx-auto">
          {filteredPaths.map((path) => (
            <Card key={path._id} className="border-border/50 shadow-sm overflow-hidden">
              {/* Path Header */}
              <button
                className="w-full p-6 flex items-center justify-between gap-4 hover:bg-muted/20 transition-colors text-left"
                onClick={() => togglePath(path._id)}
              >
                <div className="flex items-center gap-4">
                  <div className="text-4xl">{pathIcon(path.title)}</div>
                  <div>
                    <h2 className="text-xl font-bold text-foreground">{path.title}</h2>
                    <p className="text-sm text-muted-foreground mt-1">{path.description}</p>
                    <Badge variant="secondary" className="mt-2 text-[10px]">
                      {path.topics.length} topics
                    </Badge>
                  </div>
                </div>
                {expandedPath === path._id ? (
                  <ChevronDown className="w-5 h-5 text-muted-foreground shrink-0" />
                ) : (
                  <ChevronRight className="w-5 h-5 text-muted-foreground shrink-0" />
                )}
              </button>

              {/* Topics List */}
              {expandedPath === path._id && (
                <div className="border-t border-border/40">
                  {path.topics
                    .sort((a, b) => a.order - b.order)
                    .map((topic, idx) => (
                      <div key={topic._id} className="border-b border-border/20 last:border-b-0">
                        {/* Topic row */}
                        <button
                          className="w-full px-6 py-4 flex items-center justify-between gap-4 hover:bg-muted/10 transition-colors text-left"
                          onClick={() => toggleTopic(topic._id, topic.youtubePlaylistId)}
                        >
                          <div className="flex items-center gap-4">
                            <span className="text-sm font-mono text-muted-foreground w-6">{idx + 1}.</span>
                            <div>
                              <h3 className="font-semibold text-foreground">{topic.title}</h3>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge variant="outline" className={`text-[10px] capitalize ${difficultyColor(topic.difficulty)}`}>
                                  {topic.difficulty}
                                </Badge>
                                {topic.youtubePlaylistId && (
                                  <span className="inline-flex items-center gap-1 text-[10px] text-red-500">
                                    <Youtube className="w-3 h-3" /> Playlist
                                  </span>
                                )}
                                {topic.gfgArticleUrl && (
                                  <span className="inline-flex items-center gap-1 text-[10px] text-green-500">
                                    <Globe className="w-3 h-3" /> GFG
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                          {expandedTopic === topic._id ? (
                            <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" />
                          ) : (
                            <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
                          )}
                        </button>

                        {/* Topic content expanded */}
                        {expandedTopic === topic._id && (
                          <div className="px-6 pb-4 space-y-4 bg-muted/5">
                            {/* Links */}
                            <div className="flex flex-wrap gap-3 pt-2">
                              {topic.youtubePlaylistId && (
                                <a
                                  href={`https://www.youtube.com/playlist?list=${topic.youtubePlaylistId}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/10 text-red-500 text-sm font-medium hover:bg-red-500/20 transition-colors border border-red-500/20"
                                >
                                  <Youtube className="w-4 h-4" /> YouTube Playlist
                                  <ExternalLink className="w-3 h-3" />
                                </a>
                              )}
                              {topic.gfgArticleUrl && (
                                <a
                                  href={topic.gfgArticleUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 text-green-500 text-sm font-medium hover:bg-green-500/20 transition-colors border border-green-500/20"
                                >
                                  <Globe className="w-4 h-4" /> GeeksforGeeks
                                  <ExternalLink className="w-3 h-3" />
                                </a>
                              )}
                              {topic.documentationLinks?.map((link, i) => (
                                <a
                                  key={i}
                                  href={link}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 text-blue-500 text-sm font-medium hover:bg-blue-500/20 transition-colors border border-blue-500/20"
                                >
                                  <BookOpen className="w-4 h-4" /> Reference {i + 1}
                                  <ExternalLink className="w-3 h-3" />
                                </a>
                              ))}
                            </div>

                            {/* Videos */}
                            {topic.youtubePlaylistId && (
                              <div>
                                <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                                  <Play className="w-4 h-4 text-red-500" /> Playlist Videos
                                </h4>
                                {loadingVideos === topic.youtubePlaylistId ? (
                                  <div className="flex items-center gap-2 py-4 text-sm text-muted-foreground">
                                    <Loader2 className="w-4 h-4 animate-spin" /> Loading videos...
                                  </div>
                                ) : (topicVideos[topic.youtubePlaylistId]?.length || 0) > 0 ? (
                                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                    {topicVideos[topic.youtubePlaylistId].slice(0, 6).map((video, vi) => (
                                      <a
                                        key={vi}
                                        href={video.videoUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="group rounded-lg border border-border/40 overflow-hidden hover:shadow-md transition-all bg-card"
                                      >
                                        {video.thumbnail && (
                                          <div className="relative aspect-video overflow-hidden">
                                            <img
                                              src={video.thumbnail}
                                              alt={video.title}
                                              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                                            />
                                            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                                              <div className="bg-red-600 rounded-full p-2">
                                                <Play className="w-4 h-4 text-white fill-white" />
                                              </div>
                                            </div>
                                          </div>
                                        )}
                                        <div className="p-3">
                                          <h5 className="text-xs font-semibold text-foreground line-clamp-2 group-hover:text-primary transition-colors">
                                            {video.title}
                                          </h5>
                                        </div>
                                      </a>
                                    ))}
                                  </div>
                                ) : (
                                  <p className="text-sm text-muted-foreground py-2">
                                    No videos loaded. <a
                                      href={`https://www.youtube.com/playlist?list=${topic.youtubePlaylistId}`}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-primary hover:underline"
                                    >Watch on YouTube →</a>
                                  </p>
                                )}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
