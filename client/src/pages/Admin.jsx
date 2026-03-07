import React from "react";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Badge } from "../components/ui/badge";
import {
    Users, Trash2, Plus, Loader2, Shield, BookOpen, Star,
    AlertCircle, CheckCircle, ShieldCheck, ShieldOff
} from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import API_BASE from "../config/api.js";

export default function Admin() {
    const { user, token } = useAuth();
    const [activeTab, setActiveTab] = useState("users");
    const [users, setUsers] = useState([]);
    const [specialQuestions, setSpecialQuestions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    // Special question form
    const [sqTitle, setSqTitle] = useState("");
    const [sqPlatform, setSqPlatform] = useState("leetcode");
    const [sqLink, setSqLink] = useState("");
    const [sqPoints, setSqPoints] = useState(50);

    // Resource form
    const [resTitle, setResTitle] = useState("");
    const [resCategory, setResCategory] = useState("");
    const [resSubcategory, setResSubcategory] = useState("");
    const [resYoutubeId, setResYoutubeId] = useState("");
    const [resGfgLink, setResGfgLink] = useState("");
    const [resDifficulty, setResDifficulty] = useState("Easy");
    const [resOrder, setResOrder] = useState(0);
    const [resources, setResources] = useState([]);

    // Check if user is admin
    if (!user || user.role !== "admin") {
        return (
            <div className="py-20 text-center animate-in fade-in duration-500">
                <Shield className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-foreground">Access Denied</h2>
                <p className="text-muted-foreground mt-2">You don't have admin privileges.</p>
            </div>
        );
    }

    const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
    };

    const showMessage = (msg) => {
        setMessage(msg);
        setTimeout(() => setMessage(""), 3000);
    };

    // Fetch functions
    const fetchUsers = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${API_BASE}/admin/users`, { headers });
            const data = await res.json();
            setUsers(data.users || []);
        } catch { setUsers([]); }
        finally { setLoading(false); }
    };

    const fetchSpecialQuestions = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${API_BASE}/admin/special-questions`, { headers });
            const data = await res.json();
            setSpecialQuestions(data.questions || []);
        } catch { setSpecialQuestions([]); }
        finally { setLoading(false); }
    };

    const fetchResources = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${API_BASE}/resources`, { headers });
            const data = await res.json();
            setResources(data.resources || []);
        } catch { setResources([]); }
        finally { setLoading(false); }
    };

    useEffect(() => {
        if (activeTab === "users") fetchUsers();
        else if (activeTab === "special") fetchSpecialQuestions();
        else if (activeTab === "resources") fetchResources();
    }, [activeTab]);

    // Actions
    const handleDeleteUser = async (id) => {
        if (!confirm("Are you sure you want to delete this user?")) return;
        try {
            const res = await fetch(`${API_BASE}/admin/users/${id}`, {
                method: "DELETE", headers
            });
            const data = await res.json();
            showMessage(data.message);
            fetchUsers();
        } catch { showMessage("Error deleting user"); }
    };

    const handleToggleRole = async (id, currentRole) => {
        const newRole = currentRole === "admin" ? "student" : "admin";
        if (!confirm(`Change this user's role to "${newRole}"?`)) return;
        try {
            const res = await fetch(`${API_BASE}/admin/users/${id}/role`, {
                method: "PUT", headers,
                body: JSON.stringify({ role: newRole })
            });
            const data = await res.json();
            showMessage(data.message);
            if (res.ok) fetchUsers();
        } catch { showMessage("Error updating role"); }
    };

    const handleAddSpecialQuestion = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(`${API_BASE}/admin/special-question`, {
                method: "POST", headers,
                body: JSON.stringify({
                    title: sqTitle, platform: sqPlatform,
                    problemLink: sqLink, points: sqPoints, date: new Date()
                })
            });
            const data = await res.json();
            showMessage(data.message);
            if (res.ok) {
                setSqTitle(""); setSqLink(""); setSqPoints(50);
                fetchSpecialQuestions();
            }
        } catch { showMessage("Error adding special question"); }
    };

    const handleAddResource = async (e) => {
        e.preventDefault();
        // Combine category and subcategory for the backend category field
        const fullCategory = resSubcategory ? `${resCategory} > ${resSubcategory}` : resCategory;
        try {
            const res = await fetch(`${API_BASE}/admin/resources`, {
                method: "POST", headers,
                body: JSON.stringify({
                    title: resTitle, category: fullCategory,
                    youtubeVideoId: resYoutubeId, gfgLink: resGfgLink,
                    difficulty: resDifficulty, order: resOrder
                })
            });
            const data = await res.json();
            showMessage(data.message);
            if (res.ok) {
                setResTitle(""); setResSubcategory(""); setResYoutubeId("");
                setResGfgLink(""); setResOrder(0);
                fetchResources();
            }
        } catch { showMessage("Error adding resource"); }
    };

    const handleDeleteResource = async (id) => {
        if (!confirm("Delete this resource?")) return;
        try {
            const res = await fetch(`${API_BASE}/admin/resources/${id}`, {
                method: "DELETE", headers
            });
            const data = await res.json();
            showMessage(data.message);
            fetchResources();
        } catch { showMessage("Error deleting resource"); }
    };

    const tabs = [
        { key: "users", label: "Users", icon: <Users className="w-4 h-4" /> },
        { key: "special", label: "Special Questions", icon: <Star className="w-4 h-4" /> },
        { key: "resources", label: "Resources", icon: <BookOpen className="w-4 h-4" /> }
    ];

    return (
        <div className="py-10 space-y-8 animate-in fade-in duration-500">
            <div className="flex items-center gap-3">
                <Shield className="w-8 h-8 text-primary" />
                <div>
                    <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
                    <p className="text-muted-foreground">Manage users, questions, and resources</p>
                </div>
            </div>

            {message && (
                <div className="bg-primary/10 border border-primary/30 text-primary rounded-lg p-3 flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4" /> {message}
                </div>
            )}

            <div className="flex flex-wrap gap-2">
                {tabs.map(tab => (
                    <Button
                        key={tab.key}
                        variant={activeTab === tab.key ? "outline" : "ghost"}
                        className={`gap-2 ${activeTab === tab.key ? "bg-primary/10 text-primary border-primary" : ""}`}
                        onClick={() => setActiveTab(tab.key)}
                    >
                        {tab.icon} {tab.label}
                    </Button>
                ))}
            </div>

            {loading ? (
                <div className="flex items-center justify-center py-16">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
            ) : (
                <>
                    {/* Users Tab */}
                    {activeTab === "users" && (
                        <Card className="border-border/50 shadow-sm">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Users className="w-5 h-5" /> All Users ({users.length})
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm text-left">
                                        <thead className="text-xs text-muted-foreground uppercase bg-card/50 border-b border-border">
                                            <tr>
                                                <th className="px-4 py-3">Name</th>
                                                <th className="px-4 py-3">Email</th>
                                                <th className="px-4 py-3">Role</th>
                                                <th className="px-4 py-3">XP</th>
                                                <th className="px-4 py-3">Level</th>
                                                <th className="px-4 py-3 text-right">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {users.map(u => (
                                                <tr key={u._id} className="border-b border-border/40 hover:bg-muted/30">
                                                    <td className="px-4 py-3 font-medium">{u.name}</td>
                                                    <td className="px-4 py-3 text-muted-foreground">{u.email}</td>
                                                    <td className="px-4 py-3">
                                                        <Badge variant={u.role === "admin" ? "default" : "secondary"}
                                                            className={u.role === "admin" ? "bg-primary text-white" : ""}>
                                                            {u.role}
                                                        </Badge>
                                                    </td>
                                                    <td className="px-4 py-3 font-bold text-primary">{u.xp}</td>
                                                    <td className="px-4 py-3">{u.level}</td>
                                                    <td className="px-4 py-3 text-right">
                                                        <div className="flex items-center justify-end gap-1">
                                                            {/* Role toggle — not for self */}
                                                            {u._id !== user._id && (
                                                                <Button variant="ghost" size="sm"
                                                                    className={u.role === "admin" ? "text-amber-600 hover:bg-amber-50" : "text-emerald-600 hover:bg-emerald-50"}
                                                                    title={u.role === "admin" ? "Demote to Student" : "Promote to Admin"}
                                                                    onClick={() => handleToggleRole(u._id, u.role)}>
                                                                    {u.role === "admin"
                                                                        ? <ShieldOff className="w-4 h-4" />
                                                                        : <ShieldCheck className="w-4 h-4" />}
                                                                </Button>
                                                            )}
                                                            {/* Delete — not for admins or self */}
                                                            {u.role !== "admin" && u._id !== user._id && (
                                                                <Button variant="ghost" size="sm"
                                                                    className="text-destructive hover:bg-destructive/10"
                                                                    onClick={() => handleDeleteUser(u._id)}>
                                                                    <Trash2 className="w-4 h-4" />
                                                                </Button>
                                                            )}
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Special Questions Tab */}
                    {activeTab === "special" && (
                        <div className="space-y-6">
                            <Card className="border-border/50 shadow-sm">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Plus className="w-5 h-5" /> Add Special Question
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <form onSubmit={handleAddSpecialQuestion} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label>Title</Label>
                                            <Input value={sqTitle} onChange={e => setSqTitle(e.target.value)}
                                                placeholder="Two Sum" required />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Platform</Label>
                                            <select value={sqPlatform} onChange={e => setSqPlatform(e.target.value)}
                                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                                                <option value="leetcode">LeetCode</option>
                                                <option value="codeforces">Codeforces</option>
                                                <option value="codechef">CodeChef</option>
                                                <option value="gfg">GeeksForGeeks</option>
                                                <option value="other">Other</option>
                                            </select>
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Problem Link</Label>
                                            <Input value={sqLink} onChange={e => setSqLink(e.target.value)}
                                                placeholder="https://leetcode.com/problems/two-sum" required />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Points (XP)</Label>
                                            <Input type="number" value={sqPoints} onChange={e => setSqPoints(Number(e.target.value))}
                                                min={1} />
                                        </div>
                                        <div className="md:col-span-2">
                                            <Button type="submit" className="bg-primary hover:bg-secondary text-white gap-2">
                                                <Plus className="w-4 h-4" /> Add Question
                                            </Button>
                                        </div>
                                    </form>
                                </CardContent>
                            </Card>

                            <Card className="border-border/50 shadow-sm">
                                <CardHeader>
                                    <CardTitle>Recent Special Questions</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {specialQuestions.length === 0 ? (
                                        <p className="text-muted-foreground text-center py-4">No special questions yet.</p>
                                    ) : (
                                        <div className="space-y-3">
                                            {specialQuestions.map(q => (
                                                <div key={q._id} className="flex items-center justify-between p-3 rounded-lg border border-border/40 hover:bg-muted/30">
                                                    <div>
                                                        <div className="font-semibold text-foreground">{q.title}</div>
                                                        <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                                                            <Badge variant="outline" className="text-xs capitalize">{q.platform}</Badge>
                                                            <span>{q.points} XP</span>
                                                            <span>{new Date(q.date).toLocaleDateString()}</span>
                                                            <span>{q.solvedUsers?.length || 0} solvers</span>
                                                        </div>
                                                    </div>
                                                    <a href={q.problemLink} target="_blank" rel="noopener noreferrer">
                                                        <Button variant="ghost" size="sm">Open</Button>
                                                    </a>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </div>
                    )}

                    {/* Resources Tab */}
                    {activeTab === "resources" && (
                        <div className="space-y-6">
                            <Card className="border-border/50 shadow-sm">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Plus className="w-5 h-5" /> Add Resource
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <form onSubmit={handleAddResource} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label>Title</Label>
                                            <Input value={resTitle} onChange={e => setResTitle(e.target.value)}
                                                placeholder="Arrays Introduction" required />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Category (e.g. "Data Structures")</Label>
                                            <Input value={resCategory} onChange={e => setResCategory(e.target.value)}
                                                placeholder="Data Structures" required />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Subcategory (e.g. "Arrays")</Label>
                                            <Input value={resSubcategory} onChange={e => setResSubcategory(e.target.value)}
                                                placeholder="Arrays" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>YouTube Video ID</Label>
                                            <Input value={resYoutubeId} onChange={e => setResYoutubeId(e.target.value)}
                                                placeholder="dQw4w9WgXcQ (optional)" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>GFG / Practice Link</Label>
                                            <Input value={resGfgLink} onChange={e => setResGfgLink(e.target.value)}
                                                placeholder="https://geeksforgeeks.org/... (optional)" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Difficulty</Label>
                                            <select value={resDifficulty} onChange={e => setResDifficulty(e.target.value)}
                                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                                                <option value="Easy">Easy</option>
                                                <option value="Medium">Medium</option>
                                                <option value="Hard">Hard</option>
                                            </select>
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Order (sorting)</Label>
                                            <Input type="number" value={resOrder} onChange={e => setResOrder(Number(e.target.value))} />
                                        </div>
                                        <div className="md:col-span-2">
                                            <Button type="submit" className="bg-primary hover:bg-secondary text-white gap-2">
                                                <Plus className="w-4 h-4" /> Add Resource
                                            </Button>
                                        </div>
                                    </form>
                                </CardContent>
                            </Card>

                            <Card className="border-border/50 shadow-sm">
                                <CardHeader>
                                    <CardTitle>All Resources ({resources.length})</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {resources.length === 0 ? (
                                        <p className="text-muted-foreground text-center py-4">No resources yet.</p>
                                    ) : (
                                        <div className="space-y-3">
                                            {resources.map(r => (
                                                <div key={r._id} className="flex items-center justify-between p-3 rounded-lg border border-border/40 hover:bg-muted/30">
                                                    <div>
                                                        <div className="font-semibold text-foreground">{r.title}</div>
                                                        <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                                                            <Badge variant="outline" className="text-xs">{r.category}</Badge>
                                                            <Badge variant="outline" className={`text-xs ${r.difficulty === "Easy" ? "text-green-500" : r.difficulty === "Medium" ? "text-amber-500" : "text-red-500"}`}>
                                                                {r.difficulty}
                                                            </Badge>
                                                            {r.youtubeVideoId && <span>📹 YouTube</span>}
                                                            {r.gfgLink && <span>📄 GFG</span>}
                                                        </div>
                                                    </div>
                                                    <Button variant="ghost" size="sm"
                                                        className="text-destructive hover:bg-destructive/10"
                                                        onClick={() => handleDeleteResource(r._id)}>
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
