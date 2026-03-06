import { useState, useEffect } from "react";
import { useRoute } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import {
    Loader2,
    ArrowLeft,
    Calendar,
    Code,
    Trophy,
    Zap,
    Target,
    ExternalLink,
} from "lucide-react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";

interface PublicUser {
    _id: string;
    name: string;
    email: string;
    college: string;
    profilePicture: string;
    platformIds: {
        leetcodeId?: string;
        codeforcesId?: string;
        codechefId?: string;
        hackerrankId?: string;
    };
    xp: number;
    level: number;
    totalSolved: number;
    dailyQuestionsSolved: number;
    contestsParticipated: number;
    statsCache: any;
    joinedAt: string;
}

export default function UserProfile() {
    const [, params] = useRoute("/user/:id");
    const [, navigate] = useLocation();
    const { token } = useAuth();
    const [user, setUser] = useState<PublicUser | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const userId = params?.id;

    useEffect(() => {
        if (!userId) return;
        setLoading(true);
        fetch(`/api/user/profile/${userId}`)
            .then((res) => res.json())
            .then((data) => {
                if (data.user) {
                    setUser(data.user);
                } else {
                    setError(data.message || "User not found");
                }
            })
            .catch(() => setError("Failed to fetch user profile"))
            .finally(() => setLoading(false));
    }, [userId]);

    if (loading) {
        return (
            <div className="py-20 flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    if (error || !user) {
        return (
            <div className="py-20 text-center space-y-4">
                <h2 className="text-2xl font-bold text-foreground">User Not Found</h2>
                <p className="text-muted-foreground">{error || "This profile doesn't exist."}</p>
                <Button variant="outline" onClick={() => navigate("/leaderboard")} className="gap-2">
                    <ArrowLeft className="w-4 h-4" /> Back to Leaderboard
                </Button>
            </div>
        );
    }

    const initials = user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);

    const xpInLevel = user.xp % 100;
    const joinDate = new Date(user.joinedAt).toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
    });

    const platformLinks = [
        {
            id: user.platformIds?.leetcodeId,
            name: "LeetCode",
            url: `https://leetcode.com/${user.platformIds?.leetcodeId}`,
            color: "text-amber-500",
            stats: user.statsCache?.leetcode,
        },
        {
            id: user.platformIds?.codeforcesId,
            name: "Codeforces",
            url: `https://codeforces.com/profile/${user.platformIds?.codeforcesId}`,
            color: "text-blue-500",
            stats: user.statsCache?.codeforces,
        },
        {
            id: user.platformIds?.codechefId,
            name: "CodeChef",
            url: `https://www.codechef.com/users/${user.platformIds?.codechefId}`,
            color: "text-red-500",
            stats: user.statsCache?.codechef,
        },
        {
            id: user.platformIds?.hackerrankId,
            name: "HackerRank",
            url: `https://www.hackerrank.com/${user.platformIds?.hackerrankId}`,
            color: "text-green-500",
            stats: user.statsCache?.hackerrank,
        },
    ].filter((p) => p.id);

    return (
        <div className="py-10 animate-in fade-in duration-500 max-w-5xl mx-auto">
            {/* Back button */}
            <Button variant="ghost" className="mb-6 gap-2 text-muted-foreground hover:text-foreground" onClick={() => navigate("/leaderboard")}>
                <ArrowLeft className="w-4 h-4" /> Back to Leaderboard
            </Button>

            {/* Profile Header */}
            <div className="relative mb-16">
                <div className="h-48 md:h-64 w-full rounded-3xl bg-gradient-to-r from-primary/20 via-secondary/20 to-primary/10 border border-border/50 overflow-hidden relative">
                    <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, hsl(var(--primary)) 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>
                </div>

                <div className="absolute -bottom-12 left-8 md:left-12 flex items-end gap-6">
                    <Avatar className="h-28 w-28 md:h-32 md:w-32 border-4 border-background bg-background shadow-xl">
                        {user.profilePicture ? (
                            <AvatarImage src={user.profilePicture} alt={user.name} />
                        ) : null}
                        <AvatarFallback className="bg-primary/10 text-primary text-4xl font-serif">{initials}</AvatarFallback>
                    </Avatar>
                    <div className="mb-2 hidden md:block pb-12">
                        <h1 className="text-3xl font-bold text-foreground">{user.name}</h1>
                        <p className="text-muted-foreground font-medium flex items-center gap-2">
                            {user.college || "No college set"}
                            <span className="w-1.5 h-1.5 rounded-full bg-border"></span>
                            <Calendar className="w-3.5 h-3.5" /> Joined {joinDate}
                        </p>
                    </div>
                </div>
            </div>

            {/* Mobile Title */}
            <div className="mb-8 px-4 md:hidden text-center mt-16">
                <h1 className="text-2xl font-bold text-foreground">{user.name}</h1>
                <p className="text-muted-foreground text-sm">{user.college || "No college set"} &bull; Joined {joinDate}</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Stats */}
                <div className="space-y-6">
                    <Card className="border-border/50 shadow-sm">
                        <CardContent className="p-6 space-y-6">
                            <div>
                                <div className="flex justify-between items-end mb-2">
                                    <span className="font-serif font-bold text-lg">Level {user.level}</span>
                                    <span className="text-sm font-bold text-primary">{user.xp} XP</span>
                                </div>
                                <Progress value={xpInLevel} className="h-2.5 bg-primary/20" />
                                <p className="text-xs text-muted-foreground text-right mt-2">{100 - xpInLevel} XP to next level</p>
                            </div>

                            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border/40">
                                <div className="text-center p-3 bg-card/50 rounded-xl border border-border/30">
                                    <div className="text-2xl font-bold text-primary flex items-center justify-center gap-1">
                                        <Zap className="w-5 h-5" />
                                        {user.xp}
                                    </div>
                                    <div className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Total XP</div>
                                </div>
                                <div className="text-center p-3 bg-card/50 rounded-xl border border-border/30">
                                    <div className="text-2xl font-bold text-foreground flex items-center justify-center gap-1">
                                        <Target className="w-5 h-5" />
                                        {user.totalSolved}
                                    </div>
                                    <div className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Total Solved</div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="text-center p-3 bg-card/50 rounded-xl border border-border/30">
                                    <div className="text-2xl font-bold text-foreground">{user.dailyQuestionsSolved}</div>
                                    <div className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Daily Qs</div>
                                </div>
                                <div className="text-center p-3 bg-card/50 rounded-xl border border-border/30">
                                    <div className="text-2xl font-bold text-foreground flex items-center justify-center gap-1">
                                        <Trophy className="w-5 h-5" />
                                        {user.contestsParticipated}
                                    </div>
                                    <div className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Contests</div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column: Platform Stats */}
                <div className="lg:col-span-2 space-y-6">
                    <Card className="border-border/50 shadow-sm">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-lg flex items-center gap-2">
                                <Code className="w-5 h-5" /> Coding Platforms
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {platformLinks.length > 0 ? (
                                platformLinks.map((platform, idx) => (
                                    <div key={idx} className="p-4 rounded-lg border border-border/30 hover:bg-primary/5 transition-colors">
                                        <div className="flex items-center justify-between mb-2">
                                            <div className={`font-bold text-sm ${platform.color}`}>
                                                {platform.name} — {platform.id}
                                            </div>
                                            <a
                                                href={platform.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-primary hover:text-primary/80 inline-flex items-center gap-1 text-xs"
                                            >
                                                Visit <ExternalLink className="w-3 h-3" />
                                            </a>
                                        </div>
                                        {platform.stats && (
                                            <div className="text-xs text-muted-foreground space-y-0.5">
                                                {platform.name === "LeetCode" && platform.stats.totalSolved !== undefined && (
                                                    <p>Solved: {platform.stats.totalSolved} (E:{platform.stats.easySolved} M:{platform.stats.mediumSolved} H:{platform.stats.hardSolved})</p>
                                                )}
                                                {platform.name === "Codeforces" && platform.stats.rating !== undefined && (
                                                    <p>Rating: {platform.stats.rating} | Solved: {platform.stats.problemsSolved}</p>
                                                )}
                                                {platform.name === "CodeChef" && platform.stats.rating !== undefined && (
                                                    <p>Rating: {platform.stats.rating} ({platform.stats.stars}) | Solved: {platform.stats.problemsSolved}</p>
                                                )}
                                                {platform.name === "HackerRank" && platform.stats.problemsSolved !== undefined && (
                                                    <p>Solved: {platform.stats.problemsSolved} | Badges: {platform.stats.badges?.length || 0}</p>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                ))
                            ) : (
                                <p className="text-sm text-muted-foreground text-center py-4">No platform IDs linked yet.</p>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
