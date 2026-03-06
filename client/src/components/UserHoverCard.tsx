import { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Trophy, Zap, Target } from "lucide-react";
import { useLocation } from "wouter";

interface UserHoverCardProps {
    userId: string;
    name: string;
    xp: number;
    level: number;
    profilePicture?: string;
    solvedCount?: number;
    children: React.ReactNode;
}

export function UserHoverCard({ userId, name, xp, level, profilePicture, solvedCount, children }: UserHoverCardProps) {
    const [, navigate] = useLocation();

    const initials = name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);

    const handleClick = () => {
        navigate(`/user/${userId}`);
    };

    return (
        <HoverCard openDelay={300} closeDelay={100}>
            <HoverCardTrigger asChild>
                <button
                    onClick={handleClick}
                    className="font-semibold text-foreground hover:text-primary transition-colors cursor-pointer text-left"
                >
                    {children}
                </button>
            </HoverCardTrigger>
            <HoverCardContent className="w-72 p-0 overflow-hidden" side="right" align="start">
                {/* Mini header */}
                <div className="h-16 bg-gradient-to-r from-primary/20 via-secondary/20 to-primary/10 relative">
                    <div className="absolute bottom-0 left-4 translate-y-1/2">
                        <Avatar className="h-14 w-14 border-3 border-background shadow-md">
                            {profilePicture ? (
                                <AvatarImage src={profilePicture} alt={name} />
                            ) : null}
                            <AvatarFallback className="bg-primary/10 text-primary font-bold text-lg">
                                {initials}
                            </AvatarFallback>
                        </Avatar>
                    </div>
                </div>

                <div className="pt-10 pb-4 px-4 space-y-3">
                    <div>
                        <h4 className="font-bold text-foreground">{name}</h4>
                        <Badge variant="secondary" className="text-[10px] mt-1">Level {level}</Badge>
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-center">
                        <div className="bg-background/50 rounded-lg p-2 border border-border/30">
                            <div className="flex items-center justify-center gap-1 text-primary font-bold text-sm">
                                <Zap className="w-3 h-3" />
                                {xp}
                            </div>
                            <div className="text-[10px] text-muted-foreground mt-0.5">XP</div>
                        </div>
                        <div className="bg-background/50 rounded-lg p-2 border border-border/30">
                            <div className="flex items-center justify-center gap-1 text-foreground font-bold text-sm">
                                <Trophy className="w-3 h-3" />
                                {level}
                            </div>
                            <div className="text-[10px] text-muted-foreground mt-0.5">Level</div>
                        </div>
                        <div className="bg-background/50 rounded-lg p-2 border border-border/30">
                            <div className="flex items-center justify-center gap-1 text-foreground font-bold text-sm">
                                <Target className="w-3 h-3" />
                                {solvedCount ?? 0}
                            </div>
                            <div className="text-[10px] text-muted-foreground mt-0.5">Solved</div>
                        </div>
                    </div>

                    <p className="text-xs text-muted-foreground text-center">
                        Click to view full profile →
                    </p>
                </div>
            </HoverCardContent>
        </HoverCard>
    );
}
