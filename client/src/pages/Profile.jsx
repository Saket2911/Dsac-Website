import React from "react";
import { useState, useEffect } from "react";
import { useRoute } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Progress } from "../components/ui/progress";
import { LogOut, Loader2, Save, CheckCircle, Camera } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import API_BASE from "../config/api.js";

export default function Profile() {
  const { user, token, logout, updateUser } = useAuth();
  const [, params] = useRoute("/profile/:username");
  const isPublicView = !!params?.username;
  const [publicUser, setPublicUser] = useState(null);
  const [loadingPublic, setLoadingPublic] = useState(false);

  const [stats, setStats] = useState({});
  const [loadingStats, setLoadingStats] = useState(false);

  // Edit form state
  const [editName, setEditName] = useState(user?.name || "");
  const [editCollege, setEditCollege] = useState(user?.college || "");
  const [editLeetcode, setEditLeetcode] = useState(user?.platformIds?.leetcodeId || "");
  const [editCodeforces, setEditCodeforces] = useState(user?.platformIds?.codeforcesId || "");
  const [editCodechef, setEditCodechef] = useState(user?.platformIds?.codechefId || "");
  const [editHackerrank, setEditHackerrank] = useState(user?.platformIds?.hackerrankId || "");
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);

  // Fetch public profile if viewing another user
  useEffect(() => {
    if (isPublicView && params.username) {
      setLoadingPublic(true);
      fetch(`${API_BASE}/user/public/${encodeURIComponent(params.username)}`)
        .then(res => res.json())
        .then(data => {
          if (data.user) setPublicUser(data.user);
        })
        .catch(() => { })
        .finally(() => setLoadingPublic(false));
    }
  }, [isPublicView, params?.username]);

  // Sync form state when user changes
  useEffect(() => {
    if (user && !isPublicView) {
      setEditName(user.name);
      setEditCollege(user.college || "");
      setEditLeetcode(user.platformIds?.leetcodeId || "");
      setEditCodeforces(user.platformIds?.codeforcesId || "");
      setEditCodechef(user.platformIds?.codechefId || "");
      setEditHackerrank(user.platformIds?.hackerrankId || "");
    }
  }, [user, isPublicView]);

  // Fetch platform stats
  useEffect(() => {
    if (token && !isPublicView) {
      setLoadingStats(true);
      fetch(`${API_BASE}/user/stats`, {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(data => { if (data.stats) setStats(data.stats); })
        .catch(() => { })
        .finally(() => setLoadingStats(false));
    }
  }, [token, isPublicView]);

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !token) return;
    setUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append("profileImage", file);
      const res = await fetch(`${API_BASE}/user/profile/upload-image`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData
      });
      const data = await res.json();
      if (res.ok && data.user) {
        updateUser(data.user);
        setSaveMessage("Profile image updated!");
        setTimeout(() => setSaveMessage(""), 3000);
      }
    } catch {
      setSaveMessage("Failed to upload image");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSaveProfile = async () => {
    if (!token) return;
    setSaving(true);
    setSaveMessage("");
    try {
      const res = await fetch(`${API_BASE}/user/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          name: editName, college: editCollege,
          leetcodeId: editLeetcode, codeforcesId: editCodeforces,
          codechefId: editCodechef, hackerrankId: editHackerrank
        })
      });
      const data = await res.json();
      if (res.ok && data.user) {
        updateUser(data.user);
        setSaveMessage("Profile updated successfully!");
        setTimeout(() => setSaveMessage(""), 3000);
      } else {
        setSaveMessage(data.message || "Failed to update profile");
      }
    } catch {
      setSaveMessage("Network error. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  // Loading states
  if (isPublicView && loadingPublic) {
    return <div className="py-10 flex items-center justify-center">
      <Loader2 className="w-8 h-8 animate-spin text-primary" />
    </div>;
  }

  const displayUser = isPublicView ? publicUser : user;
  if (!displayUser) {
    return <div className="py-10 flex items-center justify-center">
      <Loader2 className="w-8 h-8 animate-spin text-primary" />
    </div>;
  }

  const displayStats = isPublicView ? (publicUser?.statsCache || {}) : stats;
  const initials = displayUser.name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
  const xpInLevel = displayUser.xp % 100;
  const xpProgress = xpInLevel;
  const profileImageUrl = displayUser.profileImage
    ? displayUser.profileImage
    : null;

  return (
    <div className="py-10 animate-in fade-in duration-500 max-w-5xl mx-auto">
      {/* Profile Header */}
      <div className="relative mb-16">
        <div className="h-48 md:h-64 w-full rounded-3xl bg-gradient-to-r from-primary/20 via-secondary/20 to-primary/10 border border-border/50 overflow-hidden relative">
          <div className="absolute inset-0 opacity-20" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, hsl(var(--primary)) 1px, transparent 0)',
            backgroundSize: '24px 24px'
          }}></div>
        </div>

        <div className="absolute -bottom-12 left-8 md:left-12 flex items-end gap-6">
          <div className="relative group">
            <Avatar className="h-28 w-28 md:h-32 md:w-32 border-4 border-background bg-background shadow-xl">
              {profileImageUrl && <AvatarImage src={profileImageUrl} alt={displayUser.name} />}
              <AvatarFallback className="bg-primary/10 text-primary text-4xl font-serif">{initials}</AvatarFallback>
            </Avatar>
            {!isPublicView && (
              <label className="absolute bottom-0 right-0 w-10 h-10 bg-primary rounded-full flex items-center justify-center cursor-pointer shadow-lg hover:bg-secondary transition-colors group-hover:scale-110">
                {uploadingImage
                  ? <Loader2 className="w-5 h-5 text-white animate-spin" />
                  : <Camera className="w-5 h-5 text-white" />}
                <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={uploadingImage} />
              </label>
            )}
          </div>
          <div className="mb-2 hidden md:block pb-12">
            <h1 className="text-3xl font-bold text-foreground">{displayUser.name}</h1>
            <p className="text-muted-foreground font-medium flex items-center gap-2">
              {displayUser.college || "No college set"} <span className="w-1.5 h-1.5 rounded-full bg-border"></span> {displayUser.email}
            </p>
          </div>
        </div>

        {!isPublicView && (
          <div className="absolute bottom-4 right-8 flex gap-3">
            <Button variant="outline" className="bg-background/80 backdrop-blur text-foreground border-border/50 gap-2" onClick={logout}>
              <LogOut className="w-4 h-4" /> Sign Out
            </Button>
          </div>
        )}
      </div>

      {/* Mobile Title */}
      <div className="mb-8 px-4 md:hidden text-center mt-16">
        <h1 className="text-2xl font-bold text-foreground">{displayUser.name}</h1>
        <p className="text-muted-foreground text-sm">{displayUser.college || "No college set"} &bull; {displayUser.email}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Stats & Platform IDs */}
        <div className="space-y-6">
          <Card className="border-border/50 shadow-sm">
            <CardContent className="p-6">
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between items-end mb-2">
                    <span className="font-serif font-bold text-lg">Level {displayUser.level}</span>
                    <span className="text-sm font-bold text-primary">{displayUser.xp} XP</span>
                  </div>
                  <Progress value={xpProgress} className="h-2.5 bg-primary/20" />
                  <p className="text-xs text-muted-foreground text-right mt-2">{100 - xpInLevel} XP to next level</p>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border/40">
                  <div className="text-center p-3 bg-card/50 rounded-xl border border-border/30">
                    <div className="text-2xl font-bold text-foreground mb-1">Lvl {displayUser.level}</div>
                    <div className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Level</div>
                  </div>
                  <div className="text-center p-3 bg-card/50 rounded-xl border border-border/30">
                    <div className="text-2xl font-bold text-primary flex items-center justify-center gap-1">
                      {displayUser.xp}
                    </div>
                    <div className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Total XP</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Platform Stats */}
          <Card className="border-border/50 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Platform Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {(!isPublicView && loadingStats) ? (
                <div className="flex items-center justify-center py-4">
                  <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
                  <span className="text-sm text-muted-foreground ml-2">Fetching stats...</span>
                </div>
              ) : (
                <>
                  {displayStats.leetcode && (
                    <div className="p-3 rounded-lg hover:bg-primary/5 border border-border/30">
                      <div className="font-semibold text-sm text-foreground mb-1">LeetCode — {displayUser.platformIds?.leetcodeId}</div>
                      <div className="text-xs text-muted-foreground space-y-0.5">
                        <p>Solved: {displayStats.leetcode.totalSolved} (E:{displayStats.leetcode.easySolved} M:{displayStats.leetcode.mediumSolved} H:{displayStats.leetcode.hardSolved})</p>
                        {displayStats.leetcode.contestRating > 0 && <p>Contest Rating: {displayStats.leetcode.contestRating}</p>}
                      </div>
                    </div>
                  )}
                  {displayStats.codeforces && (
                    <div className="p-3 rounded-lg hover:bg-primary/5 border border-border/30">
                      <div className="font-semibold text-sm text-foreground mb-1">Codeforces — {displayUser.platformIds?.codeforcesId}</div>
                      <div className="text-xs text-muted-foreground">
                        <p>Rating: {displayStats.codeforces.rating} | Solved: {displayStats.codeforces.problemsSolved}</p>
                      </div>
                    </div>
                  )}
                  {displayStats.codechef && (
                    <div className="p-3 rounded-lg hover:bg-primary/5 border border-border/30">
                      <div className="font-semibold text-sm text-foreground mb-1">CodeChef — {displayUser.platformIds?.codechefId}</div>
                      <div className="text-xs text-muted-foreground">
                        <p>Rating: {displayStats.codechef.rating} ({displayStats.codechef.stars}) | Solved: {displayStats.codechef.problemsSolved}</p>
                      </div>
                    </div>
                  )}
                  {displayStats.hackerrank && (
                    <div className="p-3 rounded-lg hover:bg-primary/5 border border-border/30">
                      <div className="font-semibold text-sm text-foreground mb-1">HackerRank — {displayUser.platformIds?.hackerrankId}</div>
                      <div className="text-xs text-muted-foreground">
                        <p>Solved: {displayStats.hackerrank.problemsSolved} | Badges: {displayStats.hackerrank.badges?.length || 0}</p>
                      </div>
                    </div>
                  )}
                  {!displayStats.leetcode && !displayStats.codeforces && !displayStats.codechef && !displayStats.hackerrank && (
                    <p className="text-sm text-muted-foreground text-center py-2">No platform IDs set. Add them in Edit Profile to see your stats.</p>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Tabs */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="achievements" className="w-full">
            <TabsList className="w-full flex justify-start bg-transparent border-b border-border rounded-none h-auto p-0 gap-6">
              <TabsTrigger value="achievements" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-2 py-3 font-medium text-base">
                Achievements
              </TabsTrigger>
              {!isPublicView && (
                <TabsTrigger value="edit" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-2 py-3 font-medium text-base ml-auto">
                  Edit Profile
                </TabsTrigger>
              )}
            </TabsList>

            <TabsContent value="achievements" className="pt-6 space-y-6">
              <div>
                <h3 className="text-xl font-serif font-bold text-foreground mb-4">Your Progress</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {[
                    { name: "First Blood", icon: "🩸", desc: "Solved first daily question", unlocked: displayUser.xp >= 10 },
                    { name: "Rising Star", icon: "⭐", desc: "Reached Level 5", unlocked: displayUser.level >= 5 },
                    { name: "Dedicated", icon: "🔥", desc: "Earned 500 XP", unlocked: displayUser.xp >= 500 },
                    { name: "Veteran", icon: "🏆", desc: "Reached Level 10", unlocked: displayUser.level >= 10 },
                    { name: "Expert", icon: "💎", desc: "Earned 1000 XP", unlocked: displayUser.xp >= 1000 }
                  ].map((badge, i) => (
                    <div key={i} className={`bg-card border rounded-2xl p-4 text-center transition-shadow group ${badge.unlocked ? 'border-primary/30 hover:shadow-md' : 'border-border/30 border-dashed opacity-50'}`}>
                      <div className={`w-16 h-16 rounded-full mx-auto flex items-center justify-center text-3xl mb-3 border group-hover:scale-110 transition-transform ${badge.unlocked ? 'bg-gradient-to-br from-primary/10 to-primary/30 border-primary/20' : 'bg-muted border-muted'}`}>
                        {badge.unlocked ? badge.icon : "🔒"}
                      </div>
                      <h4 className="font-bold text-sm text-foreground">{badge.name}</h4>
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{badge.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            {!isPublicView && (
              <TabsContent value="edit" className="pt-6">
                <Card className="border-border/50 shadow-sm">
                  <CardHeader>
                    <CardTitle>Personal Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="editName">Full Name</Label>
                        <Input id="editName" value={editName} onChange={e => setEditName(e.target.value)} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="editEmail">Email</Label>
                        <Input id="editEmail" type="email" value={user.email} disabled />
                        <p className="text-xs text-muted-foreground">Email cannot be changed.</p>
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="editCollege">College</Label>
                        <Input id="editCollege" value={editCollege} onChange={e => setEditCollege(e.target.value)} placeholder="Vasavi College of Engineering" />
                      </div>
                    </div>

                    <div className="space-y-4 pt-4 border-t border-border/40">
                      <h4 className="font-semibold text-sm text-foreground">Platform IDs</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="editLeetcode">LeetCode Username</Label>
                          <Input id="editLeetcode" value={editLeetcode} onChange={e => setEditLeetcode(e.target.value)} placeholder="your_leetcode_id" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="editCodeforces">Codeforces Handle</Label>
                          <Input id="editCodeforces" value={editCodeforces} onChange={e => setEditCodeforces(e.target.value)} placeholder="your_cf_handle" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="editCodechef">CodeChef Username</Label>
                          <Input id="editCodechef" value={editCodechef} onChange={e => setEditCodechef(e.target.value)} placeholder="your_codechef_id" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="editHackerrank">HackerRank Username</Label>
                          <Input id="editHackerrank" value={editHackerrank} onChange={e => setEditHackerrank(e.target.value)} placeholder="your_hackerrank_id" />
                        </div>
                      </div>
                    </div>

                    {saveMessage && (
                      <div className={`text-sm rounded-lg p-3 flex items-center gap-2 ${saveMessage.includes("success") || saveMessage.includes("updated") ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-500 border border-red-200"}`}>
                        {(saveMessage.includes("success") || saveMessage.includes("updated")) && <CheckCircle className="w-4 h-4" />}
                        {saveMessage}
                      </div>
                    )}

                    <div className="flex justify-end gap-4 pt-6">
                      <Button variant="outline" onClick={() => {
                        setEditName(user.name);
                        setEditCollege(user.college || "");
                        setEditLeetcode(user.platformIds?.leetcodeId || "");
                        setEditCodeforces(user.platformIds?.codeforcesId || "");
                        setEditCodechef(user.platformIds?.codechefId || "");
                        setEditHackerrank(user.platformIds?.hackerrankId || "");
                      }}>
                        Cancel
                      </Button>
                      <Button className="bg-primary hover:bg-secondary text-white gap-2" onClick={handleSaveProfile} disabled={saving}>
                        {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        Save Changes
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <div className="mt-8 flex justify-center">
                  <Button variant="ghost" className="text-destructive hover:bg-destructive/10 hover:text-destructive gap-2" onClick={logout}>
                    <LogOut className="w-4 h-4" /> Sign Out
                  </Button>
                </div>
              </TabsContent>
            )}
          </Tabs>
        </div>
      </div>
    </div>
  );
}